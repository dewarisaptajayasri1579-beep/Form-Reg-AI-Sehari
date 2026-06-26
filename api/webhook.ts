import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const notificationJson = req.body;
    
    // Verify notification
    const statusResponse = await snap.transaction.notification(notificationJson);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    let statusToUpdate = 'PENDING';

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        statusToUpdate = 'CHALLENGE';
      } else if (fraudStatus == 'accept') {
        statusToUpdate = 'SUCCESS';
      }
    } else if (transactionStatus == 'settlement') {
      statusToUpdate = 'SUCCESS';
    } else if (
      transactionStatus == 'cancel' ||
      transactionStatus == 'deny' ||
      transactionStatus == 'expire'
    ) {
      statusToUpdate = 'FAILED';
    } else if (transactionStatus == 'pending') {
      statusToUpdate = 'PENDING';
    }

    // Update Supabase
    const { error } = await supabase
      .from('transactions')
      .update({ status: statusToUpdate })
      .eq('midtrans_order_id', orderId);

    if (error) {
      console.error('Webhook Supabase Update Error:', error);
      return res.status(500).json({ message: 'Database update failed', error });
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
