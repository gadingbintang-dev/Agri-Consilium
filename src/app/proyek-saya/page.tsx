'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Eye, 
  ArrowRightLeft, 
  Plus, 
  X,
  TrendingUp,
  Clock,
  Coins
} from 'lucide-react';
import { cn } from '@/utils/cn';
import projectsData from '@/data/projects.json';

const projects = projectsData as Record<string, any>;

export default function ProyekSayaPage() {
  const { savedProjects, deleteProject, setSelectedProject } = useStore();
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const router = useRouter();

  const handleView = (project: any) => {
    setSelectedProject(project);
    router.push('/detail-proyek');
  };

  const toggleComparison = (id: string) => {
    setSelectedForComparison(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(-2)
    );
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const comparisonData = savedProjects.filter(p => selectedForComparison.includes(p.id));

  return (
    <div className="container mx-auto px-6 py-20 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20">
        <div>
          <h1 className="text-4xl font-bold text-black tracking-tight">Dashboard Proyek</h1>
          <p className="text-black/50 font-medium mt-2">Kelola dan bandingkan hasil optimasi lahan strategis Anda.</p>
        </div>
        <button 
          onClick={() => router.push('/konsultasi')}
          className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-black/90 transition-all shadow-2xl shadow-black/10 active:scale-95"
        >
          <Plus size={18} /> Proyek Baru
        </button>
      </div>

      {savedProjects.length === 0 ? (
        <div className="text-center py-40 bg-black/[0.01] rounded-[40px] border border-black/[0.03] flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
            <Plus className="text-black/20" size={24} />
          </div>
          <h3 className="text-xl font-bold text-black mb-3 tracking-tight">Belum ada proyek aktif</h3>
          <p className="text-black/40 text-sm font-medium mb-10 max-w-xs">Mulai analisis pertama Anda untuk melihat daftar proyek di sini.</p>
          <button 
            onClick={() => router.push('/konsultasi')}
            className="px-10 py-4 bg-black text-white rounded-xl font-bold text-sm hover:bg-black/90 transition-all"
          >
            Mulai Analisis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedProjects.map((project) => {
            const projectInfo = projects[project.type];
            if (!projectInfo) return null;
            const isSelected = selectedForComparison.includes(project.id);

            return (
              <motion.div
                key={project.id}
                layout
                className={cn(
                  "bg-white rounded-[32px] p-8 border transition-all relative group",
                  isSelected ? "border-black shadow-2xl shadow-black/5" : "border-black/[0.05] hover:border-black/20"
                )}
              >
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-black tracking-tight">{projectInfo.name}</h3>
                    <p className="text-[10px] text-black/20 font-bold uppercase tracking-widest mt-1">
                      {new Date(project.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <button 
                    onClick={() => deleteProject(project.id)}
                    className="p-2 text-black/10 hover:text-black transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black/30 uppercase tracking-widest">Luas Lahan</span>
                    <span className="text-sm font-bold text-black">{project.parameters.area} m²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black/30 uppercase tracking-widest">Estimasi Biaya</span>
                    <span className="text-sm font-bold text-black">{formatIDR(project.cost.medium)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black/30 uppercase tracking-widest">Kelayakan</span>
                    <span className={cn(
                      "text-sm font-bold",
                      project.feasibility.score > 70 ? "text-black" : "text-black/40"
                    )}>{project.feasibility.score}%</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleView(project)}
                    className="flex-1 py-3.5 bg-black/[0.03] text-black rounded-xl text-xs font-bold hover:bg-black/[0.06] transition-all flex items-center justify-center gap-2"
                  >
                    <Eye size={14} /> Buka
                  </button>
                  <button 
                    onClick={() => toggleComparison(project.id)}
                    className={cn(
                      "flex-1 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                      isSelected ? "bg-black text-white" : "bg-black/[0.03] text-black/40 hover:text-black hover:bg-black/[0.06]"
                    )}
                  >
                    <ArrowRightLeft size={14} /> Bandingkan
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Comparison Drawer */}
      <AnimatePresence>
        {selectedForComparison.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl glass border border-black/[0.05] rounded-[40px] p-8 shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-black flex items-center gap-3">
                <ArrowRightLeft size={16} /> Analisis Komparatif 
                <span className="text-black/20 font-bold ml-2">({selectedForComparison.length}/2)</span>
              </h3>
              <button 
                onClick={() => setSelectedForComparison([])}
                className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 relative">
              {comparisonData.length === 0 ? (
                <div className="col-span-2 text-center py-6 text-black/20 text-[10px] font-bold uppercase tracking-widest">
                  Pilih satu proyek lagi untuk memulai perbandingan
                </div>
              ) : (
                comparisonData.map((project, i) => (
                  <div key={project.id} className="p-6 rounded-3xl bg-black/[0.02] border border-black/[0.03]">
                    <div className="font-bold text-black mb-4 tracking-tight">{projects[project.type].name}</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={10} /> Skor</span>
                        <span className="text-xs font-bold text-black">{project.feasibility.score}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest flex items-center gap-2"><Coins size={10} /> Biaya</span>
                        <span className="text-xs font-bold text-black">{formatIDR(project.cost.medium)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest flex items-center gap-2"><Clock size={10} /> Perawatan</span>
                        <span className="text-xs font-bold text-black">{project.maintenance.hoursPerWeek} j/m</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {comparisonData.length === 2 && (
                <div className="absolute inset-x-0 -bottom-14 text-center">
                   <div className="inline-block px-4 py-1.5 bg-black text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-full">
                    Hasil: {comparisonData[0].feasibility.score > comparisonData[1].feasibility.score 
                      ? `${projects[comparisonData[0].type].name} memiliki efisiensi lebih tinggi`
                      : `${projects[comparisonData[1].type].name} memiliki efisiensi lebih tinggi`}
                   </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
