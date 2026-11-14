/**
 * GARMENT SPECIFICATION: 38. Zip-Up Hoodie
 * ID: hoodie_zip_up
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


export const garment: GarmentTemplate = createZipUpHoodieTemplate('hoodie_zip_up', '38. Zip-Up Hoodie', 'regular' as any, 'Full-length metal center front zipper with split kangaroo pockets.');


export const metadata = {
  id: 'hoodie_zip_up',
  name: '38. Zip-Up Hoodie',
  fit: 'regular',
  modelId: 'hoodie-body',
  categoryPath: 'hoodies-and-sweats/zip-up-hoodie',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
