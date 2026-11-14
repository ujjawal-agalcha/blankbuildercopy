/**
 * GARMENT SPECIFICATION: 45. Classic Sweatshirt
 * ID: sweatshirt_classic
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


export const garment: GarmentTemplate = createSweatshirtTemplate('sweatshirt_classic', '45. Classic Sweatshirt', 'regular' as any, 'Crewneck fleece sweater with ribbed triangular V-insert at neck.');


export const metadata = {
  id: 'sweatshirt_classic',
  name: '45. Classic Sweatshirt',
  fit: 'regular',
  modelId: 'hoodie-flat',
  categoryPath: 'hoodies-and-sweats/classic-sweatshirt',
};

export const modelConfig = {
  modelId: 'hoodie-flat',
  modelBinary: '/models/hoodie-flat/model.bin',
  normalMap: '/models/hoodie-flat/normal.jpg',
};

export default garment;
