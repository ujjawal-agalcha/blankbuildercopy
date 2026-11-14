/**
 * GARMENT SPECIFICATION: 130. Scrub Pants
 * ID: clothing_scrub_pants
 * 3D Model: moto-pants
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


export const garment: GarmentTemplate = createPantsTemplate('clothing_scrub_pants', '130. Scrub Pants', 'regular' as any, 'Straight-leg medical pants with cargo pocket and drawstring.');


export const metadata = {
  id: 'clothing_scrub_pants',
  name: '130. Scrub Pants',
  fit: 'regular',
  modelId: 'moto-pants',
  categoryPath: 'dresses-skirts-and-other/scrub-pants',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
