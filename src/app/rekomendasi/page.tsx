'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  ArrowRight,
  LayoutGrid,
  Droplets,
  Fish,
  Leaf,
  Flower2,
  Sprout
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { ProjectType, ProjectResult } from '@/types';
import projectsData from '@/data/projects.json';
import { calculateProjectParameters } from '@/modules/calculation-engine';
import { calculateFeasibility } from '@/modules/analysis-engine';
import { calculateCostEstimation } from '@/modules/cost-engine';
import { getMaintenanceEstimation } from '@/modules/maintenance-engine';

interface ProjectInfo {
  name: string;
  description: string;
  minArea: number;
  recommendedSunlight: string;
  waterRequirement: string;
  difficulty: string;
}

const projects = projectsData as Record<ProjectType, ProjectInfo>;

const getIcon = (type: ProjectType) => {
  switch (type) {
    case 'kolam ikan': return <Fish size={24} />;
    case 'kebun sayur': return <Sprout size={24} />;
    case 'sistem hidroponik': return <Droplets size={24} />;
    case 'taman vertikal': return <LayoutGrid size={24} />;
    case 'kebun herbal': return <Flower2 size={24} />;
    default: return <Leaf size={24} />;
  }
};

export default function RekomendasiPage() {
  const { recommendations, userInput, setSelectedProject } = useStore();
  const router = useRouter();

  if (!userInput) {
    router.push('/konsultasi');
    return null;
  }

  const handleSelect = (type: ProjectType) => {
    const parameters = calculateProjectParameters(type, userInput);
    const feasibility = calculateFeasibility(type, userInput);
    const cost = calculateCostEstimation(type, parameters, userInput);
    const maintenance = getMaintenanceEstimation(type, parameters);

    const projectResult: ProjectResult = {
      id: crypto.randomUUID(),
      input: userInput,
      type,
      parameters,
      feasibility,
      cost,
      maintenance,
      createdAt: new Date().toISOString(),
    };

    setSelectedProject(projectResult);
    router.push('/detail-proyek');
  };

  return (
    <div className="container mx-auto px-6 py-20 max-w-5xl">
      <div className="mb-20">
        <h1 className="text-4xl font-bold text-black tracking-tight mb-4">Rekomendasi Strategis</h1>
        <p className="text-black/50 font-medium">Perencanaan lahan optimal untuk area {userInput.panjang}x{userInput.lebar}m di {userInput.lokasi}.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {recommendations.map((rec, i) => {
          const project = projects[rec.type];
          if (!project) return null;
          const isHighlyRecommended = rec.confidence > 0.7;

          return (
            <motion.div
              key={rec.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleSelect(rec.type)}
              className={cn(
                "group relative bg-white rounded-[32px] p-10 border transition-all cursor-pointer",
                isHighlyRecommended ? "border-black shadow-2xl shadow-black/5" : "border-black/[0.05] hover:border-black/20"
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-10">
                <div className={cn(
                  "w-20 h-20 rounded-[24px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                  isHighlyRecommended ? "bg-black text-white" : "bg-black/[0.03] text-black/20"
                )}>
                  {getIcon(rec.type)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-black tracking-tight">{project.name}</h3>
                        {isHighlyRecommended && (
                          <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-full">Optimal</span>
                        )}
                      </div>
                      <p className="text-black/50 text-sm font-medium mt-1 leading-relaxed max-w-lg">{project.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-1">Skor Keyakinan</div>
                      <div className="text-2xl font-bold tracking-tighter text-black">{Math.round(rec.confidence * 100)}%</div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-start gap-3 p-5 bg-black/[0.02] rounded-2xl border border-black/[0.03]">
                    <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight size={10} />
                    </div>
                    <p className="text-xs font-semibold text-black/60 leading-relaxed italic">{rec.reason}</p>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center pl-6">
                  <div className="w-14 h-14 rounded-full bg-black/[0.03] flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                    <ArrowRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-20 p-10 rounded-[40px] bg-black text-white overflow-hidden relative group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h4 className="text-2xl font-bold mb-3 tracking-tight">Ingin melakukan penyesuaian?</h4>
            <p className="text-white/40 text-sm font-medium">Anda dapat mengkalibrasi ulang data masukan untuk hasil yang berbeda.</p>
          </div>
          <button 
            onClick={() => router.push('/konsultasi')}
            className="w-full md:w-auto px-10 py-5 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            Ubah Data <ChevronRight size={18} />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
      </div>
    </div>
  );
}
