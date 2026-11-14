/**
 * GARMENT SPECIFICATION: 21. Classic Polo
 * ID: polo_classic
 * 3D Model: polo
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


const base = createPoloTemplate('polo_classic', '21. Classic Polo', 'regular' as any, 'Piqué knit polo with 2-button placket and flat knit collar.');
base.modelId = 'polo';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'polo_classic',
  name: '21. Classic Polo',
  fit: 'regular',
  modelId: 'polo',
  categoryPath: 'polos-and-shirts/classic-polo',
};

export const modelConfig = {
  modelId: 'polo',
  modelBinary: '/models/polo/model.bin',
  normalMap: '/models/polo/normal.jpg',
};

export default garment;
