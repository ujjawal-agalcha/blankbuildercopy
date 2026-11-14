/**
 * GARMENT SPECIFICATION: 99. Basketball Shorts
 * ID: shorts_basketball
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


export const garment: GarmentTemplate = createPantsTemplate('shorts_basketball', '99. Basketball Shorts', 'baggy' as any, 'Breathable double-layer mesh with striped knit waistband.');


export const metadata = {
  id: 'shorts_basketball',
  name: '99. Basketball Shorts',
  fit: 'baggy',
  modelId: 'moto-pants',
  categoryPath: 'shorts/basketball-shorts',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
