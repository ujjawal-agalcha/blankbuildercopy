/**
 * GARMENT SPECIFICATION: 74. Stringer Tank
 * ID: tank_stringer
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


export const garment: GarmentTemplate = createTankTemplate('tank_stringer', '74. Stringer Tank', 'slim' as any, 'Deep cut sides with narrow shoulder straps for bodybuilding.');


export const metadata = {
  id: 'tank_stringer',
  name: '74. Stringer Tank',
  fit: 'slim',
  modelId: 'tee-t5',
  categoryPath: 'tank-tops/stringer-tank',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
