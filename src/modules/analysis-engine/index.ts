import { AnalysisMode, FeasibilityResult, UserInput } from '@/types';
import projectsData from '@/data/projects.json';
import engineConfig from '@/data/engine-config.json';

const projects = projectsData as Record<string, any>;

export const detectAnalysisMode = (input: UserInput): AnalysisMode => {
  const optionalFields = [
    'budget',
    'tujuan',
    'pengalaman',
    'sinarMatahari',
    'ketersediaanAir',
    'kondisiTanah',
    'drainase',
    'aksesListrik',
  ];

  const filledOptional = optionalFields.filter((field) => !!(input as any)[field]).length;

  if (filledOptional === 0) return 'General';
  if (filledOptional <= 4) return 'Assisted';
  return 'Optimized';
};

export const calculateFeasibility = (
  type: string,
  input: UserInput
): FeasibilityResult => {
  const project = projects[type];
  const { panjang, lebar, sinarMatahari, ketersediaanAir, budget } = input;
  const area = panjang * lebar;
  const weights = engineConfig.feasibilityWeights;
  
  const warnings: string[] = [];
  const breakdown = {
    space: 100,
    environment: 100,
    budget: 100,
  };

  // 1. Space Feasibility (30%)
  if (area < project.minArea) {
    breakdown.space = 0;
    warnings.push('Lahan terlalu kecil untuk proyek ini.');
  } else if (area < project.minArea * 1.5) {
    breakdown.space = 60;
    warnings.push('Lahan cukup pas-pasan, perlu optimasi tata letak.');
  }

  // 2. Environmental Feasibility (50% combined)
  let envScore = 100;
  
  // Sunlight (25%)
  if (sinarMatahari) {
    if (project.recommendedSunlight === 'tinggi' && sinarMatahari === 'rendah') {
      envScore -= 60;
      warnings.push('Paparan cahaya matahari sangat rendah untuk jenis tanaman ini.');
    } else if (project.recommendedSunlight === 'tinggi' && sinarMatahari === 'sedang') {
      envScore -= 20;
    } else if (project.recommendedSunlight === 'sedang' && sinarMatahari === 'rendah') {
      envScore -= 30;
    }
  } else {
    envScore -= 20; // Penalty for unknown data
  }

  // Water (25%)
  if (ketersediaanAir) {
    if (project.waterRequirement === 'tinggi' && ketersediaanAir === 'terbatas') {
      envScore -= 50;
      warnings.push('Sumber air terbatas untuk kebutuhan proyek yang tinggi.');
    } else if (project.waterRequirement === 'tinggi' && ketersediaanAir === 'cukup') {
      envScore -= 10;
    }
  } else {
    envScore -= 15;
  }
  
  breakdown.environment = Math.max(0, envScore);

  // 3. Budget Feasibility (20%)
  let budgetScore = 100;
  if (budget === 'rendah') {
    if (type === 'sistem hidroponik' || type === 'kolam ikan') {
      budgetScore = 40;
      warnings.push('Anggaran rendah mungkin membatasi kualitas peralatan sistem.');
    } else {
      budgetScore = 80;
    }
  } else if (!budget) {
    budgetScore = 70;
  }
  breakdown.budget = budgetScore;

  // Weighted Final Score
  const finalScore = Math.round(
    (breakdown.space * weights.areaMatch) +
    (breakdown.environment * (weights.sunlightMatch + weights.waterMatch)) +
    (breakdown.budget * weights.budgetMatch)
  );

  let status: FeasibilityResult['status'] = 'layak';
  if (finalScore >= 85) status = 'sangat layak';
  else if (finalScore < 40) status = 'tidak direkomendasikan';
  else if (finalScore < 65) status = 'menantang';

  return {
    score: finalScore,
    status,
    warnings,
    breakdown,
  };
};
