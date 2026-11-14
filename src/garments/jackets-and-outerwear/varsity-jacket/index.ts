/**
 * GARMENT SPECIFICATION: 52. Varsity Jacket
 * ID: jacket_varsity
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


export const garment: GarmentTemplate = createJacketTemplate('jacket_varsity', '52. Varsity Jacket', 'oversized' as any, 'Wool body, contrast sleeves, striped ribbing, and snap front.');


export const metadata = {
  id: 'jacket_varsity',
  name: '52. Varsity Jacket',
  fit: 'oversized',
  modelId: 'hoodie-body',
  categoryPath: 'jackets-and-outerwear/varsity-jacket',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
