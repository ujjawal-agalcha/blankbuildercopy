/**
 * GARMENT SPECIFICATION: 116. Maxi Dress
 * ID: clothing_dress_maxi
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


const base = createTShirtTemplate('clothing_dress_maxi', '116. Maxi Dress', 'relaxed' as any, 'Flowing ankle-length column dress.', {
  chestWidth: 520,
  bodyLength: 1350,
  shoulderWidth: 458,
  sleeveLength: 220,
  sleeveOpening: 182,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 520,
  collarHeight: 25,
});
base.modelId = 'tee-t5';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'clothing_dress_maxi',
  name: '116. Maxi Dress',
  fit: 'relaxed',
  modelId: 'tee-t5',
  categoryPath: 'dresses-skirts-and-other/maxi-dress',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
