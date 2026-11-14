/**
 * GARMENT SPECIFICATION: 129. Scrub Top
 * ID: clothing_scrub_top
 * 3D Model: tee-t5
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


const base = createTShirtTemplate('clothing_scrub_top', '129. Scrub Top', 'regular' as any, 'Medical V-neck top with twin chest and waist pockets.', {
  chestWidth: 540,
  bodyLength: 720,
  shoulderWidth: 475,
  sleeveLength: 220,
  sleeveOpening: 189,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 540,
  collarHeight: 25,
});
base.modelId = 'tee-t5';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'clothing_scrub_top',
  name: '129. Scrub Top',
  fit: 'regular',
  modelId: 'tee-t5',
  categoryPath: 'dresses-skirts-and-other/scrub-top',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
