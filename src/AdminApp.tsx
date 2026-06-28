import React, { useState, useEffect } from 'react';
import { Lock, Users, LogOut, CheckCircle, Clock } from 'lucide-react';

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

  useEffect(() => {
    // Check if token exists in localStorage on mount
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
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchTransactions(password)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
            >
              Refresh Data
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
