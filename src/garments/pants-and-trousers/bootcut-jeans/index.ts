/**
 * GARMENT SPECIFICATION: 85. Bootcut Jeans
 * ID: pants_bootcut_jeans
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


export const garment: GarmentTemplate = createJeansTemplate('pants_bootcut_jeans', '85. Bootcut Jeans', 'straight' as any, 'Slight flare below knee to accommodate footwear.');


export const metadata = {
  id: 'pants_bootcut_jeans',
  name: '85. Bootcut Jeans',
  fit: 'straight',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/bootcut-jeans',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
