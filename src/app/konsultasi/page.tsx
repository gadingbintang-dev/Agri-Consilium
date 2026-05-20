'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Maximize2, 
  Sun, 
  Droplets, 
  Wallet, 
  CheckCircle2,
  Info,
  Zap
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useStore } from '@/store/useStore';
import { generateRecommendations } from '@/modules/ai-engine';
import { detectAnalysisMode } from '@/modules/analysis-engine';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  panjang: z.number().min(0.1, 'Panjang harus lebih dari 0'),
  lebar: z.number().min(0.1, 'Lebar harus lebih dari 0'),
  lokasi: z.string().min(3, 'Lokasi harus diisi'),
  budget: z.enum(['rendah', 'menengah', 'tinggi']).optional(),
  tujuan: z.string().optional(),
  pengalaman: z.enum(['pemula', 'menengah', 'ahli']).optional(),
  sinarMatahari: z.enum(['rendah', 'sedang', 'tinggi']).optional(),
  ketersediaanAir: z.enum(['terbatas', 'cukup', 'melimpah']).optional(),
  kondisiTanah: z.enum(['subur', 'tandus', 'berbatu']).optional(),
  drainase: z.enum(['buruk', 'baik', 'sangat baik']).optional(),
  aksesListrik: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function KonsultasiPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { setUserInput, setRecommendations, setAnalysisMode } = useStore();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      panjang: undefined,
      lebar: undefined,
      lokasi: '',
      aksesListrik: false,
    }
  });

  const onSubmit = (data: FormData) => {
    setUserInput(data);
    const recs = generateRecommendations(data);
    const mode = detectAnalysisMode(data);
    setRecommendations(recs);
    setAnalysisMode(mode);
    router.push('/rekomendasi');
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const watchAll = watch();

  return (
    <div className="container mx-auto px-6 py-20 max-w-2xl">
      {/* Progress */}
      <div className="mb-20">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Langkah {step} dari 3</span>
            <h1 className="text-2xl font-bold text-black mt-1">
              {step === 1 && "Dimensi Dasar"}
              {step === 2 && "Profil Ekonomi"}
              {step === 3 && "Konteks Lingkungan"}
            </h1>
          </div>
          <div className="text-right">
             <span className="text-2xl font-bold text-black/10 tracking-tighter">{Math.round((step/3)*100)}%</span>
          </div>
        </div>
        <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-black transition-all"
            initial={{ width: 0 }}
            animate={{ width: `${(step/3)*100}%` }}
          />
        </div>
      </div>

      <div className="relative">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
              >
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Panjang (m)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      {...register('panjang', { valueAsNumber: true })}
                      className="w-full text-4xl font-bold bg-transparent border-b border-black/10 focus:border-black outline-none pb-4 transition-colors placeholder:text-black/5"
                      placeholder="0.0"
                    />
                    {errors.panjang && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.panjang.message}</p>}
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Lebar (m)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      {...register('lebar', { valueAsNumber: true })}
                      className="w-full text-4xl font-bold bg-transparent border-b border-black/10 focus:border-black outline-none pb-4 transition-colors placeholder:text-black/5"
                      placeholder="0.0"
                    />
                    {errors.lebar && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.lebar.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Wilayah / Kota</label>
                  <input 
                    type="text" 
                    {...register('lokasi')}
                    className="w-full text-2xl font-bold bg-transparent border-b border-black/10 focus:border-black outline-none pb-4 transition-colors placeholder:text-black/5"
                    placeholder="misal: Bandung, Jawa Barat"
                  />
                  {errors.lokasi && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.lokasi.message}</p>}
                </div>

                <div className="pt-10">
                  <button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!watchAll.panjang || !watchAll.lebar || !watchAll.lokasi}
                    className="w-full py-6 bg-black text-white rounded-2xl font-bold text-base hover:bg-black/90 transition-all active:scale-[0.98] disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    Lanjutkan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-16"
              >
                <div className="space-y-8">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Tingkat Anggaran</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['rendah', 'menengah', 'tinggi'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setValue('budget', b as any)}
                        className={cn(
                          "py-5 rounded-2xl border transition-all text-sm font-bold capitalize",
                          watchAll.budget === b ? "bg-black border-black text-white shadow-xl shadow-black/10" : "bg-white border-black/[0.05] text-black/40 hover:border-black/20"
                        )}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Pengalaman Pengguna</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['pemula', 'menengah', 'ahli'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setValue('pengalaman', p as any)}
                        className={cn(
                          "py-5 rounded-2xl border transition-all text-sm font-bold capitalize",
                          watchAll.pengalaman === p ? "bg-black border-black text-white shadow-xl shadow-black/10" : "bg-white border-black/[0.05] text-black/40 hover:border-black/20"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-10">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="flex-1 py-6 bg-black/5 text-black rounded-2xl font-bold text-sm hover:bg-black/10 transition-all active:scale-[0.98]"
                  >
                    Kembali
                  </button>
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="flex-[2] py-6 bg-black text-white rounded-2xl font-bold text-base hover:bg-black/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Lanjutkan <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-16"
              >
                <div className="space-y-8">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Paparan Matahari</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['rendah', 'sedang', 'tinggi'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setValue('sinarMatahari', s as any)}
                        className={cn(
                          "py-5 rounded-2xl border transition-all text-sm font-bold capitalize",
                          watchAll.sinarMatahari === s ? "bg-black border-black text-white shadow-xl shadow-black/10" : "bg-white border-black/[0.05] text-black/40 hover:border-black/20"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Akses Air</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['terbatas', 'cukup', 'melimpah'].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setValue('ketersediaanAir', w as any)}
                        className={cn(
                          "py-5 rounded-2xl border transition-all text-sm font-bold capitalize",
                          watchAll.ketersediaanAir === w ? "bg-black border-black text-white shadow-xl shadow-black/10" : "bg-white border-black/[0.05] text-black/40 hover:border-black/20"
                        )}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-black/[0.02] rounded-[32px] border border-black/[0.05]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Zap className="text-black/20" size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-black block">Konektivitas Listrik</span>
                      <span className="text-xs text-black/30 font-medium">Ketersediaan sumber daya di lokasi</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue('aksesListrik', !watchAll.aksesListrik)}
                    className={cn(
                      "w-14 h-8 rounded-full transition-all relative",
                      watchAll.aksesListrik ? "bg-black" : "bg-black/10"
                    )}
                  >
                    <motion.div 
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                      animate={{ x: watchAll.aksesListrik ? 26 : 4 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <div className="flex gap-4 pt-10">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="flex-1 py-6 bg-black/5 text-black rounded-2xl font-bold text-sm hover:bg-black/10 transition-all active:scale-[0.98]"
                  >
                    Kembali
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-6 bg-black text-white rounded-2xl font-bold text-base hover:bg-black/90 transition-all active:scale-[0.98] shadow-2xl shadow-black/10 flex items-center justify-center gap-3 group"
                  >
                    Hasilkan Laporan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
