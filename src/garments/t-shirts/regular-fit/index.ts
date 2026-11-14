/**
 * GARMENT SPECIFICATION: 1. Regular Fit T-Shirt
 * ID: tshirt_regular
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


const base = createTShirtTemplate('tshirt_regular', '1. Regular Fit T-Shirt', 'regular' as any, 'Classic everyday regular-fit silhouette with ribbed crew collar and twin-needle hem.', {
  chestWidth: 530,
  bodyLength: 720,
  shoulderWidth: 466,
  sleeveLength: 220,
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
  id: 'tshirt_regular',
  name: '1. Regular Fit T-Shirt',
  fit: 'regular',
  modelId: 'tee-t5',
  categoryPath: 't-shirts/regular-fit',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
