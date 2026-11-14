/**
 * GARMENT SPECIFICATION: 13. Scoop Neck T-Shirt
 * ID: tshirt_scoop_neck
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


const base = createTShirtTemplate('tshirt_scoop_neck', '13. Scoop Neck T-Shirt', 'relaxed' as any, 'Wide rounded neck opening framing the collarbones.', {
  chestWidth: 530,
  bodyLength: 710,
  shoulderWidth: 466,
  sleeveLength: 210,
  sleeveOpening: 186,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 530,
  collarHeight: 25,
});
base.modelId = 'tee-t5';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'tshirt_scoop_neck',
  name: '13. Scoop Neck T-Shirt',
  fit: 'relaxed',
  modelId: 'tee-t5',
  categoryPath: 't-shirts/scoop-neck',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
