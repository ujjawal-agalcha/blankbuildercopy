/**
 * GARMENT SPECIFICATION: 108. Compression Leggings
 * ID: clothing_compression_leggings
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


export const garment: GarmentTemplate = createPantsTemplate('clothing_compression_leggings', '108. Compression Leggings', 'slim' as any, 'Targeted muscle support panels with flatlock stitching.');


export const metadata = {
  id: 'clothing_compression_leggings',
  name: '108. Compression Leggings',
  fit: 'slim',
  modelId: 'moto-pants',
  categoryPath: 'dresses-skirts-and-other/compression-leggings',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
