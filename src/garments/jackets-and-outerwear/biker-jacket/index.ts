/**
 * GARMENT SPECIFICATION: 55. Biker Jacket
 * ID: jacket_biker
 * 3D Model: hoodie-body
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


export const garment: GarmentTemplate = createJacketTemplate('jacket_biker', '55. Biker Jacket', 'slim' as any, 'Asymmetric zipper, wide notch lapels, and coin flap pocket.');


export const metadata = {
  id: 'jacket_biker',
  name: '55. Biker Jacket',
  fit: 'slim',
  modelId: 'hoodie-body',
  categoryPath: 'jackets-and-outerwear/biker-jacket',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
