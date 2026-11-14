/**
 * GARMENT SPECIFICATION: 69. Softshell Jacket
 * ID: jacket_softshell
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


export const garment: GarmentTemplate = createJacketTemplate('jacket_softshell', '69. Softshell Jacket', 'regular' as any, 'Weather-resistant stretch bonded membrane jacket.');


export const metadata = {
  id: 'jacket_softshell',
  name: '69. Softshell Jacket',
  fit: 'regular',
  modelId: 'hoodie-body',
  categoryPath: 'jackets-and-outerwear/softshell-jacket',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
