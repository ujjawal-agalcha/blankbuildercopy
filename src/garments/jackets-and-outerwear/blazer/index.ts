/**
 * GARMENT SPECIFICATION: 64. Blazer
 * ID: jacket_blazer
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


export const garment: GarmentTemplate = createJacketTemplate('jacket_blazer', '64. Blazer', 'regular' as any, 'Structured 2-button blazer with patch pockets and chest welt.');


export const metadata = {
  id: 'jacket_blazer',
  name: '64. Blazer',
  fit: 'regular',
  modelId: 'hoodie-body',
  categoryPath: 'jackets-and-outerwear/blazer',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
