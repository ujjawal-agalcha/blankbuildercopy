/**
 * GARMENT SPECIFICATION: 125. Sports Jersey
 * ID: clothing_sports_jersey
 * 3D Model: tee-oversize-1
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


const base = createTShirtTemplate('clothing_sports_jersey', '125. Sports Jersey', 'oversized' as any, 'V-neck mesh athletic jersey with sleeve banding.', {
  chestWidth: 600,
  bodyLength: 760,
  shoulderWidth: 528,
  sleeveLength: 250,
  sleeveOpening: 210,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 600,
  collarHeight: 25,
});
base.modelId = 'tee-oversize-1';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'clothing_sports_jersey',
  name: '125. Sports Jersey',
  fit: 'oversized',
  modelId: 'tee-oversize-1',
  categoryPath: 'dresses-skirts-and-other/sports-jersey',
};

export const modelConfig = {
  modelId: 'tee-oversize-1',
  modelBinary: '/models/tee-oversize-1/model.bin',
  normalMap: '/models/tee-oversize-1/normal.jpg',
};

export default garment;
