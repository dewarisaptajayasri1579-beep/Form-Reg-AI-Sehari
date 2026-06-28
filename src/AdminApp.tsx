import React, { useState, useEffect } from 'react';
import { Lock, Users, LogOut, CheckCircle, Clock, Eye, X } from 'lucide-react';

interface Transaction {
  id: string;
  midtrans_order_id: string;
  name: string;
  phone: string;
  city: string | null;
  job: string | null;
  payment_option: string | null;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminApp() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_password');
    if (savedPassword) {
      setPassword(savedPassword);
      fetchTransactions(savedPassword);
    }
  }, []);

  const fetchTransactions = async (authPassword: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/transactions', {
        headers: {
          'Authorization': `Bearer ${authPassword}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        setIsLoggedIn(true);
        localStorage.setItem('admin_password', authPassword);
      } else {
        const errData = await response.json();
        setError(errData.message || 'Gagal login, password salah.');
        setIsLoggedIn(false);
        localStorage.removeItem('admin_password');
      }
    } catch (err) {
      setError('Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions(password);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    setTransactions([]);
    localStorage.removeItem('admin_password');
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111827] rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-8">Admin Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password Admin</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1F2937] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Masukkan password..."
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Memeriksa...' : 'Login ke Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-300 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111827] p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard Peserta</h1>
              <p className="text-sm text-gray-400">Total {transactions.length} pendaftar</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => fetchTransactions(password)}
              className="flex-1 md:flex-none px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors text-center"
            >
              Refresh Data
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-4">
          {transactions.length === 0 ? (
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 text-center text-gray-500">
              Belum ada data pendaftar.
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="bg-[#111827] border border-gray-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-lg">{tx.name}</h3>
                    <p className="text-sm text-gray-400">{tx.phone}</p>
                  </div>
                  {tx.status === 'SUCCESS' || tx.status === 'settlement' ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                      LUNAS
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20">
                      PENDING
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Tagihan</p>
                    <p className="font-medium text-gray-300">{formatRupiah(tx.total_amount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tanggal</p>
                    <p className="font-medium text-gray-300">{new Date(tx.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTx(tx)}
                  className="w-full flex items-center justify-center gap-2 py-2 mt-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm transition-colors border border-blue-500/20"
                >
                  <Eye className="w-4 h-4" />
                  Detail Lengkap
                </button>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#1F2937] text-gray-400">
                <tr>
                  <th className="p-4 font-semibold">Tanggal</th>
                  <th className="p-4 font-semibold">Nama Peserta</th>
                  <th className="p-4 font-semibold">Kontak & Kota</th>
                  <th className="p-4 font-semibold">Pekerjaan</th>
                  <th className="p-4 font-semibold">Total Tagihan</th>
                  <th className="p-4 font-semibold">Status Pembayaran</th>
                  <th className="p-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Belum ada data pendaftar.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#1F2937]/50 transition-colors">
                      <td className="p-4">
                        <div className="text-gray-300">
                          {new Date(tx.created_at).toLocaleDateString('id-ID')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(tx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </div>
                      </td>
                      <td className="p-4 font-medium text-white">
                        {tx.name}
                      </td>
                      <td className="p-4">
                        <div className="text-gray-300">{tx.phone}</div>
                        <div className="text-xs text-gray-500">{tx.city || '-'}</div>
                      </td>
                      <td className="p-4 text-gray-400">
                        {tx.job || '-'}
                      </td>
                      <td className="p-4">
                        <div className="text-gray-300 font-medium">
                          {formatRupiah(tx.total_amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {tx.payment_option === 'FULL_PAYMENT' ? 'Lunas' : 'DP 200rb'}
                        </div>
                      </td>
                      <td className="p-4">
                        {tx.status === 'SUCCESS' || tx.status === 'settlement' ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                            <CheckCircle className="w-3.5 h-3.5" />
                            LUNAS / BERHASIL
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20">
                            <Clock className="w-3.5 h-3.5" />
                            PENDING
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="inline-flex items-center justify-center p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-blue-500/20"
                          title="Lihat Detail Lengkap"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Detail Transaksi Database</h3>
              <button 
                onClick={() => setSelectedTx(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1 bg-[#1F2937]/50 p-4 rounded-xl border border-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">ID Database</p>
                  <p className="text-sm font-mono text-gray-300 break-all">{selectedTx.id}</p>
                </div>
                
                <div className="space-y-1 bg-[#1F2937]/50 p-4 rounded-xl border border-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID (Midtrans)</p>
                  <p className="text-sm font-mono text-blue-400 break-all">{selectedTx.midtrans_order_id}</p>
                </div>
                
                <div className="space-y-1 bg-[#1F2937]/50 p-4 rounded-xl border border-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Peserta</p>
                  <p className="text-base font-semibold text-white">{selectedTx.name}</p>
                </div>
                
                <div className="space-y-1 bg-[#1F2937]/50 p-4 rounded-xl border border-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">No HP / WhatsApp</p>
                  <p className="text-base text-gray-300">{selectedTx.phone}</p>
                </div>
                
                <div className="space-y-1 bg-[#1F2937]/50 p-4 rounded-xl border border-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kota</p>
                  <p className="text-base text-gray-300">{selectedTx.city || '-'}</p>
                </div>
                
                <div className="space-y-1 bg-[#1F2937]/50 p-4 rounded-xl border border-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pekerjaan</p>
                  <p className="text-base text-gray-300">{selectedTx.job || '-'}</p>
                </div>
                
                <div className="space-y-1 bg-[#1F2937]/50 p-4 rounded-xl border border-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Opsi Pembayaran</p>
                  <p className="text-base text-gray-300">
                    {selectedTx.payment_option === 'FULL_PAYMENT' ? 'LUNAS (Full Payment)' : 'DP 200rb (Down Payment)'}
                  </p>
                </div>
                
                <div className="space-y-1 bg-[#1F2937]/50 p-4 rounded-xl border border-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</p>
                  <p className="text-base font-bold text-emerald-400">{formatRupiah(selectedTx.total_amount)}</p>
                </div>
                
                <div className="space-y-1 bg-[#1F2937]/50 p-4 rounded-xl border border-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status Transaksi</p>
                  <p className="text-base text-gray-300">
                    {selectedTx.status === 'SUCCESS' || selectedTx.status === 'settlement' 
                      ? <span className="text-emerald-400 font-bold">SUCCESS (LUNAS)</span> 
                      : <span className="text-yellow-400 font-bold">{selectedTx.status}</span>
                    }
                  </p>
                </div>
                
                <div className="space-y-1 bg-[#1F2937]/50 p-4 rounded-xl border border-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal & Waktu Dibuat</p>
                  <p className="text-base text-gray-300">
                    {new Date(selectedTx.created_at).toLocaleDateString('id-ID', { 
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                    })} <br/>
                    <span className="text-sm text-gray-400">
                      Pukul {new Date(selectedTx.created_at).toLocaleTimeString('id-ID')}
                    </span>
                  </p>
                </div>

              </div>
            </div>
            
            <div className="p-6 border-t border-gray-800 flex justify-end">
              <button 
                onClick={() => setSelectedTx(null)}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              >
                Tutup
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
