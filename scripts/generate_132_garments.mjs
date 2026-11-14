import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const garmentsDir = path.join(rootDir, 'src', 'garments');

const GARMENT_MANIFEST = [
  // SECTION A: T-SHIRTS (1-20)
  { id: 'tshirt_regular', dir: 't-shirts/regular-fit', name: '1. Regular Fit T-Shirt', fit: 'regular', base: 'tee', modelId: 'tee-t5', desc: 'Classic everyday regular-fit silhouette with ribbed crew collar and twin-needle hem.', w: 530, l: 720, slv: 220 },
  { id: 'tshirt_oversized', dir: 't-shirts/oversized', name: '2. Oversized T-Shirt', fit: 'oversized', base: 'tee', modelId: 'tee-oversize-1', desc: 'Modern streetwear oversized drape with wide chest, extended drop shoulders, and chunky 30mm rib collar.', w: 630, l: 750, slv: 250 },
  { id: 'tshirt_boxy', dir: 't-shirts/boxy-fit', name: '3. Boxy Fit T-Shirt', fit: 'boxy', base: 'tee', modelId: 'tee-oversize-1', desc: 'Square torso proportions with widened chest and flat straight hem.', w: 620, l: 700, slv: 230 },
  { id: 'tshirt_drop_shoulder', dir: 't-shirts/drop-shoulder', name: '4. Drop Shoulder T-Shirt', fit: 'drop-shoulder', base: 'tee', modelId: 'tee-oversize-1', desc: 'Elongated shoulder line creating a relaxed casual sleeve drape.', w: 610, l: 740, slv: 240 },
  { id: 'tshirt_slim', dir: 't-shirts/slim-fit', name: '5. Slim Fit T-Shirt', fit: 'slim', base: 'tee', modelId: 'tee-t5', desc: 'Tailored athletic silhouette contours chest and arms.', w: 490, l: 710, slv: 200 },
  { id: 'tshirt_relaxed', dir: 't-shirts/relaxed-fit', name: '6. Relaxed Fit T-Shirt', fit: 'relaxed', base: 'tee', modelId: 'tee-t5', desc: 'Easygoing everyday drape between regular and oversized fit.', w: 560, l: 730, slv: 230 },
  { id: 'tshirt_longline', dir: 't-shirts/longline', name: '7. Longline T-Shirt', fit: 'regular', base: 'tee', modelId: 'tee-t5', desc: 'Elongated body length with curved scoop hemline for layered styling.', w: 530, l: 820, slv: 230 },
  { id: 'tshirt_cropped', dir: 't-shirts/cropped', name: '8. Cropped T-Shirt', fit: 'cropped', base: 'tee', modelId: 'tee-t5', desc: 'Shortened body length hitting right above waistband line.', w: 580, l: 560, slv: 200 },
  { id: 'tshirt_baby_tee', dir: 't-shirts/baby-tee', name: '9. Baby Tee', fit: 'slim', base: 'tee', modelId: 'tee-t5', desc: '90s fitted Y2K silhouette with cap sleeves and compact proportions.', w: 440, l: 520, slv: 150 },
  { id: 'tshirt_vneck', dir: 't-shirts/v-neck', name: '10. V-Neck T-Shirt', fit: 'regular', base: 'tee', modelId: 'tee-t5', desc: 'Classic mitered V-neck collar silhouette in clean combed jersey.', w: 520, l: 720, slv: 220 },
  { id: 'tshirt_deep_vneck', dir: 't-shirts/deep-vneck', name: '11. Deep V-Neck T-Shirt', fit: 'regular', base: 'tee', modelId: 'tee-t5', desc: 'Extended plunge neckline for breezy summer drape.', w: 520, l: 720, slv: 220 },
  { id: 'tshirt_crew_neck', dir: 't-shirts/crew-neck', name: '12. Crew Neck T-Shirt', fit: 'regular', base: 'tee', modelId: 'tee-t5', desc: 'Timeless ribbed round collar with double-needle neck tape.', w: 530, l: 720, slv: 220 },
  { id: 'tshirt_scoop_neck', dir: 't-shirts/scoop-neck', name: '13. Scoop Neck T-Shirt', fit: 'relaxed', base: 'tee', modelId: 'tee-t5', desc: 'Wide rounded neck opening framing the collarbones.', w: 530, l: 710, slv: 210 },
  { id: 'tshirt_ringer', dir: 't-shirts/ringer', name: '14. Ringer T-Shirt', fit: 'regular', base: 'ringer', modelId: 'tee-t5', desc: 'Vintage athletic tee with contrast ribbed collar and sleeve binding.', w: 520, l: 720, slv: 220 },
  { id: 'tshirt_raglan', dir: 't-shirts/raglan', name: '15. Raglan T-Shirt', fit: 'regular', base: 'tee', modelId: 'tee-t5', desc: 'Continuous diagonal seam from collar to armpit for athletic mobility.', w: 540, l: 730, slv: 240 },
  { id: 'tshirt_baseball', dir: 't-shirts/baseball', name: '16. Baseball T-Shirt', fit: 'regular', base: 'longsleeve', modelId: 'tee-longsleeve', desc: 'Three-quarter contrast raglan sleeves with curved shirttail hem.', w: 540, l: 740, slv: 440 },
  { id: 'tshirt_pocket', dir: 't-shirts/pocket', name: '17. Pocket T-Shirt', fit: 'regular', base: 'pocket', modelId: 'tee-t5', desc: 'Single patch pocket stitched on left chest.', w: 530, l: 720, slv: 220 },
  { id: 'tshirt_graphic', dir: 't-shirts/graphic', name: '18. Graphic T-Shirt', fit: 'oversized', base: 'tee', modelId: 'tee-oversize-1', desc: 'Heavyweight flat-surface jersey optimized for front and back artwork printing.', w: 620, l: 750, slv: 250 },
  { id: 'tshirt_heavyweight', dir: 't-shirts/heavyweight', name: '19. Heavyweight T-Shirt', fit: 'oversized', base: 'tee', modelId: 'tee-oversize-1', desc: 'Sturdy 280 GSM dry-hand combed cotton with structural boxy shape.', w: 640, l: 750, slv: 260 },
  { id: 'tshirt_sleeveless', dir: 't-shirts/sleeveless', name: '20. Sleeveless T-Shirt', fit: 'regular', base: 'tee', modelId: 'tee-t5', desc: 'Armhole binding with dropped shoulder cuts for active movement.', w: 540, l: 720, slv: 0 },

  // SECTION B: POLOS AND CASUAL TOPS (21-35)
  { id: 'polo_classic', dir: 'polos-and-shirts/classic-polo', name: '21. Classic Polo', fit: 'regular', base: 'polo', modelId: 'polo', desc: 'Piqué knit polo with 2-button placket and flat knit collar.' },
  { id: 'polo_oversized', dir: 'polos-and-shirts/oversized-polo', name: '22. Oversized Polo', fit: 'oversized', base: 'polo', modelId: 'polo', desc: 'Streetwear draped polo with dropped shoulders and roomy sleeves.' },
  { id: 'polo_slim', dir: 'polos-and-shirts/slim-polo', name: '23. Slim Polo', fit: 'slim', base: 'polo', modelId: 'polo', desc: 'Fitted athletic piqué polo with tapered waist.' },
  { id: 'polo_long_sleeve', dir: 'polos-and-shirts/long-sleeve-polo', name: '24. Long-Sleeve Polo', fit: 'regular', base: 'longsleeve', modelId: 'tee-longsleeve', desc: 'Turn-down collar with ribbed cuffs and extended sleeve length.' },
  { id: 'polo_rugby', dir: 'polos-and-shirts/rugby-shirt', name: '25. Rugby Shirt', fit: 'oversized', base: 'polo', modelId: 'polo', desc: 'Heavyweight contrast white twill collar with rubber buttons.' },
  { id: 'shirt_henley', dir: 'polos-and-shirts/henley-shirt', name: '26. Henley Shirt', fit: 'regular', base: 'tee', modelId: 'tee-t5', desc: 'Collarless knit tee with 3-button front placket.', w: 530, l: 730, slv: 230 },
  { id: 'shirt_cuban_collar', dir: 'polos-and-shirts/cuban-collar-shirt', name: '27. Cuban Collar Shirt', fit: 'relaxed', base: 'shirt', modelId: 'shirt-short-sleeve', desc: 'Open camp neckline with notch lapel and boxy torso.' },
  { id: 'shirt_camp_collar', dir: 'polos-and-shirts/camp-collar-shirt', name: '28. Camp Collar Shirt', fit: 'relaxed', base: 'shirt', modelId: 'shirt-short-sleeve', desc: 'Relaxed resort silhouette with flat laydown collar.' },
  { id: 'shirt_button_up', dir: 'polos-and-shirts/casual-button-up', name: '29. Casual Button-Up Shirt', fit: 'regular', base: 'shirt', modelId: 'shirt-short-sleeve', desc: 'Front button placket, patch pocket, and curved hemline.' },
  { id: 'shirt_oversized', dir: 'polos-and-shirts/oversized-shirt', name: '30. Oversized Shirt', fit: 'oversized', base: 'shirt', modelId: 'shirt-short-sleeve', desc: 'Slouchy drop-shoulder button-down in breezy cotton poplin.' },
  { id: 'shirt_slim_dress', dir: 'polos-and-shirts/slim-dress-shirt', name: '31. Slim Dress Shirt', fit: 'slim', base: 'shirt', modelId: 'shirt-short-sleeve', desc: 'Back waist darts, structured collar, and French cuffs.' },
  { id: 'shirt_oxford', dir: 'polos-and-shirts/oxford-shirt', name: '32. Oxford Shirt', fit: 'regular', base: 'shirt', modelId: 'shirt-short-sleeve', desc: 'Classic button-down collar Oxford cloth shirt.' },
  { id: 'shirt_flannel', dir: 'polos-and-shirts/flannel-shirt', name: '33. Flannel Shirt', fit: 'relaxed', base: 'shirt', modelId: 'shirt-short-sleeve', desc: 'Heavy brushed cotton twin-pocket work shirt.' },
  { id: 'shirt_denim', dir: 'polos-and-shirts/denim-shirt', name: '34. Denim Shirt', fit: 'regular', base: 'shirt', modelId: 'shirt-short-sleeve', desc: 'Western front yokes, snap closures, and durable denim weave.' },
  { id: 'shirt_linen', dir: 'polos-and-shirts/linen-shirt', name: '35. Linen Shirt', fit: 'relaxed', base: 'shirt', modelId: 'shirt-short-sleeve', desc: 'Lightweight breathable pure flax linen casual shirt.' },

  // SECTION C: SWEATSHIRTS AND HOODIES (36-50)
  { id: 'hoodie_classic', dir: 'hoodies-and-sweats/classic-hoodie', name: '36. Classic Hoodie', fit: 'regular', base: 'hoodie', modelId: 'hoodie', desc: 'Front kangaroo pocket, drawstring hood, ribbed hem and cuffs.' },
  { id: 'hoodie_oversized', dir: 'hoodies-and-sweats/oversized-hoodie', name: '37. Oversized Hoodie', fit: 'oversized', base: 'hoodie', modelId: 'hoodie-body', desc: 'Slouchy drop shoulders and roomy double-layer fleece hood.' },
  { id: 'hoodie_zip_up', dir: 'hoodies-and-sweats/zip-up-hoodie', name: '38. Zip-Up Hoodie', fit: 'regular', base: 'ziphoodie', modelId: 'hoodie-body', desc: 'Full-length metal center front zipper with split kangaroo pockets.' },
  { id: 'hoodie_pullover', dir: 'hoodies-and-sweats/pullover-hoodie', name: '39. Pullover Hoodie', fit: 'oversized', base: 'hoodie', modelId: 'hoodie', desc: 'Heavyweight 450 GSM French terry hoodie with clean pouch.' },
  { id: 'hoodie_cropped', dir: 'hoodies-and-sweats/cropped-hoodie', name: '40. Cropped Hoodie', fit: 'cropped', base: 'hoodie', modelId: 'hoodie', desc: 'Raw edge hem hitting high with oversized relaxed sleeves.' },
  { id: 'hoodie_sleeveless', dir: 'hoodies-and-sweats/sleeveless-hoodie', name: '41. Sleeveless Hoodie', fit: 'regular', base: 'hoodie', modelId: 'hoodie', desc: 'Armhole raw edge cut with roomy hood for training.' },
  { id: 'hoodie_heavyweight', dir: 'hoodies-and-sweats/heavyweight-hoodie', name: '42. Heavyweight Hoodie', fit: 'oversized', base: 'hoodie', modelId: 'hoodie', desc: '500 GSM ultra-dense brushed fleece with structured hood.' },
  { id: 'hoodie_boxy', dir: 'hoodies-and-sweats/boxy-hoodie', name: '43. Boxy Hoodie', fit: 'boxy', base: 'hoodie', modelId: 'hoodie', desc: 'Square torso proportions with relaxed wide sleeve circumference.' },
  { id: 'hoodie_drop_shoulder', dir: 'hoodies-and-sweats/drop-shoulder-hoodie', name: '44. Drop Shoulder Hoodie', fit: 'drop-shoulder', base: 'hoodie', modelId: 'hoodie', desc: 'Extended shoulder seam for effortless street silhouette.' },
  { id: 'sweatshirt_classic', dir: 'hoodies-and-sweats/classic-sweatshirt', name: '45. Classic Sweatshirt', fit: 'regular', base: 'sweatshirt', modelId: 'hoodie-flat', desc: 'Crewneck fleece sweater with ribbed triangular V-insert at neck.' },
  { id: 'sweatshirt_oversized', dir: 'hoodies-and-sweats/oversized-sweatshirt', name: '46. Oversized Sweatshirt', fit: 'oversized', base: 'sweatshirt', modelId: 'hoodie-flat', desc: 'Heavy fleece crewneck with wide chest and drop shoulders.' },
  { id: 'sweatshirt_crewneck', dir: 'hoodies-and-sweats/crewneck-sweatshirt', name: '47. Crewneck Sweatshirt', fit: 'regular', base: 'sweatshirt', modelId: 'hoodie-flat', desc: 'Ribbed collar, cuffs, and hem in durable 380 GSM loopback.' },
  { id: 'sweatshirt_half_zip', dir: 'hoodies-and-sweats/half-zip-sweatshirt', name: '48. Half-Zip Sweatshirt', fit: 'relaxed', base: 'sweatshirt', modelId: 'hoodie-flat', desc: 'Stand collar with silver half zip puller.' },
  { id: 'sweatshirt_quarter_zip', dir: 'hoodies-and-sweats/quarter-zip-sweatshirt', name: '49. Quarter-Zip Sweatshirt', fit: 'regular', base: 'sweatshirt', modelId: 'hoodie-flat', desc: 'Cadet collar with front quarter zipper closure.' },
  { id: 'sweatshirt_cropped', dir: 'hoodies-and-sweats/cropped-sweatshirt', name: '50. Cropped Sweatshirt', fit: 'cropped', base: 'sweatshirt', modelId: 'hoodie-flat', desc: 'Shortened body with wide ribbed waistband.' },

  // SECTION D: JACKETS AND OUTERWEAR (51-70)
  { id: 'jacket_bomber', dir: 'jackets-and-outerwear/bomber-jacket', name: '51. Bomber Jacket', fit: 'relaxed', base: 'jacket', modelId: 'hoodie-body', desc: 'MA-1 flight jacket with ribbed collar, utility sleeve pocket, and zipper.' },
  { id: 'jacket_varsity', dir: 'jackets-and-outerwear/varsity-jacket', name: '52. Varsity Jacket', fit: 'oversized', base: 'jacket', modelId: 'hoodie-body', desc: 'Wool body, contrast sleeves, striped ribbing, and snap front.' },
  { id: 'jacket_denim', dir: 'jackets-and-outerwear/denim-jacket', name: '53. Denim Jacket', fit: 'regular', base: 'jacket', modelId: 'hoodie-body', desc: 'Trucker jacket with front flap pockets, shank buttons, and waist tabs.' },
  { id: 'jacket_leather', dir: 'jackets-and-outerwear/leather-jacket', name: '54. Leather Jacket', fit: 'regular', base: 'jacket', modelId: 'hoodie-body', desc: 'Clean tailored lambskin leather zip jacket.' },
  { id: 'jacket_biker', dir: 'jackets-and-outerwear/biker-jacket', name: '55. Biker Jacket', fit: 'slim', base: 'jacket', modelId: 'hoodie-body', desc: 'Asymmetric zipper, wide notch lapels, and coin flap pocket.' },
  { id: 'jacket_harrington', dir: 'jackets-and-outerwear/harrington-jacket', name: '56. Harrington Jacket', fit: 'regular', base: 'jacket', modelId: 'hoodie-body', desc: 'Stand collar with double button tab and Fraser tartan lining.' },
  { id: 'jacket_windbreaker', dir: 'jackets-and-outerwear/windbreaker', name: '57. Windbreaker', fit: 'relaxed', base: 'jacket', modelId: 'hoodie-body', desc: 'Lightweight ripstop nylon with elastic toggle hem and hood.' },
  { id: 'jacket_track', dir: 'jackets-and-outerwear/track-jacket', name: '58. Track Jacket', fit: 'regular', base: 'jacket', modelId: 'hoodie-body', desc: 'Contrast sleeve stripe piping with full zip closure.' },
  { id: 'jacket_coach', dir: 'jackets-and-outerwear/coach-jacket', name: '59. Coach Jacket', fit: 'relaxed', base: 'jacket', modelId: 'hoodie-body', desc: 'Point collar, snap button front, and drawstring waist.' },
  { id: 'jacket_puffer', dir: 'jackets-and-outerwear/puffer-jacket', name: '60. Puffer Jacket', fit: 'oversized', base: 'jacket', modelId: 'hoodie-body', desc: 'Down quilted baffle chambers with funnel neck collar.' },
  { id: 'jacket_parka', dir: 'jackets-and-outerwear/parka', name: '61. Parka', fit: 'oversized', base: 'jacket', modelId: 'hoodie-body', desc: 'Fishtail parka with drawstring waist and storm flap.' },
  { id: 'jacket_trench_coat', dir: 'jackets-and-outerwear/trench-coat', name: '62. Trench Coat', fit: 'regular', base: 'jacket', modelId: 'hoodie-body', desc: 'Double-breasted storm flap coat with waist buckle belt.' },
  { id: 'jacket_overcoat', dir: 'jackets-and-outerwear/overcoat', name: '63. Overcoat', fit: 'regular', base: 'jacket', modelId: 'hoodie-body', desc: 'Tailored wool topcoat with notched lapels and single vent.' },
  { id: 'jacket_blazer', dir: 'jackets-and-outerwear/blazer', name: '64. Blazer', fit: 'regular', base: 'jacket', modelId: 'hoodie-body', desc: 'Structured 2-button blazer with patch pockets and chest welt.' },
  { id: 'jacket_suit_jacket', dir: 'jackets-and-outerwear/suit-jacket', name: '65. Suit Jacket', fit: 'slim', base: 'jacket', modelId: 'hoodie-body', desc: 'Tailored suit jacket with peak lapels and horn buttons.' },
  { id: 'jacket_utility', dir: 'jackets-and-outerwear/utility-jacket', name: '66. Utility Jacket', fit: 'relaxed', base: 'jacket', modelId: 'hoodie-body', desc: 'Four front cargo bellows pockets with hidden button placket.' },
  { id: 'jacket_workwear', dir: 'jackets-and-outerwear/workwear-jacket', name: '67. Workwear Jacket', fit: 'regular', base: 'jacket', modelId: 'hoodie-body', desc: 'Heavy canvas chore coat with corduroy collar.' },
  { id: 'jacket_fleece', dir: 'jackets-and-outerwear/fleece-jacket', name: '68. Fleece Jacket', fit: 'relaxed', base: 'jacket', modelId: 'hoodie-body', desc: 'High-pile Sherpa fleece with nylon chest zip pocket.' },
  { id: 'jacket_softshell', dir: 'jackets-and-outerwear/softshell-jacket', name: '69. Softshell Jacket', fit: 'regular', base: 'jacket', modelId: 'hoodie-body', desc: 'Weather-resistant stretch bonded membrane jacket.' },
  { id: 'jacket_rain', dir: 'jackets-and-outerwear/rain-jacket', name: '70. Rain Jacket', fit: 'relaxed', base: 'jacket', modelId: 'hoodie-body', desc: 'Seam-sealed waterproof shell with adjustable peaked hood.' },

  // SECTION E: TANK TOPS AND SLEEVELESS (71-78)
  { id: 'tank_classic', dir: 'tank-tops/classic-tank', name: '71. Classic Tank Top', fit: 'regular', base: 'tank', modelId: 'tee-t5', desc: 'U-neck collar with self-bound armholes and scoop neckline.' },
  { id: 'tank_racerback', dir: 'tank-tops/racerback-tank', name: '72. Racerback Tank', fit: 'slim', base: 'tank', modelId: 'tee-t5', desc: 'Tapered T-back back panel for shoulder blade mobility.' },
  { id: 'tank_muscle', dir: 'tank-tops/muscle-tank', name: '73. Muscle Tank', fit: 'relaxed', base: 'tank', modelId: 'tee-t5', desc: 'Extended drop armhole with relaxed draped torso.' },
  { id: 'tank_stringer', dir: 'tank-tops/stringer-tank', name: '74. Stringer Tank', fit: 'slim', base: 'tank', modelId: 'tee-t5', desc: 'Deep cut sides with narrow shoulder straps for bodybuilding.' },
  { id: 'tank_cropped', dir: 'tank-tops/cropped-tank', name: '75. Cropped Tank', fit: 'cropped', base: 'tank', modelId: 'tee-t5', desc: 'Ribbed cropped sleeveless top hitting above midriff.' },
  { id: 'tank_ribbed', dir: 'tank-tops/ribbed-tank', name: '76. Ribbed Tank', fit: 'slim', base: 'tank', modelId: 'tee-t5', desc: '2x2 stretch cotton rib knit contouring the body.' },
  { id: 'tank_athletic', dir: 'tank-tops/athletic-tank', name: '77. Athletic Tank', fit: 'regular', base: 'tank', modelId: 'tee-t5', desc: 'Moisture-wicking mesh jersey with reflective hem transfer.' },
  { id: 'tank_compression', dir: 'tank-tops/compression-tank', name: '78. Compression Tank', fit: 'slim', base: 'tank', modelId: 'tee-t5', desc: '4-way elastane support fit for high-intensity training.' },

  // SECTION F: PANTS AND TROUSERS (79-96)
  { id: 'pants_straight_jeans', dir: 'pants-and-trousers/straight-jeans', name: '79. Straight Fit Jeans', fit: 'straight', base: 'jeans', modelId: 'moto-pants', desc: '5-pocket classic straight leg cut in 13.5 oz denim with back yokes.' },
  { id: 'pants_slim_jeans', dir: 'pants-and-trousers/slim-jeans', name: '80. Slim Fit Jeans', fit: 'slim', base: 'jeans', modelId: 'moto-pants', desc: 'Tapered leg profile fitted through hip and thigh.' },
  { id: 'pants_skinny_jeans', dir: 'pants-and-trousers/skinny-jeans', name: '81. Skinny Jeans', fit: 'slim', base: 'jeans', modelId: 'moto-pants', desc: 'Close-fitting stretch denim through ankle.' },
  { id: 'pants_relaxed_jeans', dir: 'pants-and-trousers/relaxed-jeans', name: '82. Relaxed Jeans', fit: 'relaxed', base: 'jeans', modelId: 'moto-pants', desc: 'Roomy seat and thigh with straight leg fall.' },
  { id: 'pants_baggy_jeans', dir: 'pants-and-trousers/baggy-jeans', name: '83. Baggy Jeans', fit: 'baggy', base: 'jeans', modelId: 'moto-pants', desc: '90s wide skateboard silhouette with puddle hem.' },
  { id: 'pants_wide_leg_jeans', dir: 'pants-and-trousers/wide-leg-jeans', name: '84. Wide-Leg Jeans', fit: 'baggy', base: 'jeans', modelId: 'moto-pants', desc: 'Clean architectural wide leg from hip to sweep.' },
  { id: 'pants_bootcut_jeans', dir: 'pants-and-trousers/bootcut-jeans', name: '85. Bootcut Jeans', fit: 'straight', base: 'jeans', modelId: 'moto-pants', desc: 'Slight flare below knee to accommodate footwear.' },
  { id: 'pants_flared_jeans', dir: 'pants-and-trousers/flared-jeans', name: '86. Flared Jeans', fit: 'relaxed', base: 'jeans', modelId: 'moto-pants', desc: 'Dramatic bell flare opening from knee down.' },
  { id: 'pants_cargo', dir: 'pants-and-trousers/cargo-pants', name: '87. Cargo Pants', fit: 'relaxed', base: 'cargo', modelId: 'moto-pants', desc: 'Twin pleated side bellows cargo pockets and knee darts.' },
  { id: 'pants_parachute', dir: 'pants-and-trousers/parachute-pants', name: '88. Parachute Pants', fit: 'baggy', base: 'cargo', modelId: 'moto-pants', desc: 'Voluminous nylon with bungee hem cinches.' },
  { id: 'pants_chino', dir: 'pants-and-trousers/chino-pants', name: '89. Chino Pants', fit: 'straight', base: 'pants', modelId: 'moto-pants', desc: 'Flat front twill trousers with slant front pockets.' },
  { id: 'pants_dress_trousers', dir: 'pants-and-trousers/dress-trousers', name: '90. Dress Trousers', fit: 'straight', base: 'pants', modelId: 'moto-pants', desc: 'Pressed center leg crease with hook-and-bar closure.' },
  { id: 'pants_tailored', dir: 'pants-and-trousers/tailored-trousers', name: '91. Tailored Trousers', fit: 'slim', base: 'pants', modelId: 'moto-pants', desc: 'Side waist adjusters with tapered cuffed hem.' },
  { id: 'pants_track', dir: 'pants-and-trousers/track-pants', name: '92. Track Pants', fit: 'regular', base: 'pants', modelId: 'moto-pants', desc: 'Nylon training pants with ankle zips and side piping.' },
  { id: 'pants_joggers', dir: 'pants-and-trousers/joggers', name: '93. Joggers', fit: 'regular', base: 'pants', modelId: 'moto-pants', desc: 'Tapered fleece sweatpants with ribbed ankle cuffs.' },
  { id: 'pants_sweatpants', dir: 'pants-and-trousers/sweatpants', name: '94. Sweatpants', fit: 'relaxed', base: 'pants', modelId: 'moto-pants', desc: 'Relaxed heavyweight sweatpants with elasticated cuffs.' },
  { id: 'pants_straight_trousers', dir: 'pants-and-trousers/straight-trousers', name: '95. Straight Fit Trousers', fit: 'straight', base: 'pants', modelId: 'moto-pants', desc: 'Clean minimal trousers in wool blend fabric.' },
  { id: 'pants_wide_trousers', dir: 'pants-and-trousers/wide-trousers', name: '96. Wide-Leg Trousers', fit: 'baggy', base: 'pants', modelId: 'moto-pants', desc: 'High-waisted double pleated wide leg trousers.' },

  // SECTION G: SHORTS (97-106)
  { id: 'shorts_denim', dir: 'shorts/denim-shorts', name: '97. Denim Shorts', fit: 'regular', base: 'jeans', modelId: 'moto-pants', desc: '5-pocket cut-off jean shorts with raw frayed hem.' },
  { id: 'shorts_cargo', dir: 'shorts/cargo-shorts', name: '98. Cargo Shorts', fit: 'relaxed', base: 'cargo', modelId: 'moto-pants', desc: 'Side cargo pockets with durable ripstop waistband.' },
  { id: 'shorts_basketball', dir: 'shorts/basketball-shorts', name: '99. Basketball Shorts', fit: 'baggy', base: 'pants', modelId: 'moto-pants', desc: 'Breathable double-layer mesh with striped knit waistband.' },
  { id: 'shorts_running', dir: 'shorts/running-shorts', name: '100. Running Shorts', fit: 'slim', base: 'pants', modelId: 'moto-pants', desc: 'Lightweight 5-inch inseam shorts with inner brief liner.' },
  { id: 'shorts_athletic', dir: 'shorts/athletic-shorts', name: '101. Athletic Shorts', fit: 'regular', base: 'pants', modelId: 'moto-pants', desc: '4-way stretch gym training shorts with zipper pockets.' },
  { id: 'shorts_bermuda', dir: 'shorts/bermuda-shorts', name: '102. Bermuda Shorts', fit: 'straight', base: 'pants', modelId: 'moto-pants', desc: 'Tailored knee-length shorts with cuffed hem.' },
  { id: 'shorts_chino', dir: 'shorts/chino-shorts', name: '103. Chino Shorts', fit: 'regular', base: 'pants', modelId: 'moto-pants', desc: 'Clean casual twill shorts with 7-inch inseam.' },
  { id: 'shorts_sweat', dir: 'shorts/sweat-shorts', name: '104. Sweat Shorts', fit: 'relaxed', base: 'pants', modelId: 'moto-pants', desc: 'Heavyweight French terry shorts with raw hem.' },
  { id: 'shorts_board', dir: 'shorts/board-shorts', name: '105. Board Shorts', fit: 'regular', base: 'pants', modelId: 'moto-pants', desc: 'Quick-dry surf shorts with lace-up fly closure.' },
  { id: 'shorts_cycling', dir: 'shorts/cycling-shorts', name: '106. Cycling Shorts', fit: 'slim', base: 'pants', modelId: 'moto-pants', desc: 'High-rise compression spandex shorts with leg grip.' },

  // SECTION H: ADDITIONAL CLOTHING (107-132)
  { id: 'clothing_leggings', dir: 'dresses-skirts-and-other/leggings', name: '107. Leggings', fit: 'slim', base: 'pants', modelId: 'moto-pants', desc: 'Seamless stretch high-waist ankle-length leggings.' },
  { id: 'clothing_compression_leggings', dir: 'dresses-skirts-and-other/compression-leggings', name: '108. Compression Leggings', fit: 'slim', base: 'pants', modelId: 'moto-pants', desc: 'Targeted muscle support panels with flatlock stitching.' },
  { id: 'clothing_yoga_pants', dir: 'dresses-skirts-and-other/yoga-pants', name: '109. Yoga Pants', fit: 'relaxed', base: 'pants', modelId: 'moto-pants', desc: 'Foldover waistband with flared bootcut hem.' },
  { id: 'clothing_skirt_basic', dir: 'dresses-skirts-and-other/skirts-basic', name: '110. Skirts', fit: 'regular', base: 'pants', modelId: 'moto-pants', desc: 'Clean A-line cut skirt with concealed side zipper.' },
  { id: 'clothing_skirt_pleated', dir: 'dresses-skirts-and-other/pleated-skirt', name: '111. Pleated Skirt', fit: 'regular', base: 'pants', modelId: 'moto-pants', desc: 'Uniform knife pleats with structured waistband.' },
  { id: 'clothing_skirt_aline', dir: 'dresses-skirts-and-other/aline-skirt', name: '112. A-Line Skirt', fit: 'regular', base: 'pants', modelId: 'moto-pants', desc: 'Classic flared A-silhouette hitting at the knee.' },
  { id: 'clothing_skirt_maxi', dir: 'dresses-skirts-and-other/maxi-skirt', name: '113. Maxi Skirt', fit: 'relaxed', base: 'pants', modelId: 'moto-pants', desc: 'Full-length floor-grazing draped skirt.' },
  { id: 'clothing_skirt_mini', dir: 'dresses-skirts-and-other/mini-skirt', name: '114. Mini Skirt', fit: 'slim', base: 'pants', modelId: 'moto-pants', desc: 'High-rise structured mini skirt with front slit.' },
  { id: 'clothing_dress_midi', dir: 'dresses-skirts-and-other/midi-dress', name: '115. Midi Dress', fit: 'regular', base: 'tee', modelId: 'tee-t5', desc: 'Draped jersey dress falling below the knee.', w: 500, l: 1100, slv: 220 },
  { id: 'clothing_dress_maxi', dir: 'dresses-skirts-and-other/maxi-dress', name: '116. Maxi Dress', fit: 'relaxed', base: 'tee', modelId: 'tee-t5', desc: 'Flowing ankle-length column dress.', w: 520, l: 1350, slv: 220 },
  { id: 'clothing_dress_shirt', dir: 'dresses-skirts-and-other/shirt-dress', name: '117. Shirt Dress', fit: 'relaxed', base: 'shirt', modelId: 'shirt-short-sleeve', desc: 'Button-up collar dress with tie belt waist.' },
  { id: 'clothing_dress_bodycon', dir: 'dresses-skirts-and-other/bodycon-dress', name: '118. Bodycon Dress', fit: 'slim', base: 'tee', modelId: 'tee-t5', desc: 'Form-fitting stretch rib midi dress.', w: 440, l: 1050, slv: 200 },
  { id: 'clothing_dress_casual', dir: 'dresses-skirts-and-other/casual-dress', name: '119. Casual Dress', fit: 'relaxed', base: 'tee', modelId: 'tee-t5', desc: 'Everyday T-shirt dress with side seam pockets.', w: 560, l: 950, slv: 230 },
  { id: 'clothing_jumpsuit', dir: 'dresses-skirts-and-other/jumpsuit', name: '120. Jumpsuit', fit: 'relaxed', base: 'jacket', modelId: 'hoodie-body', desc: 'One-piece boiler suit with belted waist and zipper front.' },
  { id: 'clothing_romper', dir: 'dresses-skirts-and-other/romper', name: '121. Romper', fit: 'regular', base: 'jacket', modelId: 'hoodie-body', desc: 'One-piece short jumpsuit with elastic drawstring waist.' },
  { id: 'clothing_bodysuit', dir: 'dresses-skirts-and-other/bodysuit', name: '122. Bodysuit', fit: 'slim', base: 'tank', modelId: 'tee-t5', desc: 'Fitted stretch jersey bodysuit with snap bottom closure.' },
  { id: 'clothing_tracksuit_top', dir: 'dresses-skirts-and-other/tracksuit-top', name: '123. Tracksuit Top', fit: 'regular', base: 'jacket', modelId: 'hoodie-body', desc: 'Zip-front track jacket with contrast arm panels.' },
  { id: 'clothing_tracksuit_bottom', dir: 'dresses-skirts-and-other/tracksuit-bottom', name: '124. Tracksuit Bottom', fit: 'regular', base: 'pants', modelId: 'moto-pants', desc: 'Matching athletic track pants with ankle zippers.' },
  { id: 'clothing_sports_jersey', dir: 'dresses-skirts-and-other/sports-jersey', name: '125. Sports Jersey', fit: 'oversized', base: 'tee', modelId: 'tee-oversize-1', desc: 'V-neck mesh athletic jersey with sleeve banding.', w: 600, l: 760, slv: 250 },
  { id: 'clothing_basketball_jersey', dir: 'dresses-skirts-and-other/basketball-jersey', name: '126. Basketball Jersey', fit: 'oversized', base: 'tank', modelId: 'tee-t5', desc: 'Wide armhole sleeveless tank with ribbed trim.' },
  { id: 'clothing_football_jersey', dir: 'dresses-skirts-and-other/football-jersey', name: '127. Football Jersey', fit: 'oversized', base: 'tee', modelId: 'tee-oversize-1', desc: 'Drop-shoulder reinforced yoke jersey for pads.', w: 620, l: 770, slv: 260 },
  { id: 'clothing_cycling_jersey', dir: 'dresses-skirts-and-other/cycling-jersey', name: '128. Cycling Jersey', fit: 'slim', base: 'tee', modelId: 'tee-t5', desc: 'Form-fitting aerodynamic top with 3 rear pockets.', w: 460, l: 680, slv: 210 },
  { id: 'clothing_scrub_top', dir: 'dresses-skirts-and-other/scrub-top', name: '129. Scrub Top', fit: 'regular', base: 'tee', modelId: 'tee-t5', desc: 'Medical V-neck top with twin chest and waist pockets.', w: 540, l: 720, slv: 220 },
  { id: 'clothing_scrub_pants', dir: 'dresses-skirts-and-other/scrub-pants', name: '130. Scrub Pants', fit: 'regular', base: 'pants', modelId: 'moto-pants', desc: 'Straight-leg medical pants with cargo pocket and drawstring.' },
  { id: 'clothing_apron', dir: 'dresses-skirts-and-other/apron', name: '131. Apron', fit: 'regular', base: 'tee', modelId: 'tee-t5', desc: 'Bib work apron with adjustable neck strap and front pockets.', w: 650, l: 850, slv: 0 },
  { id: 'clothing_coverall', dir: 'dresses-skirts-and-other/workwear-coverall', name: '132. Workwear Coverall', fit: 'relaxed', base: 'jacket', modelId: 'hoodie-body', desc: 'Heavy drill protective coverall with action back pleats.' },
];

console.log(`Generating ${GARMENT_MANIFEST.length} individual garment folders...`);

for (const item of GARMENT_MANIFEST) {
  const targetDir = path.join(garmentsDir, item.dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const depth = item.dir.split('/').length;
  const relPrefix = '../'.repeat(depth);

  let templateCall = '';
  if (item.base === 'tee') {
    const width = item.w || 540;
    const length = item.l || 720;
    const sleeve = item.slv !== undefined ? item.slv : 220;
    templateCall = `
const base = createTShirtTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}', {
  chestWidth: ${width},
  bodyLength: ${length},
  shoulderWidth: ${Math.round(width * 0.88)},
  sleeveLength: ${sleeve},
  sleeveOpening: ${Math.round(width * 0.35)},
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: ${width},
  collarHeight: 25,
});
base.modelId = '${item.modelId}';
export const garment: GarmentTemplate = base;
`;
  } else if (item.base === 'longsleeve') {
    templateCall = `
export const garment: GarmentTemplate = createLongSleeveTShirtTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}');
`;
  } else if (item.base === 'pocket') {
    templateCall = `
export const garment: GarmentTemplate = createPocketTShirtTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}');
`;
  } else if (item.base === 'ringer') {
    templateCall = `
export const garment: GarmentTemplate = createRingerTShirtTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}');
`;
  } else if (item.base === 'tank') {
    templateCall = `
export const garment: GarmentTemplate = createTankTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}');
`;
  } else if (item.base === 'polo') {
    templateCall = `
const base = createPoloTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}');
base.modelId = '${item.modelId}';
export const garment: GarmentTemplate = base;
`;
  } else if (item.base === 'shirt') {
    templateCall = `
const base = createShirtTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}');
base.modelId = '${item.modelId}';
export const garment: GarmentTemplate = base;
`;
  } else if (item.base === 'hoodie') {
    templateCall = `
const base = createHoodieTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}');
base.modelId = '${item.modelId}';
export const garment: GarmentTemplate = base;
`;
  } else if (item.base === 'ziphoodie') {
    templateCall = `
export const garment: GarmentTemplate = createZipUpHoodieTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}');
`;
  } else if (item.base === 'sweatshirt') {
    templateCall = `
export const garment: GarmentTemplate = createSweatshirtTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}');
`;
  } else if (item.base === 'jacket') {
    templateCall = `
export const garment: GarmentTemplate = createJacketTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}');
`;
  } else if (item.base === 'jeans') {
    templateCall = `
export const garment: GarmentTemplate = createJeansTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}');
`;
  } else if (item.base === 'cargo') {
    templateCall = `
export const garment: GarmentTemplate = createCargoPantsTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}');
`;
  } else if (item.base === 'pants') {
    templateCall = `
export const garment: GarmentTemplate = createPantsTemplate('${item.id}', '${item.name}', '${item.fit}' as any, '${item.desc}');
`;
  }

  const fileContent = `/**
 * GARMENT SPECIFICATION: ${item.name}
 * ID: ${item.id}
 * 3D Model: ${item.modelId}
 */

import { GarmentTemplate } from '${relPrefix}../types/garment';
import {
  createTShirtTemplate,
  createTankTemplate,
  createLongSleeveTShirtTemplate,
  createPocketTShirtTemplate,
  createRingerTShirtTemplate,
} from '${relPrefix}templates/tshirt';
import {
  createHoodieTemplate,
  createZipUpHoodieTemplate,
  createSweatshirtTemplate,
  createJacketTemplate,
} from '${relPrefix}templates/hoodie';
import {
  createPantsTemplate,
  createJeansTemplate,
  createCargoPantsTemplate,
} from '${relPrefix}templates/pants';
import { createPoloTemplate } from '${relPrefix}templates/polo';
import { createShirtTemplate } from '${relPrefix}templates/shirt';

${templateCall}

export const metadata = {
  id: '${item.id}',
  name: '${item.name}',
  fit: '${item.fit}',
  modelId: '${item.modelId}',
  categoryPath: '${item.dir}',
};

export const modelConfig = {
  modelId: '${item.modelId}',
  modelBinary: '/models/${item.modelId}/model.bin',
  normalMap: '/models/${item.modelId}/normal.jpg',
};

export default garment;
`;

  const indexPath = path.join(targetDir, 'index.ts');
  fs.writeFileSync(indexPath, fileContent, 'utf-8');
}

// Generate src/garments/registry.ts importing from all 132 folders
const registryImports = GARMENT_MANIFEST.map((item, idx) => {
  return `import { garment as g${idx + 1} } from './${item.dir}';`;
}).join('\n');

const registryArray = GARMENT_MANIFEST.map((item, idx) => `  g${idx + 1},`).join('\n');

const registryContent = `/**
 * THREADCAD 132-GARMENT MASTER REGISTRY
 * Imports all 132 garments directly from their dedicated individual folders.
 */

import { GarmentTemplate } from '../types/garment';

${registryImports}

export const ALL_GARMENTS: GarmentTemplate[] = [
${registryArray}
];
`;

fs.writeFileSync(path.join(garmentsDir, 'registry.ts'), registryContent, 'utf-8');

console.log('Successfully generated all 132 individual garment folders and src/garments/registry.ts!');
