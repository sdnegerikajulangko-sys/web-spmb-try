import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useSettings } from '../context/SettingsContext';
import { getStoredUser, logoutAdmin } from '../services/api'; // Import helper API

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser()); // State untuk memantau user
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();

  // Update user state ketika navigasi berubah (agar sinkron setelah login/logout)
  useEffect(() => {
    setUser(getStoredUser());
  }, [location]);

  // Efek Favicon
  useEffect(() => {
    if (settings?.logoSekolah) {
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = settings.logoSekolah;
    }
  }, [settings?.logoSekolah]);

  const handleLogout = () => {
    logoutAdmin();
    setUser(null);
    navigate('/');
  };

  // Filter links: Sembunyikan Admin jika belum login (opsional, tergantung keinginan Anda)
  // Atau biarkan muncul tapi beri penanda status di pojok
  const links = [
    { name: 'Beranda', path: '/' },
    { name: 'Panduan', path: '/panduan' },
    { name: 'Pendaftaran', path: '/daftar' },
    { name: 'Cek Kelulusan', path: '/cek-kelulusan' },
    { name: 'Admin', path: '/admin' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            {settings?.logoSekolah ? (
              <img 
                src={settings.logoSekolah} 
                alt="Logo Sekolah" 
                className="h-10 w-10 rounded-full object-cover border border-slate-100" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
                <GraduationCap size={24} />
              </div>
            )}
            <span className="font-bold text-lg md:text-xl tracking-tight text-slate-900 truncate max-w-[200px] md:max-w-none">
              {settings?.namaSekolah || 'SD Negeri Kajulangko'}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === link.path 
                      ? "text-blue-600 bg-blue-50/50" 
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-900 leading-none">{user.name}</span>
                    <span className="text-[10px] text-slate-500 leading-none">Administrator</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/daftar"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Daftar Sekarang
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-base font-medium transition-all",
                    location.pathname === link.path
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 mt-4 border-t border-slate-100">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                ) : (
                  <Link
                    to="/daftar"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200"
                  >
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
