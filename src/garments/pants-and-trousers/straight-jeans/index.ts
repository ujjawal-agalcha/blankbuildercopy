/**
 * GARMENT SPECIFICATION: 79. Straight Fit Jeans
 * ID: pants_straight_jeans
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


export const garment: GarmentTemplate = createJeansTemplate('pants_straight_jeans', '79. Straight Fit Jeans', 'straight' as any, '5-pocket classic straight leg cut in 13.5 oz denim with back yokes.');


export const metadata = {
  id: 'pants_straight_jeans',
  name: '79. Straight Fit Jeans',
  fit: 'straight',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/straight-jeans',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
