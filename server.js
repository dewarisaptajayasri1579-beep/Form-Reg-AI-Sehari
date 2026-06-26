import express from 'express';
import cors from 'cors';
import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Prisma Client
const prisma = new PrismaClient();

const snap = new midtransClient.Snap({
  isProduction: false, // Change to true if using production keys
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY || ''
});

// API Routes
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
