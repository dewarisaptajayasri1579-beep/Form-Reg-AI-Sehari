import React, { useRef } from 'react';
import { X, Printer, ShieldCheck, Download, Calendar, Mail, FileText } from 'lucide-react';
import { ParticipantDetails, PaymentOption } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: ParticipantDetails;
  paymentOption: PaymentOption;
  amountPaid: number;
  selectedMethod: string;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  participant,
  paymentOption,
  amountPaid,
  selectedMethod,
}: InvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Invoice calculations
  const invoiceNo = `INV-2026-0704-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const basePrice = paymentOption === 'FULL_PAYMENT' ? 1000000 : 1400000;
  const currentBill = amountPaid;
  const remainingBill = paymentOption === 'FULL_PAYMENT' ? 0 : 1200000;

  const handlePrint = () => {
    const printContent = invoiceRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      // Simple virtual window print mechanism
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#070A12]/90 backdrop-blur-md" onClick={onClose} />

      {/* Invoice Container */}
      <div className="relative w-full max-w-2xl bg-[#111724] border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-8">
        
        {/* Top Control Bar */}
        <div className="bg-[#151C2B] px-6 py-4 border-b border-[rgba(255,255,255,0.08)] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#8B5CF6]" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Kuitansi Pembayaran Digital</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none"
              style={{ minHeight: '40px' }}
            >
              <Printer className="w-4 h-4 text-[#22D3EE]" />
              <span className="hidden sm:inline">Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] text-[#707888] hover:text-white transition-colors"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content area */}
        <div ref={invoiceRef} className="p-6 sm:p-8 overflow-y-auto max-h-[75vh] bg-[#111724] text-[#F7F8FC]">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[rgba(255,255,255,0.06)]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-[#22D3EE] bg-clip-text text-transparent">
                  AI PRAKTIS
                </span>
                <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">OFFICIAL RECEIPT</span>
              </div>
              <p className="text-xs text-[#707888] leading-normal max-w-xs">
                PT AI Praktis Indonesia<br />
                Plaza Tower Mega, Lantai 18, Jakarta Selatan<br />
                support@aipraktis.id | www.aipraktis.id
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <h2 className="text-xl font-black text-white font-mono tracking-tight">KUITANSI</h2>
              <p className="text-xs text-[#707888]">NO INVOICE: <span className="font-mono text-white font-semibold">{invoiceNo}</span></p>
              <p className="text-xs text-[#707888]">TANGGAL BAYAR: <span className="text-[#A0A7B4] font-medium">{dateStr}</span></p>
            </div>
          </div>

          {/* Billing Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-[rgba(255,255,255,0.06)]">
            <div>
              <p className="text-xs font-bold text-[#707888] uppercase tracking-wider mb-2">DIBAYARKAN KEPADA:</p>
              <div className="space-y-1 text-xs">
                <p className="text-sm font-bold text-white">{participant.name}</p>
                <p className="text-[#A0A7B4] font-mono">{participant.phone}</p>
                <p className="text-[#A0A7B4]">Pekerjaan: {participant.job}</p>
                <p className="text-[#707888]">Kota Asal: {participant.city}</p>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-bold text-[#707888] uppercase tracking-wider mb-2">INFORMASI METODE:</p>
              <div className="space-y-1 text-xs">
                <p className="text-sm font-semibold text-white">Midtrans Payment Gateway</p>
                <p className="text-[#A0A7B4]">Saluran: <span className="font-mono text-[#22D3EE] font-bold">{selectedMethod || 'QRIS'}</span></p>
                <p className="text-[#A0A7B4]">Status: <span className="font-semibold text-emerald-400">Paid / Lunas</span></p>
              </div>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="py-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.08)]">
                  <th className="pb-3 text-xs font-bold text-[#707888] uppercase tracking-wider">Item Deskripsi</th>
                  <th className="pb-3 text-xs font-bold text-[#707888] uppercase tracking-wider text-center">Tipe</th>
                  <th className="pb-3 text-xs font-bold text-[#707888] uppercase tracking-wider text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-xs">
                <tr>
                  <td className="py-4">
                    <p className="font-bold text-white">Workshop Jadi Programmer AI Sehari</p>
                    <p className="text-[#707888] mt-0.5">Pelaksanaan: Sabtu, 4 Juli 2026 pukul 09.00 - 16.00 WIB via Zoom</p>
                  </td>
                  <td className="py-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[rgba(139,92,246,0.15)] text-[#8B5CF6] uppercase border border-[rgba(139,92,246,0.2)]">
                      {paymentOption === 'FULL_PAYMENT' ? 'Lunas' : 'DP Pelunasan'}
                    </span>
                  </td>
                  <td className="py-4 text-right font-semibold text-white">
                    Rp{basePrice.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pricing totals */}
          <div className="bg-[#070A12]/90 p-4 rounded-xl border border-[rgba(255,255,255,0.05)] ml-auto max-w-sm space-y-2.5 text-xs text-right">
            <div className="flex justify-between">
              <span className="text-[#707888]">Subtotal Paket:</span>
              <span className="text-white font-medium">Rp{basePrice.toLocaleString('id-ID')}</span>
            </div>
            {paymentOption === 'INSTALLMENT' && (
              <div className="flex justify-between text-[#FBBF24]">
                <span>Sisa Pelunasan Besok:</span>
                <span className="font-bold">- Rp1.200.000</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#707888]">PPN (0% bebas pajak):</span>
              <span className="text-white">Rp0</span>
            </div>
            <div className="h-[1px] bg-[rgba(255,255,255,0.08)] my-1.5" />
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-[#A0A7B4]">Total Dibayar Sekarang:</span>
              <span className="text-base font-extrabold text-[#34D399]">
                Rp{currentBill.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Footer certification validation stamp */}
          <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center">
                {/* Simulated Verification QR Code SVG */}
                <svg className="w-full h-full text-[#070A12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="6" height="6" />
                  <rect x="16" y="2" width="6" height="6" />
                  <rect x="2" y="16" width="6" height="6" />
                  <rect x="16" y="16" width="6" height="6" />
                  <rect x="9" y="9" width="6" height="6" />
                  <path d="M12 2v3m0 14v3M2 12h3m14 0h3M9 12h2M14 12h1" />
                </svg>
              </div>
              <div className="text-left space-y-0.5">
                <p className="text-[11px] text-white font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
                  Kuitansi Sah Terverifikasi
                </p>
                <p className="text-[10px] text-[#707888] max-w-xs leading-normal">
                  Pindai QR ini atau gunakan ID invoice Anda untuk memvalidasi pendaftaran di sistem server AI Praktis.
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <p className="text-[10px] text-[#707888]">Tanda Tangan Elektronik</p>
              <p className="text-xs font-bold text-white mt-1 bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">AI PRAKTIS FINANCE</p>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-[#22D3EE] ml-auto mt-2" />
            </div>
          </div>

        </div>

        {/* Bottom Information Bar */}
        <div className="bg-[#151C2B] px-6 py-4 border-t border-[rgba(255,255,255,0.08)] text-[10px] text-[#707888] flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Dicetak secara otomatis oleh sistem tagihan AI Praktis.</span>
          <span>© 2026 AI Praktis Academy. All rights reserved.</span>
        </div>

      </div>
    </div>
  );
}
