import React, { useState } from 'react';
import { X, User, MapPin, Phone, Briefcase, Save } from 'lucide-react';
import { ParticipantDetails } from '../types';

interface EditParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: ParticipantDetails;
  onSave: (updated: ParticipantDetails) => void;
}

export default function EditParticipantModal({
  isOpen,
  onClose,
  participant,
  onSave,
}: EditParticipantModalProps) {
  const [name, setName] = useState(participant.name);
  const [city, setCity] = useState(participant.city);
  const [phone, setPhone] = useState(participant.phone);
  const [job, setJob] = useState(participant.job);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !phone.trim() || !job.trim()) {
      setError('Semua kolom wajib diisi dengan benar.');
      return;
    }
    setError('');
    onSave({ name, city, phone, job });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#070A12]/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md glass-card bg-[#111724]/95 border border-[rgba(255,255,255,0.12)] p-6 shadow-2xl z-10 overflow-hidden transform scale-100 transition-all">
        {/* Abstract AI background accent inside modal */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#8B5CF6]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#22D3EE]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-[rgba(255,255,255,0.06)] relative">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Edit Data Diri Peserta</h3>
            <p className="text-xs text-[#A0A7B4]">Sesuaikan informasi kontak untuk sertifikat & WhatsApp.</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[rgba(255,255,255,0.06)] transition-colors text-[#707888] hover:text-white"
            aria-label="Tutup"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          {error && (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-[#F87171] rounded-lg">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A0A7B4] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#8B5CF6]" />
              Nama Lengkap
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#070A12]/90 border border-[rgba(255,255,255,0.08)] focus:border-[#8B5CF6] text-sm text-white px-3.5 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-colors"
                placeholder="Contoh: Andi Pratama"
                style={{ minHeight: '44px' }}
                required
              />
            </div>
          </div>

          {/* WhatsApp Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A0A7B4] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#3B82F6]" />
              Nomor WhatsApp
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#070A12]/90 border border-[rgba(255,255,255,0.08)] focus:border-[#8B5CF6] text-sm text-white px-3.5 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-colors"
                placeholder="Contoh: 081234567890"
                style={{ minHeight: '44px' }}
                required
              />
            </div>
          </div>

          {/* Grid for City and Job */}
          <div className="grid grid-cols-2 gap-3">
            {/* City */}
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
                placeholder="Contoh: Boyolali"
                style={{ minHeight: '44px' }}
                required
              />
            </div>

            {/* Job */}
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
                placeholder="Contoh: Programmer"
                style={{ minHeight: '44px' }}
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)] mt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-transparent hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-sm font-semibold text-[#A0A7B4] hover:text-white rounded-xl transition-colors"
              style={{ minHeight: '44px' }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:opacity-90 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#8B5CF6]/20 transition-all"
              style={{ minHeight: '44px' }}
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
