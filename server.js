import express from 'express';
import cors from 'cors';
import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY || ''
});

app.post('/api/checkout', async (req, res) => {
  try {
    const { participant, paymentOption, totalAmount } = req.body;
    const orderId = `ORDER-${uuidv4()}`;

    // 1. Save Pending Transaction to Supabase
    const { data: dbData, error: dbError } = await supabase
      .from('transactions')
      .insert([
        {
          id: uuidv4(),
          midtrans_order_id: orderId,
          name: participant.name,
          phone: participant.phone,
          city: participant.city,
          job: participant.job,
          payment_option: paymentOption,
          total_amount: totalAmount,
          status: 'PENDING'
        }
      ]);

    if (dbError) {
      console.error('Supabase Error:', dbError);
      return res.status(500).json({ message: 'Database error', error: dbError });
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

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Local API Server running on port ${PORT}`);
});
