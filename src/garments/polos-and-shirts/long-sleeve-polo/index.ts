/**
 * GARMENT SPECIFICATION: 24. Long-Sleeve Polo
 * ID: polo_long_sleeve
 * 3D Model: tee-longsleeve
 */

import { GarmentTemplate } from '../../../types/garment';
import {
  createTShirtTemplate,
  createTankTemplate,
  createLongSleeveTShirtTemplate,
  createPocketTShirtTemplate,
  createRingerTShirtTemplate,
} from '../../templates/tshirt';
import {
  createHoodieTemplate,
  createZipUpHoodieTemplate,
  createSweatshirtTemplate,
  createJacketTemplate,
} from '../../templates/hoodie';
import {
  createPantsTemplate,
  createJeansTemplate,
  createCargoPantsTemplate,
} from '../../templates/pants';
import { createPoloTemplate } from '../../templates/polo';
import { createShirtTemplate } from '../../templates/shirt';


export const garment: GarmentTemplate = createLongSleeveTShirtTemplate('polo_long_sleeve', '24. Long-Sleeve Polo', 'regular' as any, 'Turn-down collar with ribbed cuffs and extended sleeve length.');


export const metadata = {
  id: 'polo_long_sleeve',
  name: '24. Long-Sleeve Polo',
  fit: 'regular',
  modelId: 'tee-longsleeve',
  categoryPath: 'polos-and-shirts/long-sleeve-polo',
};

export const modelConfig = {
  modelId: 'tee-longsleeve',
  modelBinary: '/models/tee-longsleeve/model.bin',
  normalMap: '/models/tee-longsleeve/normal.jpg',
};

export default garment;
