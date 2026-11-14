/**
 * GARMENT SPECIFICATION: 113. Maxi Skirt
 * ID: clothing_skirt_maxi
 * 3D Model: moto-pants
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


export const garment: GarmentTemplate = createPantsTemplate('clothing_skirt_maxi', '113. Maxi Skirt', 'relaxed' as any, 'Full-length floor-grazing draped skirt.');


export const metadata = {
  id: 'clothing_skirt_maxi',
  name: '113. Maxi Skirt',
  fit: 'relaxed',
  modelId: 'moto-pants',
  categoryPath: 'dresses-skirts-and-other/maxi-skirt',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
