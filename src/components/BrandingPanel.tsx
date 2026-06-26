import React from 'react';
import { Calendar, Clock, Video, CheckCircle2, Sparkles, Terminal, ShieldCheck } from 'lucide-react';

interface BrandingPanelProps {
  onDaftarClick?: () => void;
}

export default function BrandingPanel({ onDaftarClick }: BrandingPanelProps) {
  const benefits = [
    'Belajar membuat aplikasi AI dari nol',
    'Praktik langsung bersama mentor',
    'Materi dan rekaman workshop',
    'Template dan source code',
    'Sertifikat peserta resmi',
    'Grup konsultasi setelah workshop',
  ];

  return (
    <div className="flex flex-col h-full justify-between gap-8 text-[#F7F8FC]">
      {/* Upper Branding Content */}
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] p-[1.5px] shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <div className="w-full h-full bg-[#070A12] rounded-[10px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-[#22D3EE]" />
            </div>
          </div>
          <div>
            <span className="font-sans font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-[#A0A7B4] to-[#22D3EE] bg-clip-text text-transparent">
              AI PRAKTIS
            </span>
            <span className="text-[10px] block text-[#707888] font-mono leading-none tracking-widest">
              ACADEMY
            </span>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[rgba(139,92,246,0.12)] to-[rgba(34,211,238,0.12)] border border-[rgba(124,92,252,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-[#22D3EE] animate-pulse" />
          <span className="text-xs font-medium text-[#22D3EE] tracking-wide">
            Pendaftaran Workshop Aktif
          </span>
        </div>

        {/* Main Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Workshop Jadi <br />
            <span className="ai-gradient-text font-bold">
              Programmer AI
            </span> Sehari
          </h1>
          <p className="text-sm text-[#A0A7B4] leading-relaxed max-w-md font-sans">
            Belajar membangun aplikasi AI dari nol hingga jadi dalam satu hari. Praktik langsung, hasil nyata.
          </p>
        </div>

        {/* Technical Data / Metadata Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />

        {/* Schedule & Location */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-[#F7F8FC] group">
            <div className="p-1.5 rounded-lg bg-[rgba(17,23,36,0.6)] border border-[rgba(255,255,255,0.06)] text-[#8B5CF6]">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <span>Sabtu, 4 Juli 2026</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#F7F8FC] group">
            <div className="p-1.5 rounded-lg bg-[rgba(17,23,36,0.6)] border border-[rgba(255,255,255,0.06)] text-[#8B5CF6]">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <span>09.00 – 16.00 WIB</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#F7F8FC] group">
            <div className="p-1.5 rounded-lg bg-[rgba(17,23,36,0.6)] border border-[rgba(255,255,255,0.06)] text-[#8B5CF6]">
              <Video className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span>Online via Zoom</span>
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />

        {/* Benefits Checklist */}
        <div className="space-y-3">
          <p className="text-xs font-mono text-[#707888] uppercase tracking-wider">MANFAAT YANG DIDAPATKAN</p>
          <div className="grid grid-cols-1 gap-2.5">
            {benefits.slice(2, 5).map((benefit, index) => (
              <div key={index} className="flex items-start gap-2 text-[13px] text-[#A0A7B4]">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing and Guarantee Badge */}
      <div className="space-y-4">
        {/* Mentor Card block from design */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center text-xs font-bold font-mono text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]">OS</div>
          <div className="flex-1">
            <p className="text-xs text-[#707888] font-medium">Di Mentori Oleh</p>
            <p className="text-sm font-semibold text-white">Ony Sapta Nugraha, Programmer Enginer</p>
          </div>
        </div>


        {/* Safety Trust */}
        <div className="flex items-center gap-2 text-xs text-[#707888] px-1">
          <ShieldCheck className="w-4.5 h-4.5 text-[#34D399]" />
          <span>Garansi 100% Puas. Pembayaran aman & terenkripsi.</span>
        </div>

        {onDaftarClick && (
          <button
            onClick={onDaftarClick}
            className="w-full mt-6 h-14 ai-gradient-bg rounded-xl font-bold text-lg text-white flex items-center justify-center cursor-pointer shadow-lg shadow-[#8B5CF6]/20 hover:opacity-95 active:scale-[0.98] transition-all"
          >
            Daftar Sekarang
          </button>
        )}
      </div>
    </div>
  );
}
