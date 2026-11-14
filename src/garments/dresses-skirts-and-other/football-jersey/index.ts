/**
 * GARMENT SPECIFICATION: 127. Football Jersey
 * ID: clothing_football_jersey
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


const base = createTShirtTemplate('clothing_football_jersey', '127. Football Jersey', 'oversized' as any, 'Drop-shoulder reinforced yoke jersey for pads.', {
  chestWidth: 620,
  bodyLength: 770,
  shoulderWidth: 546,
  sleeveLength: 260,
  sleeveOpening: 217,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 620,
  collarHeight: 25,
});
base.modelId = 'tee-oversize-1';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'clothing_football_jersey',
  name: '127. Football Jersey',
  fit: 'oversized',
  modelId: 'tee-oversize-1',
  categoryPath: 'dresses-skirts-and-other/football-jersey',
};

export const modelConfig = {
  modelId: 'tee-oversize-1',
  modelBinary: '/models/tee-oversize-1/model.bin',
  normalMap: '/models/tee-oversize-1/normal.jpg',
};

export default garment;
