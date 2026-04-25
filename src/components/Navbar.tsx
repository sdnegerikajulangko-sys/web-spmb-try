import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useSettings } from '../context/SettingsContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

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

  const links = [
    { name: 'Beranda', path: '/' },
    { name: 'Panduan', path: '/panduan' },
    { name: 'Pendaftaran', path: '/daftar' },
    { name: 'Cek Kelulusan', path: '/cek-kelulusan' },
    { name: 'Admin', path: '/admin' },
  ];

  return (
    /* Perubahan: bg-amber-50/40 untuk kesan modern transparan, backdrop-blur-lg untuk efek kaca yang halus */
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-amber-50/40 border-b border-amber-200/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            {settings?.logoSekolah ? (
              <img 
                src={settings.logoSekolah} 
                alt="Logo Sekolah" 
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="bg-amber-500/80 p-2 rounded-xl text-white shadow-sm">
                <GraduationCap size={24} />
              </div>
            )}
            <span className="font-bold text-lg tracking-tight text-slate-800">
              {settings?.namaSekolah || 'SD Negeri Kajulangko'}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                  location.pathname === link.path 
                    ? "text-amber-700 bg-amber-100/50" 
                    : "text-slate-600 hover:text-amber-600 hover:bg-amber-50/50"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pl-4">
              <Link
                to="/daftar"
                className="bg-amber-600/90 hover:bg-amber-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-amber-200 hover:shadow-lg active:scale-95"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:bg-amber-100/50 rounded-lg transition-colors"
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-b border-amber-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    location.pathname === link.path
                      ? "bg-amber-100 text-amber-800"
                      : "text-slate-600 hover:bg-amber-50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
