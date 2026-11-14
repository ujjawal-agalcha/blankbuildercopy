/**
 * GARMENT SPECIFICATION: 115. Midi Dress
 * ID: clothing_dress_midi
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


const base = createTShirtTemplate('clothing_dress_midi', '115. Midi Dress', 'regular' as any, 'Draped jersey dress falling below the knee.', {
  chestWidth: 500,
  bodyLength: 1100,
  shoulderWidth: 440,
  sleeveLength: 220,
  sleeveOpening: 175,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 500,
  collarHeight: 25,
});
base.modelId = 'tee-t5';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'clothing_dress_midi',
  name: '115. Midi Dress',
  fit: 'regular',
  modelId: 'tee-t5',
  categoryPath: 'dresses-skirts-and-other/midi-dress',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
