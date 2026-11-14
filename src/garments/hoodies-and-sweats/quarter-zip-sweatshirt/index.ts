/**
 * GARMENT SPECIFICATION: 49. Quarter-Zip Sweatshirt
 * ID: sweatshirt_quarter_zip
 * 3D Model: hoodie-flat
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


export const garment: GarmentTemplate = createSweatshirtTemplate('sweatshirt_quarter_zip', '49. Quarter-Zip Sweatshirt', 'regular' as any, 'Cadet collar with front quarter zipper closure.');


export const metadata = {
  id: 'sweatshirt_quarter_zip',
  name: '49. Quarter-Zip Sweatshirt',
  fit: 'regular',
  modelId: 'hoodie-flat',
  categoryPath: 'hoodies-and-sweats/quarter-zip-sweatshirt',
};

export const modelConfig = {
  modelId: 'hoodie-flat',
  modelBinary: '/models/hoodie-flat/model.bin',
  normalMap: '/models/hoodie-flat/normal.jpg',
};

export default garment;
