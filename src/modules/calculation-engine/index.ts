import { ProjectParameters, UserInput } from '@/types';
import engineConfig from '@/data/engine-config.json';

export const calculateProjectParameters = (
  type: string,
  input: UserInput
): ProjectParameters => {
  const { panjang, lebar } = input;
  const area = panjang * lebar;
  const config = (engineConfig.projectFormulas as any)[type];

  if (!config) {
    return { 
      area, 
      details: {},
      requirements: { water: 'sedang', sunlight: 'sedang' }
    };
  }

  const baseParams: ProjectParameters = {
    area,
    dimensions: { length: panjang, width: lebar },
    requirements: {
      water: config.waterRequirement,
      sunlight: config.minSunlight,
    },
    details: {},
  };

  // Smart Scaling & Parameter Generation
  switch (type) {
    case 'kolam ikan': {
      const depth = config.defaultDepth;
      let fishPerM2 = config.fishPerM2;
      
      // Scale fish density based on area (larger area can be slightly more efficient)
      if (area > config.scalingFactors.largeAreaThreshold) {
        fishPerM2 = Math.min(
          fishPerM2 * config.scalingFactors.efficiencyBoost,
          engineConfig.validationLimits.maxFishPerM2
        );
      }

      baseParams.capacity = Math.floor(area * fishPerM2);
      baseParams.details = {
        depth,
        volume: area * depth,
        fishPerM2: Math.round(fishPerM2),
      };
      break;
    }

    case 'kebun sayur': {
      const plantDensity = config.plantDensity;
      baseParams.capacity = Math.floor(area * plantDensity);
      baseParams.details = {
        bedCount: Math.floor(area / config.bedSize),
        soilDepth: config.soilDepth,
        totalSoilVolume: area * config.soilDepth,
      };
      break;
    }

    case 'sistem hidroponik': {
      const pipeSpacing = config.pipeSpacing;
      const pipeCount = Math.floor(lebar / pipeSpacing);
      const holesPerMeter = 1 / config.holeSpacing;
      const totalHoles = Math.floor(panjang * holesPerMeter * pipeCount);

      baseParams.capacity = totalHoles;
      baseParams.details = {
        pipeLength: panjang,
        pipeCount,
        reservoirCapacity: pipeCount * config.litersPerPipe,
      };
      break;
    }

    case 'taman vertikal': {
      const wallHeight = config.defaultWallHeight;
      const verticalArea = panjang * wallHeight;
      baseParams.area = verticalArea; // Override with vertical area
      baseParams.capacity = Math.floor(verticalArea * config.potsPerM2);
      baseParams.details = {
        wallHeight,
        potsPerM2: config.potsPerM2,
      };
      break;
    }

    case 'kebun herbal': {
      baseParams.capacity = Math.floor(area * config.potsPerM2);
      baseParams.details = {
        soilDepth: config.soilDepth,
        totalSoilVolume: area * config.soilDepth,
      };
      break;
    }
  }

  // Validation
  if (baseParams.area < engineConfig.validationLimits.minArea) {
    baseParams.capacity = 0;
  }

  return baseParams;
};
