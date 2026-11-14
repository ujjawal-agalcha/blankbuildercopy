/**
 * GARMENT SPECIFICATION: 57. Windbreaker
 * ID: jacket_windbreaker
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


export const garment: GarmentTemplate = createJacketTemplate('jacket_windbreaker', '57. Windbreaker', 'relaxed' as any, 'Lightweight ripstop nylon with elastic toggle hem and hood.');


export const metadata = {
  id: 'jacket_windbreaker',
  name: '57. Windbreaker',
  fit: 'relaxed',
  modelId: 'hoodie-body',
  categoryPath: 'jackets-and-outerwear/windbreaker',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
