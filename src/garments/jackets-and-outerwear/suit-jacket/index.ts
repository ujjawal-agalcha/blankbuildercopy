/**
 * GARMENT SPECIFICATION: 65. Suit Jacket
 * ID: jacket_suit_jacket
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


export const garment: GarmentTemplate = createJacketTemplate('jacket_suit_jacket', '65. Suit Jacket', 'slim' as any, 'Tailored suit jacket with peak lapels and horn buttons.');


export const metadata = {
  id: 'jacket_suit_jacket',
  name: '65. Suit Jacket',
  fit: 'slim',
  modelId: 'hoodie-body',
  categoryPath: 'jackets-and-outerwear/suit-jacket',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
