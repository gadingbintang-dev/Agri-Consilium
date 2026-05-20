import { ProjectType, Recommendation, UserInput } from '@/types';
import projectsData from '@/data/projects.json';
import engineConfig from '@/data/engine-config.json';

const projects = projectsData as Record<string, any>;

export const generateRecommendations = (input: UserInput): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const { panjang, lebar, sinarMatahari, ketersediaanAir, budget } = input;
  const area = panjang * lebar;
  const weights = engineConfig.environmentalWeights;

  Object.keys(projects).forEach((key) => {
    const project = projects[key];
    const type = key as ProjectType;
    let score = 0.5; // baseline
    const contextFactors: string[] = [];

    // Area Context
    if (area < project.minArea) {
      score -= 0.4;
      contextFactors.push(`Lahan Anda (${area}m²) lebih kecil dari syarat minimum ${project.minArea}m².`);
    } else {
      score += 0.15;
      if (area < project.minArea * 2) {
        contextFactors.push('Ukuran lahan sangat efisien untuk proyek ini.');
      } else {
        contextFactors.push('Lahan Anda sangat luas dan mendukung pengembangan skala besar.');
      }
    }

    // Environmental Context (Rule 2 & 6)
    if (sinarMatahari) {
      if (sinarMatahari === project.recommendedSunlight) {
        score += weights.sunlight;
        contextFactors.push(`Paparan matahari ${sinarMatahari} sangat ideal.`);
      } else if (sinarMatahari === 'rendah' && project.recommendedSunlight === 'tinggi') {
        score -= 0.3;
        contextFactors.push('Kurangnya sinar matahari akan menjadi tantangan utama.');
      }
    } else {
      // Rule 7: Conservative recommendation for incomplete data
      score -= 0.1;
      contextFactors.push('Perlu verifikasi paparan matahari untuk hasil optimal.');
    }

    if (ketersediaanAir) {
      if (ketersediaanAir === project.waterRequirement || (ketersediaanAir === 'melimpah' && project.waterRequirement !== 'tinggi')) {
        score += weights.water;
      } else if (ketersediaanAir === 'terbatas' && project.waterRequirement === 'tinggi') {
        score -= 0.25;
        contextFactors.push('Sistem penghematan air sangat diperlukan.');
      }
    }

    // Space Optimization (Rule 2)
    if (area < 3 && type === 'taman vertikal') {
      score += 0.3;
      contextFactors.push('Sangat direkomendasikan karena lahan Anda termasuk kategori sempit.');
    }

    // Budget Compatibility
    if (budget === 'rendah' && (type === 'sistem hidroponik' || type === 'kolam ikan')) {
      score -= 0.15;
      contextFactors.push('Pertimbangkan biaya awal untuk instalasi sistem.');
    }

    const reason = contextFactors.length > 0 
      ? contextFactors.join(' ') 
      : 'Pilihan yang sesuai dengan profil lahan Anda.';

    recommendations.push({
      type,
      reason,
      confidence: Math.min(Math.max(score, 0.1), 0.99),
    });
  });

  return recommendations.sort((a, b) => b.confidence - a.confidence);
};
