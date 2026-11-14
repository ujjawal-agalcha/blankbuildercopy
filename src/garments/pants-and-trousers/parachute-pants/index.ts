/**
 * GARMENT SPECIFICATION: 88. Parachute Pants
 * ID: pants_parachute
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


export const garment: GarmentTemplate = createCargoPantsTemplate('pants_parachute', '88. Parachute Pants', 'baggy' as any, 'Voluminous nylon with bungee hem cinches.');


export const metadata = {
  id: 'pants_parachute',
  name: '88. Parachute Pants',
  fit: 'baggy',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/parachute-pants',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
