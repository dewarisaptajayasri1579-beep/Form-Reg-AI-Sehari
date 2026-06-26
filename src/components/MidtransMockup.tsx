import React, { useState } from 'react';
import { X, CreditCard, ChevronRight, Shield, AlertCircle } from 'lucide-react';
import { PaymentOption } from '../types';

interface MidtransMockupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (method: string) => void;
  amount: number;
  paymentOption: PaymentOption;
}

export default function MidtransMockup({
  isOpen,
  onClose,
  onSuccess,
  amount,
  paymentOption,
}: MidtransMockupProps) {
  const [processing, setProcessing] = useState(false);
  const [selectedMethodName, setSelectedMethodName] = useState('');
  const [orderId] = useState(() => `WS-${Math.floor(100000 + Math.random() * 900000)}`);

  if (!isOpen) return null;

  const handlePay = (methodName: string) => {
    setProcessing(true);
    setSelectedMethodName(methodName);

    // Simulate payment gateway authorization and collection (1.8s)
    setTimeout(() => {
      setProcessing(false);
      onSuccess(methodName);
    }, 1800);
  };

  const paymentMethods = [
    {
      id: 'qris',
      name: 'QRIS (Gopay, OVO, LinkAja, Dana)',
      desc: 'Bayar instan menggunakan scan QR dari aplikasi e-wallet Anda',
      icon: 'https://img.icons8.com/color/48/qr-code.png', // Fallback SVG in code
      badge: 'Instan',
    },
    {
      id: 'va_bca',
      name: 'BCA Virtual Account',
      desc: 'Bayar via transfer mobile banking atau ATM BCA',
      icon: 'BCA',
    },
    {
      id: 'va_mandiri',
      name: 'Mandiri Bill Payment',
      desc: 'Bayar menggunakan mandiri online atau ATM Mandiri',
      icon: 'Mandiri',
    },
    {
      id: 'gopay',
      name: 'GoPay / GoPay Later',
      desc: 'Konfirmasi pembayaran langsung lewat aplikasi Gojek Anda',
      icon: 'GoPay',
    },
    {
      id: 'ovo',
      name: 'OVO',
      desc: 'Bayar praktis menggunakan saldo OVO Anda',
      icon: 'OVO',
    },
    {
      id: 'dana',
      name: 'DANA',
      desc: 'Bayar aman menggunakan dompet digital DANA',
      icon: 'DANA',
    },
    {
      id: 'shopeepay',
      name: 'ShopeePay / SPayLater',
      desc: 'Bayar instan terintegrasi dengan Shopee',
      icon: 'ShopeePay',
    },
    {
      id: 'cc',
      name: 'Kartu Kredit / Debit',
      desc: 'Mendukung Visa, Mastercard, JCB, dan American Express',
      icon: 'CreditCard',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !processing && onClose()} />

      {/* Midtrans Snap Modal Frame */}
      <div className="relative w-full max-w-lg bg-[#F8F9FA] text-[#2F3E46] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col border border-gray-200">
        
        {/* Header - Styled like authentic Midtrans Snap window */}
        <div className="bg-white px-5 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Midtrans Symbol Logo */}
            <div className="flex items-center gap-1 font-sans">
              <span className="w-1.5 h-6 bg-[#22D3EE] rounded-full inline-block" />
              <span className="w-1.5 h-4 bg-[#3B82F6] rounded-full inline-block" />
              <span className="w-1.5 h-5 bg-[#8B5CF6] rounded-full inline-block" />
              <span className="font-extrabold text-lg tracking-tight text-[#1D2D50] ml-1">
                midtrans
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold ml-1.5 px-1.5 py-0.5 bg-gray-100 rounded">
                SNAP
              </span>
            </div>
          </div>
          {!processing && (
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Processing State Overlay */}
        {processing ? (
          <div className="flex-1 min-h-[350px] flex flex-col items-center justify-center p-8 bg-white/95 text-center">
            {/* Loader Spinner */}
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-[#3B82F6]/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#3B82F6] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
            <h4 className="text-base font-bold text-[#1D2D50]">Memproses Transaksi...</h4>
            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
              Menghubungkan ke server aman {selectedMethodName} untuk mengotorisasi pembayaran Anda. Jangan tutup jendela ini.
            </p>
            <div className="mt-8 flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5 text-[#34D399]" />
              <span>Koneksi terenkripsi SSL 256-bit</span>
            </div>
          </div>
        ) : (
          <>
            {/* Order Brief */}
            <div className="bg-[#1D2D50] text-white px-5 py-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-blue-200 font-medium">Kategori Pembayaran</p>
                <h4 className="text-sm font-semibold truncate max-w-[220px]">Workshop Jadi Programmer AI Sehari</h4>
                <p className="text-[10px] text-blue-300/80 mt-0.5">ORDER ID: {orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-200">TOTAL TAGIHAN</p>
                <p className="text-lg font-extrabold text-white">
                  Rp{amount.toLocaleString('id-ID')}
                </p>
                <p className="text-[9px] text-blue-300 font-mono">
                  {paymentOption === 'FULL_PAYMENT' ? 'Bayar Lunas (100%)' : 'DP Pembayaran (15%)'}
                </p>
              </div>
            </div>

            {/* Methods Picker list Container */}
            <div className="flex-1 overflow-y-auto max-h-[380px] p-4 bg-[#F8F9FA] space-y-3">
              <div className="flex items-center gap-1.5 px-1 py-1">
                <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />
                <p className="text-xs font-semibold text-gray-500">
                  Pilih metode pembayaran aman berikut untuk melanjutkan:
                </p>
              </div>

              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePay(method.name)}
                    className="w-full text-left bg-white border border-gray-200 hover:border-[#3B82F6] p-3.5 rounded-xl flex items-center justify-between transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 group"
                    style={{ minHeight: '52px' }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Logo placeholder icon styled nicely */}
                      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold border border-gray-100 overflow-hidden text-gray-500 group-hover:text-[#3B82F6] shrink-0">
                        {method.icon === 'BCA' && <span className="text-blue-700 font-extrabold">BCA</span>}
                        {method.icon === 'Mandiri' && <span className="text-yellow-600 font-extrabold text-[9px]">MANDIRI</span>}
                        {method.icon === 'GoPay' && <span className="text-emerald-600 font-extrabold">GoPay</span>}
                        {method.icon === 'OVO' && <span className="text-indigo-700 font-extrabold">OVO</span>}
                        {method.icon === 'DANA' && <span className="text-sky-500 font-extrabold">DANA</span>}
                        {method.icon === 'ShopeePay' && <span className="text-orange-500 font-extrabold text-[8px]">SPay</span>}
                        {method.icon === 'CreditCard' && <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />}
                        {method.id === 'qris' && (
                          <svg className="w-7 h-7 text-[#1D2D50]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="3" width="6" height="6" rx="1" />
                            <rect x="15" y="3" width="6" height="6" rx="1" />
                            <rect x="3" y="15" width="6" height="6" rx="1" />
                            <rect x="15" y="15" width="6" height="6" rx="1" />
                            <path d="M12 3v3m0 6V9m0 6v3m3-6h-3m3 3h3" />
                          </svg>
                        )}
                      </div>

                      {/* Content details */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-800 group-hover:text-[#3B82F6] transition-colors">
                            {method.name}
                          </span>
                          {method.badge && (
                            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded uppercase">
                              {method.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 font-normal leading-tight mt-0.5">{method.desc}</p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Security Info */}
            <div className="bg-white px-5 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 shrink-0">
              <span className="flex items-center gap-1 font-medium text-gray-500">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> Secure Payment by Midtrans
              </span>
              <span className="text-gray-300">|</span>
              <span className="font-semibold text-[#1D2D50]">Midtrans Sandbox 3.0</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
