'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

const registerSchema = z.object({
  identifier: z.string().min(3, 'Pengenal minimal 3 karakter'),
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Kata sandi tidak cocok",
  path: ["confirmPassword"],
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const registerUser = useStore((state) => state.registerUser);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    registerUser({
      identifier: data.identifier,
      name: data.name,
      password: data.password,
    });
    
    setIsLoading(false);
    router.push('/login');
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
            <h1 className="text-2xl font-bold text-black tracking-tight mb-2">Daftar Akun Baru</h1>
            <p className="text-black/50 text-sm font-medium">Buat pengenal unik Anda untuk memulai.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  <UserPlus size={16} />
                </div>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-full pl-11 pr-4 py-3.5 bg-black/[0.02] border border-black/[0.05] rounded-xl focus:border-black outline-none font-medium transition-all placeholder:text-black/20 text-sm"
                />
                {errors.name && <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.name.message}</p>}
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

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black/20">
                  <Lock size={16} />
                </div>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Konfirmasi Kata Sandi"
                  className="w-full pl-11 pr-4 py-3.5 bg-black/[0.02] border border-black/[0.05] rounded-xl focus:border-black outline-none font-medium transition-all placeholder:text-black/20 text-sm"
                />
                {errors.confirmPassword && <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.confirmPassword.message}</p>}
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
                <>Daftar Sekarang <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-xs font-medium text-black/30">
            Sudah punya akun? <Link href="/login" className="text-black font-bold">Masuk</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
