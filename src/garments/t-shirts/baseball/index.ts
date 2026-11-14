/**
 * GARMENT SPECIFICATION: 16. Baseball T-Shirt
 * ID: tshirt_baseball
 * 3D Model: tee-longsleeve
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


export const garment: GarmentTemplate = createLongSleeveTShirtTemplate('tshirt_baseball', '16. Baseball T-Shirt', 'regular' as any, 'Three-quarter contrast raglan sleeves with curved shirttail hem.');


export const metadata = {
  id: 'tshirt_baseball',
  name: '16. Baseball T-Shirt',
  fit: 'regular',
  modelId: 'tee-longsleeve',
  categoryPath: 't-shirts/baseball',
};

export const modelConfig = {
  modelId: 'tee-longsleeve',
  modelBinary: '/models/tee-longsleeve/model.bin',
  normalMap: '/models/tee-longsleeve/normal.jpg',
};

export default garment;
