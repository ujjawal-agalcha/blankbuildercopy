/**
 * GARMENT SPECIFICATION: 47. Crewneck Sweatshirt
 * ID: sweatshirt_crewneck
 * 3D Model: hoodie-flat
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


export const garment: GarmentTemplate = createSweatshirtTemplate('sweatshirt_crewneck', '47. Crewneck Sweatshirt', 'regular' as any, 'Ribbed collar, cuffs, and hem in durable 380 GSM loopback.');


export const metadata = {
  id: 'sweatshirt_crewneck',
  name: '47. Crewneck Sweatshirt',
  fit: 'regular',
  modelId: 'hoodie-flat',
  categoryPath: 'hoodies-and-sweats/crewneck-sweatshirt',
};

export const modelConfig = {
  modelId: 'hoodie-flat',
  modelBinary: '/models/hoodie-flat/model.bin',
  normalMap: '/models/hoodie-flat/normal.jpg',
};

export default garment;
