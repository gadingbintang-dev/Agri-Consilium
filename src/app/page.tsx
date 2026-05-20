'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight, MapPin, Calculator, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 border border-black/[0.03] text-black/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">
              Sistem Intelijen Lahan 2.0
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-black mb-10 tracking-tight leading-[0.95]">
              Optimalkan lahan <br />
              <span className="text-black/30 italic">dengan presisi.</span>
            </h1>
            <p className="text-xl text-black/50 max-w-xl mx-auto mb-14 leading-relaxed font-medium">
              Platform perencanaan profesional untuk pengembangan lahan modern. Analisis berbasis data untuk setiap meter persegi lahan Anda.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/konsultasi"
                className="w-full sm:w-auto px-10 py-5 bg-black text-white rounded-2xl font-bold text-base hover:bg-black/90 transition-all active:scale-[0.98] shadow-2xl shadow-black/10 flex items-center justify-center gap-3 group"
              >
                Mulai Perencanaan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-10 py-5 bg-transparent text-black/40 border border-black/10 rounded-2xl font-bold text-base hover:bg-black/[0.02] hover:text-black hover:border-black/20 transition-all flex items-center justify-center gap-2"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] border border-black/[0.03] rounded-[100px] [mask-image:radial-gradient(closest-side,white,transparent)] -z-10" />
      </section>

      {/* Feature Grid */}
      <section className="py-40 bg-[#f9f9f9]" id="features">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold text-black mb-6 tracking-tight">Dirancang untuk efisiensi.</h2>
              <p className="text-lg text-black/50 font-medium">Mesin analisis kami menyediakan perhitungan komprehensif untuk optimasi lahan, memastikan setiap keputusan didukung oleh parameter yang tepat.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Calculator className="w-5 h-5" />,
                title: "Mesin Presisi",
                desc: "Algoritma canggih untuk menghitung kepadatan material dan optimasi tata letak lahan."
              },
              {
                icon: <ShieldCheck className="w-5 h-5" />,
                title: "Analisis Risiko",
                desc: "Skor kelayakan otomatis berdasarkan kendala lingkungan dan anggaran yang tersedia."
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Wawasan Instan",
                desc: "Dapatkan laporan komprehensif dan protokol perawatan dalam hitungan detik."
              }
            ].map((feature, i) => (

              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-black/[0.05] shadow-sm mb-10 group-hover:border-black/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-black/50 leading-relaxed text-sm font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <div>
              <div className="text-sm font-bold text-black/30 uppercase tracking-[0.2em] mb-4">Metodologi</div>
              <div className="text-5xl font-bold text-black tracking-tighter italic">Data-Driven</div>
              <p className="mt-4 text-sm text-black/50 font-medium leading-relaxed">Akurasi perhitungan disesuaikan dengan variabel lingkungan di Indonesia.</p>
            </div>
            <div>
              <div className="text-sm font-bold text-black/30 uppercase tracking-[0.2em] mb-4">Cakupan</div>
              <div className="text-5xl font-bold text-black tracking-tighter">Nasional</div>
              <p className="mt-4 text-sm text-black/50 font-medium leading-relaxed">Mendukung berbagai iklim dan kondisi tanah di wilayah Nusantara.</p>
            </div>
            <div>
              <div className="text-sm font-bold text-black/30 uppercase tracking-[0.2em] mb-4">Intelijen</div>
              <div className="text-5xl font-bold text-black tracking-tighter italic">E-1</div>
              <p className="mt-4 text-sm text-black/50 font-medium leading-relaxed">Ditenagai oleh mesin analisis heuristik milik Agri Cons.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
