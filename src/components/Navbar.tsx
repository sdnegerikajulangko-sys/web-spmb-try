import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, LogOut, Settings } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useSettings } from '../context/SettingsContext';
import { getStoredUser, logoutAdmin } from '../services/api';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser());
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();

  // Fungsi untuk mengecek ulang user secara berkala/saat event tertentu
  const syncUser = useCallback(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    // Sinkronisasi saat pindah halaman
    syncUser();

    // Listener untuk mendeteksi perubahan storage dari tab lain atau proses logout
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_session') syncUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location, syncUser]);

  const handleLogout = () => {
    logoutAdmin();
    setUser(null);
    setIsOpen(false);
    navigate('/');
  };

  // Link dasar yang bisa dilihat semua orang
  const publicLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Panduan', path: '/panduan' },
    { name: 'Pendaftaran', path: '/daftar' },
    { name: 'Cek Kelulusan', path: '/cek-kelulusan' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            {settings?.logoSekolah ? (
              <img 
                src={settings.logoSekolah} 
                alt="Logo" 
                className="h-9 w-9 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" 
              />
            ) : (
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <GraduationCap size={20} />
              </div>
            )}
            <span className="font-bold text-lg tracking-tight text-slate-900 truncate max-w-[180px] md:max-w-none">
              {settings?.namaSekolah || 'SD Negeri 1 Ratolindo'}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  location.pathname === link.path 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                )}
              >
                {link.name}
              </Link>
            ))}

            {/* Menu Admin HANYA muncul jika user login */}
            {user && (
              <Link
                to="/admin"
                className={cn(
                  "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border border-transparent transition-all",
                  location.pathname.startsWith('/admin')
                    ? "text-blue-700 bg-blue-100/50 border-blue-200"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <Settings size={16} /> Admin
              </Link>
            )}

            <div className="h-6 w-[1px] bg-slate-200 mx-2" />

            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-full transition-all"
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <Link
                to="/daftar"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-blue-200 transition-all active:scale-95"
              >
                Daftar Sekarang
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-base font-medium",
                    location.pathname === link.path ? "bg-blue-50 text-blue-600" : "text-slate-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {user && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 bg-slate-50"
                >
                  Panel Admin
                </Link>
              )}

              <div className="pt-4 border-t mt-4">
                {user ? (
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl font-bold">
                    <LogOut size={20} /> Logout Admin
                  </button>
                ) : (
                  <Link to="/daftar" onClick={() => setIsOpen(false)} className="block w-full text-center p-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">
                    Daftar Sekarang
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
