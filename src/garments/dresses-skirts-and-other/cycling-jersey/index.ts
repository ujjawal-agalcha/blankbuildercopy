/**
 * GARMENT SPECIFICATION: 128. Cycling Jersey
 * ID: clothing_cycling_jersey
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


const base = createTShirtTemplate('clothing_cycling_jersey', '128. Cycling Jersey', 'slim' as any, 'Form-fitting aerodynamic top with 3 rear pockets.', {
  chestWidth: 460,
  bodyLength: 680,
  shoulderWidth: 405,
  sleeveLength: 210,
  sleeveOpening: 161,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 460,
  collarHeight: 25,
});
base.modelId = 'tee-t5';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'clothing_cycling_jersey',
  name: '128. Cycling Jersey',
  fit: 'slim',
  modelId: 'tee-t5',
  categoryPath: 'dresses-skirts-and-other/cycling-jersey',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
