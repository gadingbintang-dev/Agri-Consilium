'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Pengenal wajib diisi'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser, registeredUsers } = useStore();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = registeredUsers.find(
      u => u.identifier === data.identifier && u.password === data.password
    );

    if (foundUser) {
      setUser({
        id: Math.random().toString(36).substr(2, 9),
        name: foundUser.name,
        email: foundUser.identifier.includes('@') ? foundUser.identifier : foundUser.identifier + '@agri.cons',
        role: 'user',
      });
      setIsLoading(false);
      router.push('/');
    } else {
      setIsLoading(false);
      setError('Pengenal atau kata sandi salah. Pastikan Anda sudah mendaftar.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-black">Agri Cons</span>
            </Link>
            <h1 className="text-2xl font-bold text-black tracking-tight mb-2">Masuk ke Akun</h1>
            <p className="text-black/50 text-sm font-medium">Gunakan pengenal unik Anda untuk masuk.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            )}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black/20">
                  <User size={16} />
                </div>
                <input
                  {...register('identifier')}
                  type="text"
                  placeholder="Pengenal (Username/Email)"
                  className="w-full pl-11 pr-4 py-3.5 bg-black/[0.02] border border-black/[0.05] rounded-xl focus:border-black outline-none font-medium transition-all placeholder:text-black/20 text-sm"
                />
                {errors.identifier && <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.identifier.message}</p>}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black/20">
                  <Lock size={16} />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Kata Sandi"
                  className="w-full pl-11 pr-4 py-3.5 bg-black/[0.02] border border-black/[0.05] rounded-xl focus:border-black outline-none font-medium transition-all placeholder:text-black/20 text-sm"
                />
                {errors.password && <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm hover:bg-black/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Masuk Sekarang <ArrowRight size={16} /></>
              )}
            </button>
            
            <Link 
              href="/"
              className="w-full py-4 bg-black/[0.03] text-black/40 rounded-xl font-bold text-sm hover:bg-black/[0.06] hover:text-black transition-all flex items-center justify-center gap-2"
            >
              Lanjutkan sebagai Tamu
            </Link>
          </form>

          <p className="mt-10 text-center text-xs font-medium text-black/30">
            Belum punya akun? <Link href="/daftar" className="text-black font-bold">Daftar sekarang</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
