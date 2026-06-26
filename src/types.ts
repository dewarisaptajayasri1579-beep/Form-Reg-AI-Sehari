export type PaymentOption = 'FULL_PAYMENT' | 'INSTALLMENT';

export interface ParticipantDetails {
  name: string;
  city: string;
  phone: string;
  job: string;
}

export type CheckoutStage = 'INFO' | 'DATA_ENTRY' | 'SELECT_PAYMENT' | 'COMPLETED';

export interface PaymentSuccessData {
  orderId: string;
  workshopName: string;
  dateString: string;
  paymentOption: PaymentOption;
  amountPaid: number;
  totalAmount: number;
  status: 'Berhasil';
}
