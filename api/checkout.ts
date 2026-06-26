import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore
import midtransClient from 'midtrans-client';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY || ''
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { participant, paymentOption, totalAmount } = req.body;

    // 1. Generate Order ID
    const orderId = `ORDER-${uuidv4()}`;

    // 2. Save Pending Transaction to Supabase
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

    // 3. Create Midtrans Snap Transaction
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
    const snapToken = transaction.token;

    // 4. Return Snap Token to Frontend
    return res.status(200).json({
      snapToken,
      orderId
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
