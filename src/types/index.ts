export type ProjectType = 'kolam ikan' | 'kebun sayur' | 'sistem hidroponik' | 'taman vertikal' | 'kebun herbal';

export interface UserInput {
  panjang: number; // dalam meter
  lebar: number; // dalam meter
  lokasi: string;
  budget?: 'rendah' | 'menengah' | 'tinggi';
  tujuan?: string;
  pengalaman?: 'pemula' | 'menengah' | 'ahli';
  sinarMatahari?: 'rendah' | 'sedang' | 'tinggi';
  ketersediaanAir?: 'terbatas' | 'cukup' | 'melimpah';
  kondisiTanah?: 'subur' | 'tandus' | 'berbatu';
  drainase?: 'buruk' | 'baik' | 'sangat baik';
  aksesListrik?: boolean;
}

export type AnalysisMode = 'General' | 'Assisted' | 'Optimized';

export interface Recommendation {
  type: ProjectType;
  reason: string;
  confidence: number;
}

export interface ProjectParameters {
  area: number;
  dimensions?: {
    length: number;
    width: number;
  };
  capacity?: number;
  density?: number;
  requirements?: {
    water: string;
    sunlight: string;
    soil?: number;
  };
  details: Record<string, any>;
}

export interface Material {
  name: string;
  price: number;
  unit: string;
}

export interface CostEstimation {
  low: number;
  medium: number;
  high: number;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    estimatedPrice: number;
  }>;
}

export interface MaintenanceInfo {
  difficulty: 'mudah' | 'sedang' | 'sulit';
  hoursPerWeek: number;
  activities: string[];
}

export interface FeasibilityResult {
  score: number;
  status: 'sangat layak' | 'layak' | 'menantang' | 'tidak direkomendasikan';
  warnings: string[];
  breakdown: {
    space: number;
    environment: number;
    budget: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface RegisteredUser {
  identifier: string; // Bisa username atau email
  name: string;
  password: string;
}

export interface ProjectResult {
  id: string;
  input: UserInput;
  type: ProjectType;
  parameters: ProjectParameters;
  feasibility: FeasibilityResult;
  cost: CostEstimation;
  maintenance: MaintenanceInfo;
  createdAt: string;
}
