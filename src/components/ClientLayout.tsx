'use client';

import { Inter } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard, Globe, ChevronRight, User as UserIcon, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/store/useStore";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, setUser } = useStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleLogout = () => {
    setUser(null);
    setIsUserMenuOpen(false);
  };

  return (
    <div className={cn(inter.className, "bg-white text-black min-h-screen selection:bg-emerald-50 selection:text-emerald-700")}>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-black/[0.04]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-xl border border-black/[0.05] flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-95"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? <X size={18} key="close" /> : <Menu size={18} key="menu" />}
              </AnimatePresence>
            </button>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-base">A</span>
              </div>
              <span className="font-semibold text-base tracking-tight hidden sm:block">Agri Cons</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isHydrated && user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-black/[0.03] transition-all active:scale-95 border border-black/[0.05]"
                >
                  <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                    <UserIcon size={14} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-black uppercase tracking-widest hidden sm:block">{user.name}</span>
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl border border-black/[0.05] shadow-2xl p-2 z-50 overflow-hidden"
                    >
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors group"
                      >
                        <LogOut size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Keluar</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="text-xs font-bold px-6 py-2.5 rounded-full border border-black/10 text-black hover:bg-black hover:text-white transition-all shadow-sm active:scale-95 uppercase tracking-widest">
                Masuk
              </Link>
            )}
            <Link href="/konsultasi" className="text-xs font-bold px-6 py-2.5 rounded-full bg-black text-white hover:bg-black/90 transition-all shadow-sm active:scale-95 uppercase tracking-widest hidden sm:block">
              Mulai Perencanaan
            </Link>
          </div>
        </div>
      </header>

      {/* Side Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed top-24 left-6 w-72 bg-white rounded-[32px] border border-black/[0.05] shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 space-y-2">
                <Link 
                  href="/" 
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-black/[0.02] transition-colors group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center text-black/20 group-hover:bg-black group-hover:text-white transition-colors">
                      <Globe size={18} />
                    </div>
                    <span className="text-sm font-bold text-black tracking-tight">Platform</span>
                  </div>
                  <ChevronRight size={14} className="text-black/10 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                </Link>
                <Link 
                  href="/proyek-saya" 
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-black/[0.02] transition-colors group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center text-black/20 group-hover:bg-black group-hover:text-white transition-colors">
                      <LayoutDashboard size={18} />
                    </div>
                    <span className="text-sm font-bold text-black tracking-tight">Dasbor</span>
                  </div>
                  <ChevronRight size={14} className="text-black/10 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
              <div className="p-6 bg-black/[0.02] border-t border-black/[0.03]">
                <div className="text-[9px] font-bold text-black/20 uppercase tracking-[0.2em] mb-1">Status</div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest">Sistem Aktif</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="pt-20">{isHydrated ? children : <div className="min-h-screen bg-white" />}</main>
      <footer className="border-t border-black/[0.04] py-20 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
                <span className="font-semibold text-base tracking-tight">Agri Cons</span>
              </div>
              <p className="text-black/50 text-sm leading-relaxed max-w-sm">
                Mesin optimasi lahan generasi berikutnya. Transformasikan ruang Anda dengan analisis dan perencanaan kelas profesional.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-6 text-xs uppercase tracking-[0.2em]">Produk</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-black/50 text-sm hover:text-black transition-colors">Analisis</a></li>
                <li><a href="#" className="text-black/50 text-sm hover:text-black transition-colors">Mesin Biaya</a></li>
                <li><a href="#" className="text-black/50 text-sm hover:text-black transition-colors">Keberlanjutan</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-6 text-xs uppercase tracking-[0.2em]">Perusahaan</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-black/50 text-sm hover:text-black transition-colors">Privasi</a></li>
                <li><a href="#" className="text-black/50 text-sm hover:text-black transition-colors">Syarat</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-black/[0.04] flex flex-col md:flex-row justify-between items-center gap-4 text-black/40 text-[10px] font-medium uppercase tracking-[0.1em]">
            <span>&copy; {new Date().getFullYear()} Agri Cons.</span>
            <span>Protokol Intelijen Lahan</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
