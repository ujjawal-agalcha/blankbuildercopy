/**
 * GARMENT SPECIFICATION: 25. Rugby Shirt
 * ID: polo_rugby
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


const base = createPoloTemplate('polo_rugby', '25. Rugby Shirt', 'oversized' as any, 'Heavyweight contrast white twill collar with rubber buttons.');
base.modelId = 'polo';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'polo_rugby',
  name: '25. Rugby Shirt',
  fit: 'oversized',
  modelId: 'polo',
  categoryPath: 'polos-and-shirts/rugby-shirt',
};

export const modelConfig = {
  modelId: 'polo',
  modelBinary: '/models/polo/model.bin',
  normalMap: '/models/polo/normal.jpg',
};

export default garment;
