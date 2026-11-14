/**
 * GARMENT SPECIFICATION: 72. Racerback Tank
 * ID: tank_racerback
 * 3D Model: tee-t5
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


export const garment: GarmentTemplate = createTankTemplate('tank_racerback', '72. Racerback Tank', 'slim' as any, 'Tapered T-back back panel for shoulder blade mobility.');


export const metadata = {
  id: 'tank_racerback',
  name: '72. Racerback Tank',
  fit: 'slim',
  modelId: 'tee-t5',
  categoryPath: 'tank-tops/racerback-tank',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
