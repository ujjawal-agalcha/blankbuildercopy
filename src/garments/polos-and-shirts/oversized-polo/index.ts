/**
 * GARMENT SPECIFICATION: 22. Oversized Polo
 * ID: polo_oversized
 * 3D Model: polo
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


const base = createPoloTemplate('polo_oversized', '22. Oversized Polo', 'oversized' as any, 'Streetwear draped polo with dropped shoulders and roomy sleeves.');
base.modelId = 'polo';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'polo_oversized',
  name: '22. Oversized Polo',
  fit: 'oversized',
  modelId: 'polo',
  categoryPath: 'polos-and-shirts/oversized-polo',
};

export const modelConfig = {
  modelId: 'polo',
  modelBinary: '/models/polo/model.bin',
  normalMap: '/models/polo/normal.jpg',
};

export default garment;
