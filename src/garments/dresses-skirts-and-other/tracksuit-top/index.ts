/**
 * GARMENT SPECIFICATION: 123. Tracksuit Top
 * ID: clothing_tracksuit_top
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


export const garment: GarmentTemplate = createJacketTemplate('clothing_tracksuit_top', '123. Tracksuit Top', 'regular' as any, 'Zip-front track jacket with contrast arm panels.');


export const metadata = {
  id: 'clothing_tracksuit_top',
  name: '123. Tracksuit Top',
  fit: 'regular',
  modelId: 'hoodie-body',
  categoryPath: 'dresses-skirts-and-other/tracksuit-top',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
