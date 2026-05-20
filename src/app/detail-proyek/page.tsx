'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  Coins, 
  Clock, 
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/utils/cn';
import projectsData from '@/data/projects.json';
import { generateMarketplaceLinks } from '@/modules/cost-engine';

const projects = projectsData as Record<string, any>;

export default function DetailProyekPage() {
  const { selectedProject, saveProject, savedProjects } = useStore();
  const router = useRouter();

  if (!selectedProject) {
    router.push('/konsultasi');
    return null;
  }

  const project = projects[selectedProject.type];
  const isSaved = savedProjects.some(p => p.id === selectedProject.id);

  if (!project) {
    return (
      <div className="container mx-auto px-6 py-40 text-center">
        <h2 className="text-2xl font-bold mb-4">Proyek tidak ditemukan</h2>
        <p className="text-black/50 mb-8">Data proyek mungkin telah kedaluwarsa atau tidak valid.</p>
        <button 
          onClick={() => router.push('/konsultasi')}
          className="px-8 py-3 bg-black text-white rounded-xl font-bold"
        >
          Mulai Ulang
        </button>
      </div>
    );
  }

  const handleSave = () => {
    saveProject(selectedProject);
    router.push('/proyek-saya');
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-6 py-20 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 rounded-full border border-black/[0.05] flex items-center justify-center text-black/40 hover:text-black hover:border-black/20 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-4xl font-bold text-black tracking-tight">{project.name}</h1>
               <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-full">ID Proyek: {selectedProject.id}</span>
            </div>
            <p className="text-black/50 font-medium">{project.description}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaved}
          className={cn(
            "w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-black/10 active:scale-[0.98]",
            isSaved ? "bg-black/[0.05] text-black/20 cursor-not-allowed shadow-none" : "bg-black text-white hover:bg-black/90"
          )}
        >
          {isSaved ? <CheckCircle size={18} /> : <Save size={18} />}
          {isSaved ? 'Proyek Tersimpan' : 'Konfirmasi & Simpan'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Area', value: `${selectedProject.parameters.area} m²` },
              { label: 'Kompleksitas', value: project.difficulty, capitalize: true },
              { label: 'Indeks Air', value: project.waterRequirement, capitalize: true },
              { label: 'Indeks Surya', value: project.recommendedSunlight, capitalize: true },
            ].map((stat, i) => (
              <div key={i} className="bg-black/[0.02] border border-black/[0.03] p-6 rounded-[24px]">
                <div className="text-[10px] text-black/30 uppercase font-bold tracking-widest mb-2">{stat.label}</div>
                <div className={cn("text-lg font-bold text-black", stat.capitalize && "capitalize")}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Analysis Section */}
          <div className="space-y-8 pt-8">
            <h3 className="text-xl font-bold text-black tracking-tight">Parameter Konfigurasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {selectedProject.parameters.capacity !== undefined && (
                <div className="group">
                  <div className="flex justify-between items-end pb-4 border-b border-black/[0.05]">
                    <span className="text-sm font-bold text-black/40 uppercase tracking-widest">Kapasitas Maksimal</span>
                    <span className="text-xl font-bold text-black">{selectedProject.parameters.capacity}</span>
                  </div>
                </div>
              )}
              {Object.entries(selectedProject.parameters.details).map(([key, value]) => (
                <div key={key} className="group">
                  <div className="flex justify-between items-end pb-4 border-b border-black/[0.05]">
                    <span className="text-sm font-bold text-black/40 uppercase tracking-widest capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-xl font-bold text-black">
                       {typeof value === 'number' ? Math.round(value * 100) / 100 : value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Estimation */}
          <div className="pt-12">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-bold text-black tracking-tight">Estimasi Biaya & Material</h3>
              <div className="text-[10px] font-bold px-4 py-1.5 bg-black/[0.03] text-black/40 rounded-full uppercase tracking-widest">
                Tier: {selectedProject.input.budget || 'standar'}
              </div>
            </div>

            <div className="space-y-4">
              {selectedProject.cost.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-[24px] bg-white border border-black/[0.05] hover:border-black transition-all group">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-black/[0.03] rounded-2xl flex items-center justify-center text-black/20 font-bold text-xs group-hover:bg-black group-hover:text-white transition-colors">
                        {i + 1}
                     </div>
                     <div>
                        <div className="font-bold text-black text-lg tracking-tight">{item.name}</div>
                        <div className="text-xs text-black/30 font-bold uppercase tracking-widest">{item.quantity} {item.unit}</div>
                     </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-3">
                    <div className="font-bold text-black text-lg tracking-tighter">{formatIDR(item.estimatedPrice)}</div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <a href={generateMarketplaceLinks(item.name).tokopedia} target="_blank" className="text-[10px] font-bold text-black/30 hover:text-black uppercase tracking-widest border-b border-black/10">Beli</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-10 bg-black rounded-[40px] text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div>
                  <div className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Total Investasi</div>
                  <div className="text-5xl font-bold tracking-tighter">{formatIDR(selectedProject.cost.medium)}</div>
                </div>
                <div className="text-right">
                  <div className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Rentang Estimasi</div>
                  <div className="text-sm font-bold text-emerald-400">{formatIDR(selectedProject.cost.low)} — {formatIDR(selectedProject.cost.high)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Feasibility Index */}
          <div className="bg-black/[0.02] border border-black/[0.03] rounded-[32px] p-10">
            <h3 className="text-sm font-bold text-black/30 uppercase tracking-[0.2em] mb-10">Indeks Kelayakan</h3>
            
            <div className="relative w-40 h-40 mx-auto mb-10 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-black/[0.03]" />
                <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={465} strokeDashoffset={465 - (465 * selectedProject.feasibility.score) / 100} 
                  className={cn("transition-all duration-1000 ease-out", selectedProject.feasibility.score > 70 ? "text-black" : "text-black/40")}
                />
              </svg>
              <div className="absolute text-5xl font-bold tracking-tighter text-black">{selectedProject.feasibility.score}</div>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Spasial', score: selectedProject.feasibility.breakdown.space },
                { label: 'Lingkungan', score: selectedProject.feasibility.breakdown.environment },
                { label: 'Ekonomi', score: selectedProject.feasibility.breakdown.budget },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold text-black/30 mb-2 uppercase tracking-widest">
                    <span>{item.label}</span>
                    <span className="text-black">{item.score}%</span>
                  </div>
                  <div className="h-1 w-full bg-black/[0.03] rounded-full overflow-hidden">
                    <div className="h-full bg-black transition-all duration-1000" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {selectedProject.feasibility.warnings.length > 0 && (
              <div className="mt-12 space-y-4">
                <div className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] flex items-center gap-3">
                   Peringatan Protokol
                </div>
                {selectedProject.feasibility.warnings.map((warning, i) => (
                  <div key={i} className="p-5 bg-black/[0.02] rounded-2xl text-xs text-black/60 font-medium leading-relaxed border border-black/[0.03]">
                    {warning}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Maintenance Protocol */}
          <div className="bg-black rounded-[32px] p-10 text-white overflow-hidden relative group">
            <h3 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
              Protokol Perawatan
            </h3>
            
            <div className="mb-12">
              <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-2">Alokasi Sumber Daya</div>
              <div className="text-3xl font-bold tracking-tight">{selectedProject.maintenance.hoursPerWeek} jam / minggu</div>
            </div>

            <div className="space-y-6">
              {selectedProject.maintenance.activities.map((activity, i) => (
                <div key={i} className="flex items-start gap-4 group/item">
                  <div className="w-5 h-5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-white group-hover/item:text-black transition-all">
                    <CheckCircle size={12} />
                  </div>
                  <span className="text-sm text-white/60 leading-relaxed font-medium">{activity}</span>
                </div>
              ))}
            </div>
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
