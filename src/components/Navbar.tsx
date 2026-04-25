import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react'; // Tambahkan useEffect
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useSettings } from '../context/SettingsContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  // Efek untuk mengubah Favicon secara dinamis
  useEffect(() => {
    if (settings?.logoSekolah) {
      // Mencari elemen link icon (favicon)
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      
      if (!favicon) {
        // Jika elemen tidak ada, buat baru
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      
      // Update URL favicon
      favicon.href = settings.logoSekolah;
    }
  }, [settings?.logoSekolah]); // Berjalan setiap kali logoSekolah berubah

  const links = [
    { name: 'Beranda', path: '/' },
    { name: 'Panduan', path: '/panduan' },
    { name: 'Pendaftaran', path: '/daftar' },
    { name: 'Cek Kelulusan', path: '/cek-kelulusan' },
    { name: 'Admin', path: '/admin' },
  ];

  return (
<nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-amber-400 border-b border-amber-500 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
      <Link to="/" className="flex items-center gap-2">
        {settings?.logoSekolah ? (
          <img 
            src={settings.logoSekolah} 
            alt="Logo Sekolah" 
            className="h-10 w-auto object-contain" 
            referrerPolicy="no-referrer" 
          />
        ) : (
          /* Background icon disesuaikan agar lebih gelap sedikit dari nav */
          <div className="bg-amber-600 p-2 rounded-lg text-white">
            <刻GraduationCap size={24} />
          </div>
        )}
        {/* Teks nama sekolah menggunakan warna slate gelap agar kontras di atas kuning */}
        <span className="font-bold text-xl tracking-tight text-slate-900">
          {settings?.namaSekolah || 'SD Negeri Kajulangko'}
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "text-sm font-semibold transition-colors hover:text-amber-800",
              location.pathname === link.path ? "text-amber-900 underline underline-offset-4" : "text-slate-800"
            )}
          >
            {link.name}
          </Link>
        ))}
        {/* Tombol Daftar Sekarang menggunakan warna kontras (Slate atau Biru Tua) */}
        <Link
          to="/daftar"
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
        >
          Daftar Sekarang
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-800 hover:text-black focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>
  </div>
</nav>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    location.pathname === link.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
