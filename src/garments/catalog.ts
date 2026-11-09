import { GarmentTemplate } from '../types/garment';
import { createTShirtTemplate } from './templates/tshirt';
import { createHoodieTemplate } from './templates/hoodie';
import { createPantsTemplate } from './templates/pants';

export const GARMENT_TEMPLATES: GarmentTemplate[] = [
  // 1. Regular Fit T-Shirt
  createTShirtTemplate(
    'tshirt_regular',
    'Standard Crewneck T-Shirt',
    'regular',
    'Classic everyday regular-fit silhouette with ribbed crew collar and twin-needle hem.',
    {
      chestWidth: 530,
      bodyLength: 720,
      shoulderWidth: 460,
      sleeveLength: 220,
      sleeveOpening: 180,
      neckWidth: 180,
      neckDepthFront: 85,
      neckDepthBack: 22,
      hemWidth: 530,
      collarHeight: 22,
    }
  ),

  // 2. Oversized Heavyweight T-Shirt
  createTShirtTemplate(
    'tshirt_oversized',
    'Oversized Heavyweight T-Shirt',
    'oversized',
    'Modern streetwear oversized drape with wide chest, extended drop shoulders, and chunky 30mm rib collar.',
    {
      chestWidth: 620,
      bodyLength: 750,
      shoulderWidth: 560,
      sleeveLength: 250,
      sleeveOpening: 210,
      neckWidth: 195,
      neckDepthFront: 95,
      neckDepthBack: 25,
      hemWidth: 620,
      collarHeight: 30,
    }
  ),

  // 3. Boxy Cropped T-Shirt
  createTShirtTemplate(
    'tshirt_boxy_cropped',
    'Boxy Cropped T-Shirt',
    'cropped',
    'Modern boxy silhouette with shortened torso length and wide shoulder line.',
    {
      chestWidth: 600,
      bodyLength: 580,
      shoulderWidth: 540,
      sleeveLength: 210,
      sleeveOpening: 200,
      neckWidth: 190,
      neckDepthFront: 85,
      neckDepthBack: 20,
      hemWidth: 600,
      collarHeight: 25,
    }
  ),

  // 4. Drop-Shoulder Long Sleeve T-Shirt
  createTShirtTemplate(
    'tshirt_long_sleeve',
    'Drop-Shoulder Long Sleeve',
    'drop-shoulder',
    'Relaxed long-sleeve tee with ribbed cuffs and relaxed dropped armholes.',
    {
      chestWidth: 580,
      bodyLength: 740,
      shoulderWidth: 540,
      sleeveLength: 640,
      sleeveOpening: 110,
      neckWidth: 190,
      neckDepthFront: 90,
      neckDepthBack: 25,
      hemWidth: 580,
      collarHeight: 25,
    }
  ),

  // 5. Heavyweight Pullover Hoodie
  createHoodieTemplate(
    'hoodie_pullover',
    'Heavyweight Pullover Hoodie',
    'oversized',
    'Premium 450 GSM French terry hoodie with double-layer hood, seamless kangaroo pouch, and ribbed cuffs.'
  ),

  // 6. Straight Fit Denim Pants
  createPantsTemplate(
    'pants_straight_denim',
    'Straight Leg Selvedge Denim',
    'straight',
    'Classic 5-pocket straight fit selvedge denim pattern with curved front pockets and back yoke.'
  ),

  // 7. Relaxed Baggy Pants / Joggers
  createPantsTemplate(
    'pants_relaxed_jogger',
    'Relaxed Utility Sweatpants',
    'relaxed',
    'Heavy fleece sweatpants with elasticated waistband and relaxed roomy leg profile.'
  ),
];

export function getTemplateById(id: string): GarmentTemplate {
  return GARMENT_TEMPLATES.find((t) => t.id === id) || GARMENT_TEMPLATES[0];
}

