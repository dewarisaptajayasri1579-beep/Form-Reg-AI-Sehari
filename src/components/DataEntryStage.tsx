import React, { useState } from 'react';
import { User, MapPin, Phone, Briefcase, ArrowRight } from 'lucide-react';
import { ParticipantDetails } from '../types';

interface DataEntryStageProps {
  initialData: ParticipantDetails;
  onContinue: (data: ParticipantDetails) => void;
}

export default function DataEntryStage({ initialData, onContinue }: DataEntryStageProps) {
  const [name, setName] = useState(initialData.name === 'Andi Pratama' ? '' : initialData.name);
  const [city, setCity] = useState(initialData.city === 'Boyolali' ? '' : initialData.city);
  const [phone, setPhone] = useState(initialData.phone === '0812-3456-7890' ? '' : initialData.phone);
  const [job, setJob] = useState(initialData.job === 'Software Developer' ? '' : initialData.job);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !phone.trim() || !job.trim()) {
      setError('Semua kolom wajib diisi dengan benar.');
      return;
    }
    setError('');
    onContinue({ name, city, phone, job });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-card p-5 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 h-[2px] w-1/3 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]" />
        
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Data Diri Peserta</h2>
          <p className="text-sm text-[#A0A7B4] mt-1">Silakan isi data diri Anda untuk keperluan sertifikat dan akses kelas.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-[#F87171] rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A0A7B4] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#8B5CF6]" />
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#070A12]/90 border border-[rgba(255,255,255,0.08)] focus:border-[#8B5CF6] text-sm text-white px-3.5 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-colors"
              placeholder="Contoh: Budi Santoso"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A0A7B4] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#3B82F6]" />
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#070A12]/90 border border-[rgba(255,255,255,0.08)] focus:border-[#8B5CF6] text-sm text-white px-3.5 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-colors"
              placeholder="Contoh: 081234567890"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A0A7B4] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#22D3EE]" />
                Kota Domisili
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#070A12]/90 border border-[rgba(255,255,255,0.08)] focus:border-[#8B5CF6] text-sm text-white px-3.5 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-colors"
                placeholder="Contoh: Jakarta"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A0A7B4] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#34D399]" />
                Pekerjaan
              </label>
              <input
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="w-full bg-[#070A12]/90 border border-[rgba(255,255,255,0.08)] focus:border-[#8B5CF6] text-sm text-white px-3.5 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-colors"
                placeholder="Contoh: Mahasiswa"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-14 mt-4 ai-gradient-bg rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#8B5CF6]/20 hover:opacity-95 active:scale-[0.98] transition-all"
          >
            Lanjut Pilih Pembayaran
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
