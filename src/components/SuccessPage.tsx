import React, { useState } from 'react';
import { Check, Calendar, CreditCard, ChevronRight, MessageSquare, Receipt, RefreshCw, X } from 'lucide-react';
import { PaymentOption } from '../types';

interface SuccessPageProps {
  paymentOption: PaymentOption;
  amountPaid: number;
  selectedMethodName: string;
  onOpenInvoice: () => void;
  onRestart: () => void;
}

export default function SuccessPage({
  paymentOption,
  amountPaid,
  selectedMethodName,
  onOpenInvoice,
  onRestart,
}: SuccessPageProps) {

  return (
    <div className="w-full flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
      {/* Confetti decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#8B5CF6] rounded-full animate-ping opacity-60" style={{ animationDelay: '0.2s' }} />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-[#22D3EE] rounded-full animate-ping opacity-70" style={{ animationDelay: '0.8s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#34D399] rounded-full animate-ping opacity-50" style={{ animationDelay: '1.4s' }} />
      </div>

      {/* Success Dialog Frame */}
      <div className="relative w-full max-w-md glass-card bg-[#111724]/95 border border-[rgba(255,255,255,0.12)] p-6 shadow-2xl z-10 overflow-hidden text-center">
        
        {/* Glow behind checkmark */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-tr from-[#34D399]/20 to-[#22D3EE]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Checked Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-[#34D399] to-[#22D3EE] p-[1.5px] shadow-[0_0_30px_rgba(52,211,153,0.35)] flex items-center justify-center mb-5 animate-bounce-once">
          <div className="w-full h-full bg-[#111724] rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-[#34D399] stroke-[3]" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-white tracking-tight">Pembayaran Berhasil!</h3>
        <p className="text-xs text-[#A0A7B4] mt-1.5 max-w-xs mx-auto">
          Terima kasih, pembayaran Anda berhasil kami terima melalui saluran integrasi Midtrans Secure.
        </p>

        {/* Summary Card Details */}
        <div className="mt-6 p-4 rounded-xl bg-[#070A12]/90 border border-[rgba(255,255,255,0.05)] text-left space-y-3.5">
          <div className="flex justify-between items-start text-xs pb-2 border-b border-[rgba(255,255,255,0.04)]">
            <span className="text-[#707888]">Workshop</span>
            <span className="text-[#F7F8FC] font-semibold text-right max-w-[210px] truncate">
              Jadi Programmer AI Sehari
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pb-2 border-b border-[rgba(255,255,255,0.04)]">
            <span className="text-[#707888]">Tanggal Event</span>
            <span className="text-[#F7F8FC] font-medium">Sabtu, 4 Juli 2026</span>
          </div>

          <div className="flex justify-between items-center text-xs pb-2 border-b border-[rgba(255,255,255,0.04)]">
            <span className="text-[#707888]">Metode</span>
            <span className="text-[#22D3EE] font-bold">
              {paymentOption === 'FULL_PAYMENT' ? 'Bayar Lunas (100%)' : 'Bayar Bertahap (DP 15%)'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pb-2 border-b border-[rgba(255,255,255,0.04)]">
            <span className="text-[#707888]">Saluran Bayar</span>
            <span className="text-[#F7F8FC] font-medium font-mono">{selectedMethodName || 'QRIS'}</span>
          </div>

          <div className="flex justify-between items-center pt-1.5">
            <span className="text-xs text-[#707888] font-bold">Total Dibayar</span>
            <span className="text-lg font-extrabold text-[#34D399]">
              Rp{amountPaid.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[rgba(255,255,255,0.04)]">
            <span className="text-[#707888]">Status Pembayaran</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[rgba(52,211,153,0.12)] text-[#34D399] border border-[rgba(52,211,153,0.2)]">
              Berhasil
            </span>
          </div>
        </div>

        {/* Whatsapp Alert Confirmation Block */}
        <div className="mt-5 p-3.5 rounded-xl bg-[#34D399]/5 border border-[#34D399]/15 text-left flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#34D399]/10 text-[#34D399] shrink-0">
            <MessageSquare className="w-4.5 h-4.5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white">WhatsApp Otomatis Terkirim</h5>
            <p className="text-[11px] text-[#A0A7B4] mt-0.5 leading-relaxed">
              Kuitansi resmi, detail tautan Zoom, dan akses grup konsultasi eksklusif telah kami kirimkan ke nomor WhatsApp Anda.
            </p>
          </div>
        </div>

        {/* Form Action Controls */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-[rgba(255,255,255,0.05)]">
          <button
            onClick={onOpenInvoice}
            className="px-4 py-3.5 bg-transparent hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-xs font-bold text-[#F7F8FC] rounded-xl flex items-center justify-center gap-1.5 transition-colors focus:outline-none"
            style={{ minHeight: '44px' }}
          >
            <Receipt className="w-4 h-4 text-[#22D3EE]" />
            Lihat Invoice
          </button>
          
          <button
            onClick={onRestart}
            className="px-4 py-3.5 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:opacity-90 text-xs font-bold text-white rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#8B5CF6]/20 focus:outline-none"
            style={{ minHeight: '44px' }}
          >
            <RefreshCw className="w-4 h-4" />
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
}
