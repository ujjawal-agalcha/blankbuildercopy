/**
 * GARMENT SPECIFICATION: 118. Bodycon Dress
 * ID: clothing_dress_bodycon
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


const base = createTShirtTemplate('clothing_dress_bodycon', '118. Bodycon Dress', 'slim' as any, 'Form-fitting stretch rib midi dress.', {
  chestWidth: 440,
  bodyLength: 1050,
  shoulderWidth: 387,
  sleeveLength: 200,
  sleeveOpening: 154,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 440,
  collarHeight: 25,
});
base.modelId = 'tee-t5';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'clothing_dress_bodycon',
  name: '118. Bodycon Dress',
  fit: 'slim',
  modelId: 'tee-t5',
  categoryPath: 'dresses-skirts-and-other/bodycon-dress',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
