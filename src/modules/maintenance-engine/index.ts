import { MaintenanceInfo, ProjectParameters } from '@/types';

export const getMaintenanceEstimation = (type: string, params: ProjectParameters): MaintenanceInfo => {
  const area = params.area;
  const areaFactor = Math.max(1, area / 5); // Base scale 5m2

  switch (type) {
    case 'kolam ikan':
      return {
        difficulty: 'sedang',
        hoursPerWeek: Math.round(4 * areaFactor),
        activities: [
          'Memberi makan ikan 2x sehari',
          'Pembersihan filter mingguan',
          'Pengecekan kualitas air',
          'Penggantian air sebagian (20%) setiap 2 minggu',
        ],
      };

    case 'kebun sayur':
      return {
        difficulty: 'mudah',
        hoursPerWeek: Math.round(3 * areaFactor),
        activities: [
          'Penyiraman pagi dan sore',
          'Penyiangan gulma seminggu sekali',
          'Pemupukan rutin setiap 2 minggu',
          'Pengecekan hama secara berkala',
        ],
      };

    case 'sistem hidroponik':
      return {
        difficulty: 'sedang',
        hoursPerWeek: Math.round(2 * areaFactor),
        activities: [
          'Pengecekan nutrisi (TDS/EC) setiap hari',
          'Pengecekan pH air',
          'Pembersihan lumut pada pipa',
          'Pengisian ulang tandon air nutrisi',
        ],
      };

    case 'taman vertikal':
      return {
        difficulty: 'sedang',
        hoursPerWeek: Math.round(3 * areaFactor),
        activities: [
          'Penyiraman rutin (disarankan sistem otomatis)',
          'Pemangkasan tanaman yang terlalu rimbun',
          'Pemupukan cair bulanan',
          'Pengecekan kebocoran sistem irigasi',
        ],
      };

    case 'kebun herbal':
      return {
        difficulty: 'mudah',
        hoursPerWeek: Math.round(1.5 * areaFactor),
        activities: [
          'Penyiraman secukupnya',
          'Pemangkasan untuk merangsang pertumbuhan',
          'Pemindahan pot jika sudah terlalu besar',
          'Pemberian pupuk organik ringan',
        ],
      };

    default:
      return {
        difficulty: 'mudah',
        hoursPerWeek: Math.round(1 * areaFactor),
        activities: ['Perawatan umum', 'Penyiraman berkala'],
      };
  }
};
