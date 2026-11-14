/**
 * GARMENT SPECIFICATION: 63. Overcoat
 * ID: jacket_overcoat
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


export const garment: GarmentTemplate = createJacketTemplate('jacket_overcoat', '63. Overcoat', 'regular' as any, 'Tailored wool topcoat with notched lapels and single vent.');


export const metadata = {
  id: 'jacket_overcoat',
  name: '63. Overcoat',
  fit: 'regular',
  modelId: 'hoodie-body',
  categoryPath: 'jackets-and-outerwear/overcoat',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
