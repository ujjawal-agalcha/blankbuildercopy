/**
 * GARMENT SPECIFICATION: 23. Slim Polo
 * ID: polo_slim
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


const base = createPoloTemplate('polo_slim', '23. Slim Polo', 'slim' as any, 'Fitted athletic piqué polo with tapered waist.');
base.modelId = 'polo';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'polo_slim',
  name: '23. Slim Polo',
  fit: 'slim',
  modelId: 'polo',
  categoryPath: 'polos-and-shirts/slim-polo',
};

export const modelConfig = {
  modelId: 'polo',
  modelBinary: '/models/polo/model.bin',
  normalMap: '/models/polo/normal.jpg',
};

export default garment;
