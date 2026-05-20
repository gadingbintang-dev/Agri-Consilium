import { CostEstimation, ProjectParameters, UserInput } from '@/types';
import materialsData from '@/data/materials.json';

const materials = materialsData as Record<string, any>;

export const calculateCostEstimation = (
  type: string,
  params: ProjectParameters,
  input: UserInput
): CostEstimation => {
  const items: CostEstimation['items'] = [];
  let totalBase = 0;

  const addItem = (id: string, qty: number) => {
    const mat = materials[id];
    if (mat) {
      const estimatedPrice = mat.price * qty;
      items.push({
        name: mat.name,
        quantity: Math.ceil(qty),
        unit: mat.unit,
        estimatedPrice,
      });
      totalBase += estimatedPrice;
    }
  };

  const capacity = params.capacity || 0;
  const area = params.area;

  switch (type) {
    case 'kolam ikan':
      addItem('terpal_kolam', 1);
      addItem('pompa_celup', 1);
      addItem('benih_ikan_lele', capacity);
      addItem('pakan_ikan', Math.ceil(capacity / 20)); // assumption: 1kg per 20 fish
      break;

    case 'kebun sayur':
      addItem('tanah_lembang', Math.ceil(area * 5)); // 5 sacks per m2
      addItem('pupuk_organik', Math.ceil(area * 2));
      addItem('benih_sayur', Math.ceil(params.details.bedCount || 1));
      addItem('planter_bag', capacity);
      break;

    case 'sistem hidroponik':
      addItem('pipa_pvc_3', params.details.pipeCount || 1);
      addItem('pompa_celup', 1);
      addItem('netpot', capacity);
      addItem('nutrisi_ab_mix', Math.ceil(capacity / 50) + 1);
      addItem('rangka_baja_ringan', Math.ceil((params.details.pipeCount || 1) / 2) + 1);
      break;

    case 'taman vertikal':
      addItem('planter_bag', capacity);
      addItem('tanah_lembang', Math.ceil(capacity / 3));
      addItem('pupuk_organik', Math.ceil(capacity / 10));
      addItem('benih_sayur', 5);
      break;

    case 'kebun herbal':
      addItem('planter_bag', capacity);
      addItem('tanah_lembang', Math.ceil(area * 2));
      addItem('benih_sayur', 3);
      break;
  }

  // Multiply based on budget level for quality variations
  const budgetMultiplier = input.budget === 'tinggi' ? 1.5 : input.budget === 'rendah' ? 0.8 : 1;

  return {
    low: Math.floor(totalBase * 0.85),
    medium: Math.floor(totalBase),
    high: Math.floor(totalBase * 1.4),
    items: items.map(item => ({
      ...item,
      estimatedPrice: Math.floor(item.estimatedPrice * budgetMultiplier)
    })),
  };
};

export const generateMarketplaceLinks = (itemName: string) => {
  const query = encodeURIComponent(itemName);
  return {
    tokopedia: `https://www.tokopedia.com/search?st=product&q=${query}`,
    shopee: `https://shopee.co.id/search?keyword=${query}`,
  };
};
