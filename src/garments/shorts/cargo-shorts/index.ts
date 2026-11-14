/**
 * GARMENT SPECIFICATION: 98. Cargo Shorts
 * ID: shorts_cargo
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


export const garment: GarmentTemplate = createCargoPantsTemplate('shorts_cargo', '98. Cargo Shorts', 'relaxed' as any, 'Side cargo pockets with durable ripstop waistband.');


export const metadata = {
  id: 'shorts_cargo',
  name: '98. Cargo Shorts',
  fit: 'relaxed',
  modelId: 'moto-pants',
  categoryPath: 'shorts/cargo-shorts',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
