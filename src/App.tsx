import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  MapPin, 
  Phone, 
  Briefcase, 
  ChevronRight, 
  ChevronLeft, 
  Lock, 
  ShieldCheck, 
  HelpCircle, 
  UserCheck, 
  CreditCard, 
  AlertTriangle, 
  Terminal, 
  Settings, 
  ExternalLink,
  Hourglass,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';

import { PaymentOption, ParticipantDetails, CheckoutStage } from './types';
import BrandingPanel from './components/BrandingPanel';
import StepHeader from './components/StepHeader';
import EditParticipantModal from './components/EditParticipantModal';
import MidtransMockup from './components/MidtransMockup';
import SuccessModal from './components/SuccessModal';
import InvoiceModal from './components/InvoiceModal';

export default function App() {
  // 1. Core State Managers
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>('FULL_PAYMENT');
  const [checkoutStage, setCheckoutStage] = useState<CheckoutStage>('SELECT_PAYMENT');
  
  // Participant State
  const [participant, setParticipant] = useState<ParticipantDetails>({
    name: 'Andi Pratama',
    city: 'Boyolali',
    phone: '0812-3456-7890',
    job: 'Software Developer',
  });

  // UI Interactive States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMidtransOpen, setIsMidtransOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [selectedMethodName, setSelectedMethodName] = useState('QRIS');
  
  // Post-payment Outcomes
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  
  // Toast notifications for user feedback
  const [toastMessage, setToastMessage] = useState('');
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);

  // 2. Real-Time Countdown Timer Logic
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isPromoExpired, setIsPromoExpired] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date();
      // Target is 23:59:59 tonight local time
      target.setHours(23, 59, 59, 999);

      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setIsPromoExpired(true);
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsPromoExpired(false);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Helper utility for Toast triggers
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 4. Payment triggers
  const handleLanjutPembayaran = () => {
    setCheckoutStage('CONFIRMATION');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBayarMidtrans = () => {
    setLoadingPayment(true);
    // Simulate brief API handshaking
    setTimeout(() => {
      setLoadingPayment(false);
      setIsMidtransOpen(true);
    }, 1200);
  };

  const handlePaymentSuccess = (method: string) => {
    setSelectedMethodName(method);
    setIsMidtransOpen(false);
    setCheckoutStage('COMPLETED');
    setIsSuccessOpen(true);
    triggerToast('Pembayaran berhasil dikonfirmasi oleh sistem!');
  };

  const handleRestartFlow = () => {
    setSelectedPayment('FULL_PAYMENT');
    setCheckoutStage('SELECT_PAYMENT');
    setIsSuccessOpen(false);
    setIsInvoiceOpen(false);
    triggerToast('Checkout telah di-reset ke metode utama.');
  };

  // Pricing calculations
  const normalPrice = 2700000;
  const promoPriceFull = 1000000;
  const installmentDp = 200000;
  const installmentPelunasan = 1200000;
  const totalInstallment = installmentDp + installmentPelunasan;

  const currentBillAmount = selectedPayment === 'FULL_PAYMENT' ? promoPriceFull : installmentDp;
  const totalWorkshopCost = selectedPayment === 'FULL_PAYMENT' ? promoPriceFull : totalInstallment;

  return (
    <div className="min-h-screen premium-bg flex flex-col antialiased relative selection:bg-[#8B5CF6]/30 pb-12">
      
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[5%] w-96 h-96 bg-[#22D3EE]/8 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* 1. APP HEADER */}
      <header className="sticky top-0 z-40 bg-[#070A12]/80 backdrop-blur-md border-b border-white/5 px-4 sm:px-10 shrink-0 custom-grid">
        <div className="max-w-7xl mx-auto h-[68px] flex items-center justify-between">
          {/* Left Element: Back button on mobile, Brand on desktop */}
          <div className="flex items-center gap-3">
            {checkoutStage === 'CONFIRMATION' && (
              <button
                onClick={() => setCheckoutStage('SELECT_PAYMENT')}
                className="flex sm:hidden items-center justify-center w-10 h-10 rounded-full bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] text-white"
                style={{ minHeight: '44px', minWidth: '44px' }}
                aria-label="Kembali ke langkah sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            
            <div className={`${checkoutStage === 'CONFIRMATION' ? 'hidden sm:flex' : 'flex'} items-center gap-3`}>
              <div className="w-8 h-8 rounded-lg ai-gradient-bg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" className="w-5 h-5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold text-lg tracking-tight text-white">AI Praktis</span>
            </div>
          </div>

          {/* Center Element: Compact Mobile Title */}
          <div className="sm:hidden font-bold text-xs tracking-wide text-[#A0A7B4] max-w-[150px] truncate">
            {checkoutStage === 'SELECT_PAYMENT' ? 'Metode Pembayaran' : 'Konfirmasi Bayar'}
          </div>

          {/* Right Elements: Help & Simulated Admin Controls */}
          <div className="flex items-center gap-6 text-sm text-[#A0A7B4]">
            {/* Help Button */}
            <div className="relative">
              <button
                onClick={() => setShowHelpDropdown(!showHelpDropdown)}
                className="hover:text-white transition-colors cursor-pointer text-sm"
              >
                Bantuan
              </button>

              {/* Help Dropdown content */}
              <AnimatePresence>
                {showHelpDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-8 w-64 p-4 rounded-xl card-glass bg-[#111724] border border-white/10 shadow-2xl z-50 text-left space-y-3"
                  >
                    <h4 className="text-xs font-bold text-[#F7F8FC] uppercase tracking-wider">Butuh Bantuan?</h4>
                    <div className="space-y-2.5 text-xs text-[#A0A7B4]">
                      <p className="leading-relaxed">Jika ada kendala saat melakukan checkout, silakan hubungi tim helpdesk AI Praktis.</p>
                      <div className="p-2.5 rounded-lg bg-[#070A12]/80 border border-[rgba(255,255,255,0.04)] font-mono text-[10px] text-center">
                        WhatsApp: <span className="text-[#34D399] font-bold">0812-9011-2026</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Simulated Admin Login */}
            <button
              onClick={() => triggerToast('Fitur login administrator dikhususkan untuk instruktur internal.')}
              className="px-4 py-1.5 rounded-full border border-white/10 hover:bg-white/5 text-sm text-white font-medium transition-all"
            >
              Masuk Admin
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CORE LAYOUT */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT COL: BRANDING & WORKSHOP INFO (36% Desktop Width) */}
        <section className="w-full lg:w-[36%] border-b lg:border-b-0 lg:border-r border-white/5 p-6 sm:p-10 flex flex-col gap-8 shrink-0">
          <BrandingPanel />
        </section>

        {/* RIGHT COL: INTERACTIVE CHECKOUT PORTAL (64% Desktop Width) */}
        <section className="flex-1 p-6 sm:p-10 bg-[#070A12]/50 relative overflow-y-auto">
          <div className="max-w-[700px] mx-auto flex flex-col h-full">
            {/* Step Indicator Section */}
            <div className="w-full mb-8">
              <StepHeader currentStage={checkoutStage} />
            </div>

            <div className="flex-1 space-y-6">
              <AnimatePresence mode="wait">
                {checkoutStage === 'SELECT_PAYMENT' && (
                <motion.div
                  key="stage-1-select"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  
                  {/* CARD 1: RINGKASAN PESERTA DUMMY */}
                  <div className="glass-card p-5 sm:p-6 relative overflow-hidden" id="ringkasan-peserta">
                    {/* Glowing Accent */}
                    <div className="absolute top-0 left-0 h-[2px] w-1/3 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]" />
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#8B5CF6]" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          Ringkasan Data Peserta
                        </h3>
                      </div>
                      
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-3.5 py-1 text-xs font-bold text-[#22D3EE] bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 border border-[#22D3EE]/20 rounded-md transition-all uppercase tracking-wide cursor-pointer"
                        style={{ minHeight: '32px' }}
                      >
                        Edit
                      </button>
                    </div>

                    {/* Responsive Grid layout for participant info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-[#070A12]/50 border border-[rgba(255,255,255,0.03)]">
                        <div className="p-1.5 rounded-md bg-[#8B5CF6]/10 text-[#8B5CF6] shrink-0">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[#707888] font-mono uppercase text-[9px] tracking-wider">Nama Peserta</p>
                          <p className="text-[#F7F8FC] font-semibold text-sm">{participant.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-[#070A12]/50 border border-[rgba(255,255,255,0.03)]">
                        <div className="p-1.5 rounded-md bg-[#3B82F6]/10 text-[#3B82F6] shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[#707888] font-mono uppercase text-[9px] tracking-wider">No. WhatsApp</p>
                          <p className="text-[#F7F8FC] font-semibold text-sm">{participant.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-[#070A12]/50 border border-[rgba(255,255,255,0.03)]">
                        <div className="p-1.5 rounded-md bg-[#22D3EE]/10 text-[#22D3EE] shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[#707888] font-mono uppercase text-[9px] tracking-wider">Kota Domisili</p>
                          <p className="text-[#F7F8FC] font-semibold text-sm">{participant.city}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-[#070A12]/50 border border-[rgba(255,255,255,0.03)]">
                        <div className="p-1.5 rounded-md bg-[#34D399]/10 text-[#34D399] shrink-0">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[#707888] font-mono uppercase text-[9px] tracking-wider">Pekerjaan</p>
                          <p className="text-[#F7F8FC] font-semibold text-sm">{participant.job}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: PILIHAN CARA PEMBAYARAN */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <CreditCard className="w-4 h-4 text-[#22D3EE]" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pilih Cara Pembayaran</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* OPTION 1: BAYAR LUNAS (DEFAULT SELECTION) */}
                      <button
                        onClick={() => setSelectedPayment('FULL_PAYMENT')}
                        className={`text-left p-5 rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-300 flex flex-col justify-between h-full border ${
                          selectedPayment === 'FULL_PAYMENT'
                            ? 'bg-[#151C2B] border-[#8B5CF6] shadow-[0_0_24px_rgba(139,92,246,0.12)]'
                            : 'bg-[#111724]/90 border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[#151C2B]/60'
                        }`}
                        style={{ minHeight: '210px' }}
                      >
                        {/* Selected background glow indicator */}
                        {selectedPayment === 'FULL_PAYMENT' && (
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#8B5CF6]/15 to-transparent rounded-bl-full pointer-events-none" />
                        )}

                        <div className="space-y-3 relative w-full">
                          {/* Title & Badge */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-base font-extrabold text-white">Bayar Lunas</span>
                            <span className="text-[10px] font-bold text-[#FBBF24] bg-[#FBBF24]/10 border border-[#FBBF24]/25 px-2 py-0.5 rounded-full uppercase">
                              Khusus malam ini
                            </span>
                          </div>

                          <p className="text-xs text-[#A0A7B4] leading-relaxed">
                            Harga spesial hanya berlaku malam ini sampai pukul 23.59 WIB.
                          </p>

                          {/* Price Tag */}
                          <div className="pt-2">
                            <span className="text-[10px] text-[#707888] line-through font-medium block">Rp2.700.000</span>
                            <span className="text-2xl font-black text-white bg-gradient-to-r from-white to-[#A0A7B4] bg-clip-text text-transparent">
                              Rp1.000.000
                            </span>
                          </div>
                        </div>

                        {/* Benefits list or radio indicator */}
                        <div className="mt-5 pt-3 border-t border-[rgba(255,255,255,0.04)] w-full flex items-center justify-between">
                          <ul className="text-[11px] text-[#707888] space-y-0.5">
                            <li className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#34D399]" />
                              <span>Bayar sekali, hemat Rp1.700.000</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#34D399]" />
                              <span>Akses penuh langsung aktif</span>
                            </li>
                          </ul>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selectedPayment === 'FULL_PAYMENT' ? 'border-[#8B5CF6]' : 'border-[rgba(255,255,255,0.2)]'
                          }`}>
                            {selectedPayment === 'FULL_PAYMENT' && <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />}
                          </div>
                        </div>
                      </button>

                      {/* OPTION 2: BAYAR BERTAHAP (DP + PELUNASAN) */}
                      <button
                        onClick={() => setSelectedPayment('INSTALLMENT')}
                        className={`text-left p-5 rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-300 flex flex-col justify-between h-full border ${
                          selectedPayment === 'INSTALLMENT'
                            ? 'bg-[#151C2B] border-[#8B5CF6] shadow-[0_0_24px_rgba(139,92,246,0.12)]'
                            : 'bg-[#111724]/90 border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[#151C2B]/60'
                        }`}
                        style={{ minHeight: '210px' }}
                      >
                        {selectedPayment === 'INSTALLMENT' && (
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#3B82F6]/10 to-transparent rounded-bl-full pointer-events-none" />
                        )}

                        <div className="space-y-3 relative w-full">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-base font-extrabold text-white">Bayar Bertahap</span>
                            <span className="text-[10px] font-bold text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/25 px-2 py-0.5 rounded-full uppercase">
                              Cicilan Ringan
                            </span>
                          </div>

                          <p className="text-xs text-[#A0A7B4] leading-relaxed">
                            Meringankan cashflow Anda. Amankan kursi hari ini, bayar sisa besok.
                          </p>

                          <div className="pt-2">
                            <p className="text-[10px] text-[#707888] font-medium block">DP DIBAYAR HARI INI</p>
                            <span className="text-2xl font-black text-[#22D3EE]">
                              Rp200.000
                            </span>
                          </div>
                        </div>

                        {/* Installment specs */}
                        <div className="mt-5 pt-3 border-t border-[rgba(255,255,255,0.04)] w-full flex items-center justify-between">
                          <ul className="text-[11px] text-[#707888] space-y-0.5">
                            <li className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#22D3EE]" />
                              <span>Pelunasan besok: Rp1.200.000</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-[#A0A7B4] font-medium">
                              <span className="w-1 h-1 rounded-full bg-[#22D3EE]" />
                              <span>Total bayar: Rp1.400.000</span>
                            </li>
                          </ul>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selectedPayment === 'INSTALLMENT' ? 'border-[#8B5CF6]' : 'border-[rgba(255,255,255,0.2)]'
                          }`}>
                            {selectedPayment === 'INSTALLMENT' && <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />}
                          </div>
                        </div>
                      </button>

                    </div>
                  </div>

                  {/* LIVE COUNTDOWN PANEL (EXCLUSIVELY FOR FULL PAYMENT) */}
                  <AnimatePresence>
                    {selectedPayment === 'FULL_PAYMENT' && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="p-5 rounded-2xl bg-gradient-to-r from-[rgba(251,191,36,0.04)] to-[rgba(139,92,246,0.03)] border border-amber-500/15 flex flex-col md:flex-row items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 text-center md:text-left">
                          <div className="p-3 rounded-xl bg-amber-500/10 text-[#FBBF24]">
                            <Hourglass className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                              Penawaran Promo Terbatas
                            </h4>
                            <p className="text-xs text-[#A0A7B4] leading-relaxed mt-0.5">
                              Harga lunas spesial Rp1.000.000 segera berakhir di penghujung hari. Amankan kursi Anda!
                            </p>
                          </div>
                        </div>

                        {/* Live Timer Clock Boxes */}
                        <div className="shrink-0 flex items-center gap-2">
                          {isPromoExpired ? (
                            <span className="text-xs font-bold text-red-400 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded">
                              Promo Telah Berakhir
                            </span>
                          ) : (
                            <>
                              <div className="flex flex-col items-center">
                                <div className="w-12 h-11 rounded-lg bg-[#111724] border border-[rgba(255,255,255,0.08)] flex items-center justify-center font-mono text-base font-extrabold text-[#F7F8FC]">
                                  {countdown.hours.toString().padStart(2, '0')}
                                </div>
                                <span className="text-[10px] text-[#707888] mt-1 font-mono uppercase">Jam</span>
                              </div>
                              <span className="text-lg font-bold text-[#707888] -mt-4">:</span>
                              
                              <div className="flex flex-col items-center">
                                <div className="w-12 h-11 rounded-lg bg-[#111724] border border-[rgba(255,255,255,0.08)] flex items-center justify-center font-mono text-base font-extrabold text-[#FBBF24]">
                                  {countdown.minutes.toString().padStart(2, '0')}
                                </div>
                                <span className="text-[10px] text-[#707888] mt-1 font-mono uppercase">Menit</span>
                              </div>
                              <span className="text-lg font-bold text-[#707888] -mt-4">:</span>

                              <div className="flex flex-col items-center">
                                <div className="w-12 h-11 rounded-lg bg-[#111724] border border-[rgba(255,255,255,0.08)] flex items-center justify-center font-mono text-base font-extrabold text-[#22D3EE] animate-pulse">
                                  {countdown.seconds.toString().padStart(2, '0')}
                                </div>
                                <span className="text-[10px] text-[#707888] mt-1 font-mono uppercase">Detik</span>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* BILL SUMMARY BOX */}
                  <div className="p-5 rounded-2xl bg-[#0B0F19]/90 border border-[rgba(255,255,255,0.04)] text-xs space-y-3.5">
                    <div className="flex justify-between items-center text-[#707888]">
                      <span>Kategori Dipilih:</span>
                      <span className="text-[#F7F8FC] font-semibold">
                        {selectedPayment === 'FULL_PAYMENT' ? 'Bayar Lunas' : 'Bayar Bertahap (DP)'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[#707888]">
                      <span>Tagihan Sekarang:</span>
                      <span className="text-[#F7F8FC] font-bold text-sm">
                        Rp{currentBillAmount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {selectedPayment === 'INSTALLMENT' && (
                      <div className="p-3 rounded-lg bg-[#22D3EE]/5 border border-[#22D3EE]/10 text-[11px] text-[#A0A7B4] leading-relaxed">
                        Anda membayarkan uang muka (DP) sebesar <span className="text-[#22D3EE] font-bold">Rp200.000</span> hari ini. Sisa pelunasan sebesar <span className="text-white font-bold">Rp1.200.000</span> dibayarkan esok hari sebelum sesi workshop dimulai.
                      </div>
                    )}

                    <div className="h-[1px] bg-[rgba(255,255,255,0.06)]" />

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white uppercase tracking-wider">Total yang Harus Dibayar:</span>
                      <span className="text-xl font-black bg-gradient-to-r from-white via-[#A0A7B4] to-[#22D3EE] bg-clip-text text-transparent">
                        Rp{currentBillAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* FORWARD STEP ACTION */}
                  <button
                    onClick={handleLanjutPembayaran}
                    className="w-full h-14 ai-gradient-bg rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#8B5CF6]/15 hover:opacity-95 active:scale-[0.98] transition-all"
                  >
                    Lanjutkan ke Konfirmasi Pembayaran
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* SECURITY NOTES BAR */}
                  <div className="text-center">
                    <p className="text-[11px] text-[#707888]">
                      Dengan melanjutkan, Anda menyetujui seluruh <span className="text-[#22D3EE] hover:underline cursor-pointer">Syarat & Ketentuan</span> yang berlaku.
                    </p>
                  </div>

                </motion.div>
              )}

              {checkoutStage === 'CONFIRMATION' && (
                <motion.div
                  key="stage-2-confirm"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  
                  {/* RETRO BACK BUTTON CONTROL */}
                  <button
                    onClick={() => setCheckoutStage('SELECT_PAYMENT')}
                    className="flex items-center gap-2 text-xs font-bold text-[#A0A7B4] hover:text-white transition-colors cursor-pointer px-1"
                    style={{ minHeight: '36px' }}
                  >
                    <ChevronLeft className="w-4 h-4 text-[#8B5CF6]" />
                    <span>Kembali, Ubah Metode Pembayaran</span>
                  </button>

                  {/* BILL DETAILS GRID */}
                  <div className="glass-card p-5 sm:p-6 space-y-5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3">
                      <Terminal className="w-4.5 h-4.5 text-[#8B5CF6]" />
                      Konfirmasi Pembayaran Anda
                    </h3>

                    {/* Left & Right specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Left Block: Event Brief */}
                      <div className="space-y-4 p-4 rounded-xl bg-[#070A12]/80 border border-[rgba(255,255,255,0.04)]">
                        <p className="text-[10px] font-bold text-[#707888] uppercase tracking-widest font-mono">DETAIL WORKSHOP</p>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-white">Workshop Jadi Programmer AI Sehari</h4>
                          <p className="text-xs text-[#A0A7B4]">Pelatihan intensif membangun aplikasi AI dalam satu hari.</p>
                        </div>

                        <div className="h-[1px] bg-[rgba(255,255,255,0.04)]" />

                        <div className="space-y-1.5 text-xs text-[#707888]">
                          <p>Hari, Tanggal: <span className="text-[#F7F8FC] font-semibold">Sabtu, 4 Juli 2026</span></p>
                          <p>Waktu: <span className="text-[#F7F8FC]">09.00 – 16.00 WIB</span></p>
                          <p>Lokasi: <span className="text-[#F7F8FC]">Online via Zoom Meeting</span></p>
                        </div>
                      </div>

                      {/* Right Block: Bill Details */}
                      <div className="space-y-4 p-4 rounded-xl bg-[#070A12]/80 border border-[rgba(255,255,255,0.04)] flex flex-col justify-between">
                        <div className="space-y-3.5">
                          <p className="text-[10px] font-bold text-[#707888] uppercase tracking-widest font-mono">RINCIAN BIAYA</p>
                          
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-[#707888]">Pilihan Pembayaran:</span>
                              <span className="text-white font-bold">
                                {selectedPayment === 'FULL_PAYMENT' ? 'Bayar Lunas (100%)' : 'Bayar Bertahap (DP)'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#707888]">Tagihan Sekarang:</span>
                              <span className="text-white font-semibold">
                                Rp{currentBillAmount.toLocaleString('id-ID')}
                              </span>
                            </div>
                            {selectedPayment === 'INSTALLMENT' && (
                              <div className="flex justify-between text-yellow-400">
                                <span>Kewajiban Pelunasan:</span>
                                <span>Rp1.200.000</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[rgba(255,255,255,0.04)] flex justify-between items-baseline">
                          <span className="text-[11px] font-bold text-[#A0A7B4] uppercase">TOTAL DIBAYAR:</span>
                          <span className="text-lg font-black text-[#22D3EE] font-mono">
                            Rp{currentBillAmount.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* COOPERATION STATEMENT */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#8B5CF6]/5 to-[#3B82F6]/5 border border-[rgba(139,92,246,0.1)] flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Sistem Pembayaran Terintegrasi Midtrans</h4>
                      <p className="text-xs text-[#A0A7B4] mt-0.5 leading-relaxed">
                        Kami bekerja sama dengan Midtrans, payment gateway berizin resmi Bank Indonesia. Data kartu kredit, debit, dan e-wallet Anda dilindungi dengan standar keamanan PCI-DSS level 1 tertinggi.
                      </p>
                    </div>
                  </div>

                  {/* ACTION TRIGGER BUTTON (LAUNCHES MIDTRANS MODAL) */}
                  <div className="space-y-3">
                    <button
                      onClick={handleBayarMidtrans}
                      disabled={loadingPayment}
                      className="w-full h-14 ai-gradient-bg rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#8B5CF6]/20 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {loadingPayment ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                          Menghubungkan Midtrans...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-[#22D3EE]" />
                          Bayar melalui Midtrans
                        </>
                      )}
                    </button>
                    
                    <p className="text-center text-[11px] text-[#707888] flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3 text-[#34D399]" />
                      <span>Transaksi aman terenkripsi SSL 256-bit diproses oleh Midtrans Sandbox</span>
                    </p>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </section>

      </main>

      {/* 3. TOAST USER FEEDBACK POPUP */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 bg-[#111724] border border-[rgba(255,255,255,0.12)] text-white text-xs font-semibold rounded-xl shadow-2xl z-50 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. DIALOGS & OVERLAYS */}
      
      {/* A. Edit Participant details Pop-up */}
      <EditParticipantModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        participant={participant}
        onSave={(updated) => {
          setParticipant(updated);
          triggerToast('Data peserta berhasil diperbarui!');
        }}
      />

      {/* B. Simulated Midtrans Checkout Modal popup */}
      <MidtransMockup
        isOpen={isMidtransOpen}
        onClose={() => setIsMidtransOpen(false)}
        onSuccess={handlePaymentSuccess}
        amount={currentBillAmount}
        paymentOption={selectedPayment}
      />

      {/* C. Payment Success Confirmation pop-up */}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        paymentOption={selectedPayment}
        amountPaid={currentBillAmount}
        selectedMethodName={selectedMethodName}
        onOpenInvoice={() => setIsInvoiceOpen(true)}
        onRestart={handleRestartFlow}
      />

      {/* D. Printable digital Invoice digital receipt pop-up */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        participant={participant}
        paymentOption={selectedPayment}
        amountPaid={currentBillAmount}
        selectedMethod={selectedMethodName}
      />

      {/* Bottom Nav Decoration */}
      <div className="h-2 w-full ai-gradient-bg opacity-30 blur-md fixed bottom-0 z-50 pointer-events-none"></div>

    </div>
  );
}
