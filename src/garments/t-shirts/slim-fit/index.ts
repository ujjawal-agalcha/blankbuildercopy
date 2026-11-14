/**
 * GARMENT SPECIFICATION: 5. Slim Fit T-Shirt
 * ID: tshirt_slim
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


const base = createTShirtTemplate('tshirt_slim', '5. Slim Fit T-Shirt', 'slim' as any, 'Tailored athletic silhouette contours chest and arms.', {
  chestWidth: 490,
  bodyLength: 710,
  shoulderWidth: 431,
  sleeveLength: 200,
  sleeveOpening: 172,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 490,
  collarHeight: 25,
});
base.modelId = 'tee-t5';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'tshirt_slim',
  name: '5. Slim Fit T-Shirt',
  fit: 'slim',
  modelId: 'tee-t5',
  categoryPath: 't-shirts/slim-fit',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
