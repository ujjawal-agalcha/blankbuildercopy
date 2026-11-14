/**
 * GARMENT SPECIFICATION: 44. Drop Shoulder Hoodie
 * ID: hoodie_drop_shoulder
 * 3D Model: hoodie
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


const base = createHoodieTemplate('hoodie_drop_shoulder', '44. Drop Shoulder Hoodie', 'drop-shoulder' as any, 'Extended shoulder seam for effortless street silhouette.');
base.modelId = 'hoodie';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'hoodie_drop_shoulder',
  name: '44. Drop Shoulder Hoodie',
  fit: 'drop-shoulder',
  modelId: 'hoodie',
  categoryPath: 'hoodies-and-sweats/drop-shoulder-hoodie',
};

export const modelConfig = {
  modelId: 'hoodie',
  modelBinary: '/models/hoodie/model.bin',
  normalMap: '/models/hoodie/normal.jpg',
};

export default garment;
