export type PaymentOption = 'FULL_PAYMENT' | 'INSTALLMENT';

export interface ParticipantDetails {
  name: string;
  city: string;
  phone: string;
  job: string;
}

export type CheckoutStage = 'SELECT_PAYMENT' | 'CONFIRMATION' | 'COMPLETED';

export interface PaymentSuccessData {
  orderId: string;
  workshopName: string;
  dateString: string;
  paymentOption: PaymentOption;
  amountPaid: number;
  totalAmount: number;
  status: 'Berhasil';
}
