/**
 * GARMENT SPECIFICATION: 111. Pleated Skirt
 * ID: clothing_skirt_pleated
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


export const garment: GarmentTemplate = createPantsTemplate('clothing_skirt_pleated', '111. Pleated Skirt', 'regular' as any, 'Uniform knife pleats with structured waistband.');


export const metadata = {
  id: 'clothing_skirt_pleated',
  name: '111. Pleated Skirt',
  fit: 'regular',
  modelId: 'moto-pants',
  categoryPath: 'dresses-skirts-and-other/pleated-skirt',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
