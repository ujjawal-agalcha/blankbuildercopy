/**
 * GARMENT SPECIFICATION: 124. Tracksuit Bottom
 * ID: clothing_tracksuit_bottom
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


export const garment: GarmentTemplate = createPantsTemplate('clothing_tracksuit_bottom', '124. Tracksuit Bottom', 'regular' as any, 'Matching athletic track pants with ankle zippers.');


export const metadata = {
  id: 'clothing_tracksuit_bottom',
  name: '124. Tracksuit Bottom',
  fit: 'regular',
  modelId: 'moto-pants',
  categoryPath: 'dresses-skirts-and-other/tracksuit-bottom',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
