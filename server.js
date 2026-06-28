import express from 'express';
import cors from 'cors';
import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from 'pg';
const { Pool } = pg;
import { PrismaPg } from '@prisma/adapter-pg';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Prisma Client with Driver Adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const snap = new midtransClient.Snap({
  isProduction: false, // Change to true if using production keys
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY || ''
});

// API Routes
app.get('/cekkoneksi', async (req, res) => {
  try {
    // Attempt a simple query to check connection
    await prisma.$queryRaw`SELECT 1`;
    res.send(`
      <html>
        <body style="font-family: sans-serif; padding: 40px; background: #0B0F19; color: #fff;">
          <h1 style="color: #34D399;">✅ Database Terkoneksi!</h1>
          <p>Aplikasi berhasil terhubung ke database PostgreSQL.</p>
          <a href="/" style="color: #22D3EE;">Kembali ke Beranda</a>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Database connection error:', error);
    res.send(`
      <html>
        <body style="font-family: sans-serif; padding: 40px; background: #0B0F19; color: #fff;">
          <h1 style="color: #F87171;">❌ Database Gagal Terkoneksi</h1>
          <p>Terdapat kendala saat mencoba terhubung ke database.</p>
          <div style="background: rgba(255,0,0,0.1); padding: 20px; border-radius: 8px; font-family: monospace; color: #FCA5A5; margin-bottom: 20px;">
            ${error.message || error.toString()}
          </div>
          <a href="/" style="color: #22D3EE;">Kembali ke Beranda</a>
        </body>
      </html>
    `);
  }
});


app.get('/api/admin/transactions', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return res.status(500).json({ message: 'Server configuration error: ADMIN_PASSWORD not set.' });
    }

    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return res.status(401).json({ message: 'Unauthorized: Invalid password' });
    }

    const transactions = await prisma.transaction.findMany({
      orderBy: { created_at: 'desc' }
    });

    res.json(transactions);
  } catch (error) {
    console.error('Admin API error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.post('/api/checkout', async (req, res) => {
  try {
    const { participant, paymentOption, totalAmount } = req.body;
    const orderId = `ORDER-${uuidv4()}`;

    // 1. Save Pending Transaction to Postgres using Prisma
    try {
      await prisma.transaction.create({
        data: {
          midtrans_order_id: orderId,
          name: participant.name,
          phone: participant.phone,
          city: participant.city,
          job: participant.job,
          payment_option: paymentOption,
          total_amount: totalAmount,
          status: 'PENDING'
        }
      });
    } catch (dbError) {
      console.error('Prisma Error:', dbError);
      return res.status(500).json({ message: 'Database error', error: dbError.message });
    }

    // 2. Create Midtrans Snap Transaction
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount
      },
      customer_details: {
        first_name: participant.name,
        phone: participant.phone,
        city: participant.city
      }
    };

    const transaction = await snap.createTransaction(parameter);
    
    res.json({
      snapToken: transaction.token,
      orderId
    });
  } catch (error) {
    console.error('Midtrans error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// MIDTRANS WEBHOOK
app.post('/api/webhook/midtrans', async (req, res) => {
  try {
    const notification = await snap.transaction.notification(req.body);
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    let finalStatus = 'PENDING';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        finalStatus = 'CHALLENGE';
      } else if (fraudStatus === 'accept') {
        finalStatus = 'SUCCESS';
      }
    } else if (transactionStatus === 'settlement') {
      finalStatus = 'SUCCESS';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      finalStatus = 'FAILED';
    } else if (transactionStatus === 'pending') {
      finalStatus = 'PENDING';
    }

    // Update database
    const updatedTx = await prisma.transaction.update({
      where: { midtrans_order_id: orderId },
      data: { status: finalStatus }
    });

    // Send WhatsApp if SUCCESS
    if (finalStatus === 'SUCCESS') {
      // Prepare and send WhatsApp notification
      // Fetch WhatsApp settings from database (falling back to .env)
      let wahubUrl = process.env.WAHUB_API_URL;
      let wahubKey = process.env.WAHUB_API_KEY;
      let wahubSessionId = process.env.WAHUB_SESSION_ID || 'session-1';

      try {
        const dbSettings = await prisma.setting.findMany();
        dbSettings.forEach(s => {
          if (s.key === 'WAHUB_URL') wahubUrl = s.value;
          if (s.key === 'WAHUB_API_KEY') wahubKey = s.value;
          if (s.key === 'WAHUB_SESSION_ID') wahubSessionId = s.value;
        });
      } catch(e) { console.error('Failed to load db settings for WA', e); }

      if (wahubUrl && wahubKey) {
        try {
          const formatRupiah = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
          
          let phone = updatedTx.phone;
          // Ensure phone starts with 62 or +62 (wahub might expect standard format, but we'll just pass it)
          if (phone.startsWith('0')) {
            phone = '62' + phone.substring(1);
          } else if (phone.startsWith('+')) {
            phone = phone.substring(1);
          }
          
          const message = `Halo *${updatedTx.name}*,\n\nPembayaran Anda untuk Pendaftaran AI Workshop sebesar *${formatRupiah(updatedTx.total_amount)}* telah *BERHASIL* kami terima.\n\nTerima kasih telah mendaftar, kami akan menghubungi Anda untuk info selanjutnya!`;

          await fetch(`${wahubUrl}/api/messages/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': wahubKey
            },
            body: JSON.stringify({
              sessionId: wahubSessionId,
              number: phone,
              message: message
            })
          });
          console.log(`WhatsApp message sent to ${phone}`);
        } catch (waErr) {
          console.error('Failed to send WhatsApp message:', waErr);
        }
      } else {
        console.log('Skipping WhatsApp: WAHUB_API_URL or WAHUB_API_KEY not configured in .env');
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ADMIN SETTINGS
app.get('/api/admin/settings', adminAuth, async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap = {};
    settings.forEach(s => settingsMap[s.key] = s.value);
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/settings', adminAuth, async (req, res) => {
  const { waUrl, waApiKey, waSessionId } = req.body;
  try {
    if (waUrl) await prisma.setting.upsert({ where: { key: 'WAHUB_URL' }, update: { value: waUrl }, create: { key: 'WAHUB_URL', value: waUrl } });
    if (waApiKey) await prisma.setting.upsert({ where: { key: 'WAHUB_API_KEY' }, update: { value: waApiKey }, create: { key: 'WAHUB_API_KEY', value: waApiKey } });
    if (waSessionId) await prisma.setting.upsert({ where: { key: 'WAHUB_SESSION_ID' }, update: { value: waSessionId }, create: { key: 'WAHUB_SESSION_ID', value: waSessionId } });
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WHATSAPP ADMIN PROXIES (To avoid CORS)
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

app.post('/api/admin/whatsapp/start', adminAuth, async (req, res) => {
  const { url, apiKey, sessionId } = req.body;
  try {
    const cleanUrl = url.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/api/sessions/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({ sessionId })
    });
    
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = { error: 'Invalid response from Wahub', details: text.substring(0, 200) }; }
    
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/admin/whatsapp/qr/:sessionId', adminAuth, async (req, res) => {
  const { url, apiKey } = req.query;
  const sessionId = req.params.sessionId;
  try {
    const cleanUrl = url.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/api/sessions/qr/${sessionId}`, {
      headers: { 'x-api-key': apiKey }
    });
    if (response.ok) {
      const html = await response.text();
      res.send(html);
    } else {
      const text = await response.text();
      res.status(response.status).json({ error: 'QR not ready or error', details: text.substring(0, 200) });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/admin/whatsapp/status/:sessionId', adminAuth, async (req, res) => {
  const { url, apiKey } = req.query;
  const sessionId = req.params.sessionId;
  try {
    const cleanUrl = url.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/api/sessions/status/${sessionId}`, {
      headers: { 'x-api-key': apiKey }
    });
    
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = { error: 'Invalid response from Wahub', details: text.substring(0, 200) }; }
    
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Serve static frontend files for production deployment on Coolify
if (process.env.NODE_ENV === 'production' || process.env.COOLIFY_ENVIRONMENT_NAME) {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  
  // SPA Fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Unified API & Frontend Server running on port ${PORT}`);
});
