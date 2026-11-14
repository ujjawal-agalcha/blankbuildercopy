/**
 * GARMENT SPECIFICATION: 110. Skirts
 * ID: clothing_skirt_basic
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


export const garment: GarmentTemplate = createPantsTemplate('clothing_skirt_basic', '110. Skirts', 'regular' as any, 'Clean A-line cut skirt with concealed side zipper.');


export const metadata = {
  id: 'clothing_skirt_basic',
  name: '110. Skirts',
  fit: 'regular',
  modelId: 'moto-pants',
  categoryPath: 'dresses-skirts-and-other/skirts-basic',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
