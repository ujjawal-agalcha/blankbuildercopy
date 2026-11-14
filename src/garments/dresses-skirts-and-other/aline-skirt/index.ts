/**
 * GARMENT SPECIFICATION: 112. A-Line Skirt
 * ID: clothing_skirt_aline
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


export const garment: GarmentTemplate = createPantsTemplate('clothing_skirt_aline', '112. A-Line Skirt', 'regular' as any, 'Classic flared A-silhouette hitting at the knee.');


export const metadata = {
  id: 'clothing_skirt_aline',
  name: '112. A-Line Skirt',
  fit: 'regular',
  modelId: 'moto-pants',
  categoryPath: 'dresses-skirts-and-other/aline-skirt',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
