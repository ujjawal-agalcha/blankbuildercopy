/**
 * GARMENT SPECIFICATION: 27. Cuban Collar Shirt
 * ID: shirt_cuban_collar
 * 3D Model: shirt-short-sleeve
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


const base = createShirtTemplate('shirt_cuban_collar', '27. Cuban Collar Shirt', 'relaxed' as any, 'Open camp neckline with notch lapel and boxy torso.');
base.modelId = 'shirt-short-sleeve';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'shirt_cuban_collar',
  name: '27. Cuban Collar Shirt',
  fit: 'relaxed',
  modelId: 'shirt-short-sleeve',
  categoryPath: 'polos-and-shirts/cuban-collar-shirt',
};

export const modelConfig = {
  modelId: 'shirt-short-sleeve',
  modelBinary: '/models/shirt-short-sleeve/model.bin',
  normalMap: '/models/shirt-short-sleeve/normal.jpg',
};

export default garment;
