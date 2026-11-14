/**
 * GARMENT SPECIFICATION: 120. Jumpsuit
 * ID: clothing_jumpsuit
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


export const garment: GarmentTemplate = createJacketTemplate('clothing_jumpsuit', '120. Jumpsuit', 'relaxed' as any, 'One-piece boiler suit with belted waist and zipper front.');


export const metadata = {
  id: 'clothing_jumpsuit',
  name: '120. Jumpsuit',
  fit: 'relaxed',
  modelId: 'hoodie-body',
  categoryPath: 'dresses-skirts-and-other/jumpsuit',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
