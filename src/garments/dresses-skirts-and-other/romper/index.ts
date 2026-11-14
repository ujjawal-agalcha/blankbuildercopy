/**
 * GARMENT SPECIFICATION: 121. Romper
 * ID: clothing_romper
 * 3D Model: hoodie-body
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


export const garment: GarmentTemplate = createJacketTemplate('clothing_romper', '121. Romper', 'regular' as any, 'One-piece short jumpsuit with elastic drawstring waist.');


export const metadata = {
  id: 'clothing_romper',
  name: '121. Romper',
  fit: 'regular',
  modelId: 'hoodie-body',
  categoryPath: 'dresses-skirts-and-other/romper',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
