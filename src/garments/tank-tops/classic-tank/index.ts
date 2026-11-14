/**
 * GARMENT SPECIFICATION: 71. Classic Tank Top
 * ID: tank_classic
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


export const garment: GarmentTemplate = createTankTemplate('tank_classic', '71. Classic Tank Top', 'regular' as any, 'U-neck collar with self-bound armholes and scoop neckline.');


export const metadata = {
  id: 'tank_classic',
  name: '71. Classic Tank Top',
  fit: 'regular',
  modelId: 'tee-t5',
  categoryPath: 'tank-tops/classic-tank',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
