/**
 * GARMENT SPECIFICATION: 12. Crew Neck T-Shirt
 * ID: tshirt_crew_neck
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


const base = createTShirtTemplate('tshirt_crew_neck', '12. Crew Neck T-Shirt', 'regular' as any, 'Timeless ribbed round collar with double-needle neck tape.', {
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
  id: 'tshirt_crew_neck',
  name: '12. Crew Neck T-Shirt',
  fit: 'regular',
  modelId: 'tee-t5',
  categoryPath: 't-shirts/crew-neck',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
