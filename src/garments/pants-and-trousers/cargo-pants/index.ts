/**
 * GARMENT SPECIFICATION: 87. Cargo Pants
 * ID: pants_cargo
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


export const garment: GarmentTemplate = createCargoPantsTemplate('pants_cargo', '87. Cargo Pants', 'relaxed' as any, 'Twin pleated side bellows cargo pockets and knee darts.');


export const metadata = {
  id: 'pants_cargo',
  name: '87. Cargo Pants',
  fit: 'relaxed',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/cargo-pants',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
