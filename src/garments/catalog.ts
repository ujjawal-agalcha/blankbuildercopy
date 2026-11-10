import { GarmentTemplate, GarmentCategory, FitType, StandardSize } from '../types/garment';
import { createTShirtTemplate } from './templates/tshirt';
import { createHoodieTemplate } from './templates/hoodie';
import { createPantsTemplate } from './templates/pants';
import { createPoloTemplate } from './templates/polo';

// Base helper factories
const baseTee = (id: string, name: string, fit: FitType, desc: string, length = 720, width = 540, sleeve = 220) =>
  createTShirtTemplate(id, name, fit as any, desc, {
    chestWidth: width,
    bodyLength: length,
    shoulderWidth: Math.round(width * 0.88),
    sleeveLength: sleeve,
    sleeveOpening: Math.round(width * 0.35),
    neckWidth: 185,
    neckDepthFront: 88,
    neckDepthBack: 22,
    hemWidth: width,
    collarHeight: 25,
  });

const baseHoodie = (id: string, name: string, fit: FitType, desc: string) =>
  createHoodieTemplate(id, name, fit as any, desc);

const basePants = (id: string, name: string, fit: FitType, desc: string) =>
  createPantsTemplate(id, name, fit as any, desc);

const basePolo = (id: string, name: string, fit: FitType, desc: string) =>
  createPoloTemplate(id, name, fit as any, desc);

export const GARMENT_TEMPLATES: GarmentTemplate[] = [
  // ==========================================
  // SECTION A: T-SHIRTS AND SHORT-SLEEVE TOPS (1-20)
  // ==========================================
  baseTee('tshirt_regular', '1. Regular Fit T-Shirt', 'regular', 'Classic everyday regular-fit silhouette with ribbed crew collar and twin-needle hem.', 720, 530, 220),
  baseTee('tshirt_oversized', '2. Oversized T-Shirt', 'oversized', 'Modern streetwear oversized drape with wide chest, extended drop shoulders, and chunky 30mm rib collar.', 750, 630, 250),
  baseTee('tshirt_boxy', '3. Boxy Fit T-Shirt', 'boxy', 'Square torso proportions with widened chest and flat straight hem.', 700, 620, 230),
  baseTee('tshirt_drop_shoulder', '4. Drop Shoulder T-Shirt', 'drop-shoulder', 'Elongated shoulder line creating a relaxed casual sleeve drape.', 740, 610, 240),
  baseTee('tshirt_slim', '5. Slim Fit T-Shirt', 'slim', 'Tailored athletic silhouette contours chest and arms.', 710, 490, 200),
  baseTee('tshirt_relaxed', '6. Relaxed Fit T-Shirt', 'relaxed', 'Easygoing everyday drape between regular and oversized fit.', 730, 560, 230),
  baseTee('tshirt_longline', '7. Longline T-Shirt', 'regular', 'Elongated body length with curved scoop hemline for layered styling.', 820, 530, 230),
  baseTee('tshirt_cropped', '8. Cropped T-Shirt', 'cropped', 'Shortened body length hitting right above waistband line.', 560, 580, 200),
  baseTee('tshirt_baby_tee', '9. Baby Tee', 'slim', '90s fitted Y2K silhouette with cap sleeves and compact proportions.', 520, 440, 150),
  baseTee('tshirt_vneck', '10. V-Neck T-Shirt', 'regular', 'Classic mitered V-neck collar silhouette in clean combed jersey.', 720, 520, 220),
  baseTee('tshirt_deep_vneck', '11. Deep V-Neck T-Shirt', 'regular', 'Extended plunge neckline for breezy summer drape.', 720, 520, 220),
  baseTee('tshirt_crew_neck', '12. Crew Neck T-Shirt', 'regular', 'Timeless ribbed round collar with double-needle neck tape.', 720, 530, 220),
  baseTee('tshirt_scoop_neck', '13. Scoop Neck T-Shirt', 'relaxed', 'Wide rounded neck opening framing the collarbones.', 710, 530, 210),
  baseTee('tshirt_ringer', '14. Ringer T-Shirt', 'regular', 'Vintage athletic tee with contrast ribbed collar and sleeve binding.', 720, 520, 220),
  baseTee('tshirt_raglan', '15. Raglan T-Shirt', 'regular', 'Continuous diagonal seam from collar to armpit for athletic mobility.', 730, 540, 240),
  baseTee('tshirt_baseball', '16. Baseball T-Shirt', 'regular', 'Three-quarter contrast raglan sleeves with curved shirttail hem.', 740, 540, 440),
  baseTee('tshirt_pocket', '17. Pocket T-Shirt', 'regular', 'Single patch pocket stitched on left chest.', 720, 530, 220),
  baseTee('tshirt_graphic', '18. Graphic T-Shirt', 'oversized', 'Heavyweight flat-surface jersey optimized for front and back artwork printing.', 750, 620, 250),
  baseTee('tshirt_heavyweight', '19. Heavyweight T-Shirt', 'oversized', 'Sturdy 280 GSM dry-hand combed cotton with structural boxy shape.', 750, 640, 260),
  baseTee('tshirt_sleeveless', '20. Sleeveless T-Shirt', 'regular', 'Armhole binding with dropped shoulder cuts for active movement.', 720, 540, 0),

  // ==========================================
  // SECTION B: POLO AND CASUAL TOPS (21-35)
  // ==========================================
  basePolo('polo_classic', '21. Classic Polo', 'regular', 'Piqué knit polo with 2-button placket and flat knit collar.'),
  basePolo('polo_oversized', '22. Oversized Polo', 'oversized', 'Streetwear draped polo with dropped shoulders and roomy sleeves.'),
  basePolo('polo_slim', '23. Slim Polo', 'slim', 'Fitted athletic piqué polo with tapered waist.'),
  basePolo('polo_long_sleeve', '24. Long-Sleeve Polo', 'regular', 'Turn-down collar with ribbed cuffs and extended sleeve length.'),
  basePolo('polo_rugby', '25. Rugby Shirt', 'oversized', 'Heavyweight contrast white twill collar with rubber buttons.'),
  baseTee('shirt_henley', '26. Henley Shirt', 'regular', 'Collarless knit tee with 3-button front placket.', 730, 530, 230),
  basePolo('shirt_cuban_collar', '27. Cuban Collar Shirt', 'relaxed', 'Open camp neckline with notch lapel and boxy torso.'),
  basePolo('shirt_camp_collar', '28. Camp Collar Shirt', 'relaxed', 'Relaxed resort silhouette with flat laydown collar.'),
  basePolo('shirt_button_up', '29. Casual Button-Up Shirt', 'regular', 'Front button placket, patch pocket, and curved hemline.'),
  basePolo('shirt_oversized', '30. Oversized Shirt', 'oversized', 'Slouchy drop-shoulder button-down in breezy cotton poplin.'),
  basePolo('shirt_slim_dress', '31. Slim Dress Shirt', 'slim', 'Back waist darts, structured collar, and French cuffs.'),
  basePolo('shirt_oxford', '32. Oxford Shirt', 'regular', 'Classic button-down collar Oxford cloth shirt.'),
  basePolo('shirt_flannel', '33. Flannel Shirt', 'relaxed', 'Heavy brushed cotton twin-pocket work shirt.'),
  basePolo('shirt_denim', '34. Denim Shirt', 'regular', 'Western front yokes, snap closures, and durable denim weave.'),
  basePolo('shirt_linen', '35. Linen Shirt', 'relaxed', 'Lightweight breathable pure flax linen casual shirt.'),

  // ==========================================
  // SECTION C: SWEATSHIRTS AND HOODIES (36-50)
  // ==========================================
  baseHoodie('hoodie_classic', '36. Classic Hoodie', 'regular', 'Front kangaroo pocket, drawstring hood, ribbed hem and cuffs.'),
  baseHoodie('hoodie_oversized', '37. Oversized Hoodie', 'oversized', 'Slouchy drop shoulders and roomy double-layer fleece hood.'),
  baseHoodie('hoodie_zip_up', '38. Zip-Up Hoodie', 'regular', 'Full-length metal center front zipper with split kangaroo pockets.'),
  baseHoodie('hoodie_pullover', '39. Pullover Hoodie', 'oversized', 'Heavyweight 450 GSM French terry hoodie with clean pouch.'),
  baseHoodie('hoodie_cropped', '40. Cropped Hoodie', 'cropped', 'Raw edge hem hitting high with oversized relaxed sleeves.'),
  baseHoodie('hoodie_sleeveless', '41. Sleeveless Hoodie', 'regular', 'Armhole raw edge cut with roomy hood for training.'),
  baseHoodie('hoodie_heavyweight', '42. Heavyweight Hoodie', 'oversized', '500 GSM ultra-dense brushed fleece with structured hood.'),
  baseHoodie('hoodie_boxy', '43. Boxy Hoodie', 'boxy', 'Square torso proportions with relaxed wide sleeve circumference.'),
  baseHoodie('hoodie_drop_shoulder', '44. Drop Shoulder Hoodie', 'drop-shoulder', 'Extended shoulder seam for effortless street silhouette.'),
  baseHoodie('sweatshirt_classic', '45. Classic Sweatshirt', 'regular', 'Crewneck fleece sweater with ribbed triangular V-insert at neck.'),
  baseHoodie('sweatshirt_oversized', '46. Oversized Sweatshirt', 'oversized', 'Heavy fleece crewneck with wide chest and drop shoulders.'),
  baseHoodie('sweatshirt_crewneck', '47. Crewneck Sweatshirt', 'regular', 'Ribbed collar, cuffs, and hem in durable 380 GSM loopback.'),
  baseHoodie('sweatshirt_half_zip', '48. Half-Zip Sweatshirt', 'relaxed', 'Stand collar with silver half zip puller.'),
  baseHoodie('sweatshirt_quarter_zip', '49. Quarter-Zip Sweatshirt', 'regular', 'Cadet collar with front quarter zipper closure.'),
  baseHoodie('sweatshirt_cropped', '50. Cropped Sweatshirt', 'cropped', 'Shortened body with wide ribbed waistband.'),

  // ==========================================
  // SECTION D: JACKETS AND OUTERWEAR (51-70)
  // ==========================================
  baseHoodie('jacket_bomber', '51. Bomber Jacket', 'relaxed', 'MA-1 flight jacket with ribbed collar, utility sleeve pocket, and zipper.'),
  baseHoodie('jacket_varsity', '52. Varsity Jacket', 'oversized', 'Wool body, contrast sleeves, striped ribbing, and snap front.'),
  baseHoodie('jacket_denim', '53. Denim Jacket', 'regular', 'Trucker jacket with front flap pockets, shank buttons, and waist tabs.'),
  baseHoodie('jacket_leather', '54. Leather Jacket', 'regular', 'Clean tailored lambskin leather zip jacket.'),
  baseHoodie('jacket_biker', '55. Biker Jacket', 'slim', 'Asymmetric zipper, wide notch lapels, and coin flap pocket.'),
  baseHoodie('jacket_harrington', '56. Harrington Jacket', 'regular', 'Stand collar with double button tab and Fraser tartan lining.'),
  baseHoodie('jacket_windbreaker', '57. Windbreaker', 'relaxed', 'Lightweight ripstop nylon with elastic toggle hem and hood.'),
  baseHoodie('jacket_track', '58. Track Jacket', 'regular', 'Contrast sleeve stripe piping with full zip closure.'),
  baseHoodie('jacket_coach', '59. Coach Jacket', 'relaxed', 'Point collar, snap button front, and drawstring waist.'),
  baseHoodie('jacket_puffer', '60. Puffer Jacket', 'oversized', 'Down quilted baffle chambers with funnel neck collar.'),
  baseHoodie('jacket_parka', '61. Parka', 'oversized', 'Fishtail parka with drawstring waist and storm flap.'),
  baseHoodie('jacket_trench_coat', '62. Trench Coat', 'regular', 'Double-breasted storm flap coat with waist buckle belt.'),
  baseHoodie('jacket_overcoat', '63. Overcoat', 'regular', 'Tailored wool topcoat with notched lapels and single vent.'),
  baseHoodie('jacket_blazer', '64. Blazer', 'regular', 'Structured 2-button blazer with patch pockets and chest welt.'),
  baseHoodie('jacket_suit_jacket', '65. Suit Jacket', 'slim', 'Tailored suit jacket with peak lapels and horn buttons.'),
  baseHoodie('jacket_utility', '66. Utility Jacket', 'relaxed', 'Four front cargo bellows pockets with hidden button placket.'),
  baseHoodie('jacket_workwear', '67. Workwear Jacket', 'regular', 'Heavy canvas chore coat with corduroy collar.'),
  baseHoodie('jacket_fleece', '68. Fleece Jacket', 'relaxed', 'High-pile Sherpa fleece with nylon chest zip pocket.'),
  baseHoodie('jacket_softshell', '69. Softshell Jacket', 'regular', 'Weather-resistant stretch bonded membrane jacket.'),
  baseHoodie('jacket_rain', '70. Rain Jacket', 'relaxed', 'Seam-sealed waterproof shell with adjustable peaked hood.'),

  // ==========================================
  // SECTION E: TANK TOPS AND SLEEVELESS (71-78)
  // ==========================================
  baseTee('tank_classic', '71. Classic Tank Top', 'regular', 'U-neck collar with self-bound armholes and scoop neckline.', 710, 500, 0),
  baseTee('tank_racerback', '72. Racerback Tank', 'slim', 'Tapered T-back back panel for shoulder blade mobility.', 690, 460, 0),
  baseTee('tank_muscle', '73. Muscle Tank', 'relaxed', 'Extended drop armhole with relaxed draped torso.', 720, 540, 0),
  baseTee('tank_stringer', '74. Stringer Tank', 'slim', 'Deep cut sides with narrow shoulder straps for bodybuilding.', 700, 450, 0),
  baseTee('tank_cropped', '75. Cropped Tank', 'cropped', 'Ribbed cropped sleeveless top hitting above midriff.', 480, 440, 0),
  baseTee('tank_ribbed', '76. Ribbed Tank', 'slim', '2x2 stretch cotton rib knit contouring the body.', 680, 430, 0),
  baseTee('tank_athletic', '77. Athletic Tank', 'regular', 'Moisture-wicking mesh jersey with reflective hem transfer.', 710, 510, 0),
  baseTee('tank_compression', '78. Compression Tank', 'slim', '4-way elastane support fit for high-intensity training.', 660, 420, 0),

  // ==========================================
  // SECTION F: PANTS AND TROUSERS (79-96)
  // ==========================================
  basePants('pants_straight_jeans', '79. Straight Fit Jeans', 'straight', '5-pocket classic straight leg cut in 13.5 oz denim.'),
  basePants('pants_slim_jeans', '80. Slim Fit Jeans', 'slim', 'Tapered leg profile fitted through hip and thigh.'),
  basePants('pants_skinny_jeans', '81. Skinny Jeans', 'slim', 'Close-fitting stretch denim through ankle.'),
  basePants('pants_relaxed_jeans', '82. Relaxed Jeans', 'relaxed', 'Roomy seat and thigh with straight leg fall.'),
  basePants('pants_baggy_jeans', '83. Baggy Jeans', 'baggy', '90s wide skateboard silhouette with puddle hem.'),
  basePants('pants_wide_leg_jeans', '84. Wide-Leg Jeans', 'baggy', 'Clean architectural wide leg from hip to sweep.'),
  basePants('pants_bootcut_jeans', '85. Bootcut Jeans', 'straight', 'Slight flare below knee to accommodate footwear.'),
  basePants('pants_flared_jeans', '86. Flared Jeans', 'relaxed', 'Dramatic bell flare opening from knee down.'),
  basePants('pants_cargo', '87. Cargo Pants', 'relaxed', 'Twin pleated side bellows cargo pockets and knee darts.'),
  basePants('pants_parachute', '88. Parachute Pants', 'baggy', 'Voluminous nylon with bungee hem cinches.'),
  basePants('pants_chino', '89. Chino Pants', 'straight', 'Flat front twill trousers with slant front pockets.'),
  basePants('pants_dress_trousers', '90. Dress Trousers', 'straight', 'Pressed center leg crease with hook-and-bar closure.'),
  basePants('pants_tailored', '91. Tailored Trousers', 'slim', 'Side waist adjusters with tapered cuffed hem.'),
  basePants('pants_track', '92. Track Pants', 'regular', 'Nylon training pants with ankle zips and side piping.'),
  basePants('pants_joggers', '93. Joggers', 'regular', 'Tapered fleece sweatpants with ribbed ankle cuffs.'),
  basePants('pants_sweatpants', '94. Sweatpants', 'relaxed', 'Relaxed heavyweight sweatpants with elasticated cuffs.'),
  basePants('pants_straight_trousers', '95. Straight Fit Trousers', 'straight', 'Clean minimal trousers in wool blend fabric.'),
  basePants('pants_wide_trousers', '96. Wide-Leg Trousers', 'baggy', 'High-waisted double pleated wide leg trousers.'),

  // ==========================================
  // SECTION G: SHORTS (97-106)
  // ==========================================
  basePants('shorts_denim', '97. Denim Shorts', 'regular', '5-pocket cut-off jean shorts with raw frayed hem.'),
  basePants('shorts_cargo', '98. Cargo Shorts', 'relaxed', 'Side cargo pockets with durable ripstop waistband.'),
  basePants('shorts_basketball', '99. Basketball Shorts', 'baggy', 'Breathable double-layer mesh with striped knit waistband.'),
  basePants('shorts_running', '100. Running Shorts', 'slim', 'Lightweight 5-inch inseam shorts with inner brief liner.'),
  basePants('shorts_athletic', '101. Athletic Shorts', 'regular', '4-way stretch gym training shorts with zipper pockets.'),
  basePants('shorts_bermuda', '102. Bermuda Shorts', 'straight', 'Tailored knee-length shorts with cuffed hem.'),
  basePants('shorts_chino', '103. Chino Shorts', 'regular', 'Clean casual twill shorts with 7-inch inseam.'),
  basePants('shorts_sweat', '104. Sweat Shorts', 'relaxed', 'Heavyweight French terry shorts with raw hem.'),
  basePants('shorts_board', '105. Board Shorts', 'regular', 'Quick-dry surf shorts with lace-up fly closure.'),
  basePants('shorts_cycling', '106. Cycling Shorts', 'slim', 'High-rise compression spandex shorts with leg grip.'),

  // ==========================================
  // SECTION H: ADDITIONAL CLOTHING (107-132)
  // ==========================================
  basePants('clothing_leggings', '107. Leggings', 'slim', 'Seamless stretch high-waist ankle-length leggings.'),
  basePants('clothing_compression_leggings', '108. Compression Leggings', 'slim', 'Targeted muscle support panels with flatlock stitching.'),
  basePants('clothing_yoga_pants', '109. Yoga Pants', 'relaxed', 'Foldover waistband with flared bootcut hem.'),
  basePants('clothing_skirt_basic', '110. Skirts', 'regular', 'Clean A-line cut skirt with concealed side zipper.'),
  basePants('clothing_skirt_pleated', '111. Pleated Skirt', 'regular', 'Uniform knife pleats with structured waistband.'),
  basePants('clothing_skirt_aline', '112. A-Line Skirt', 'regular', 'Classic flared A-silhouette hitting at the knee.'),
  basePants('clothing_skirt_maxi', '113. Maxi Skirt', 'relaxed', 'Full-length floor-grazing draped skirt.'),
  basePants('clothing_skirt_mini', '114. Mini Skirt', 'slim', 'High-rise structured mini skirt with front slit.'),
  baseTee('clothing_dress_midi', '115. Midi Dress', 'regular', 'Draped jersey dress falling below the knee.', 1100, 500, 220),
  baseTee('clothing_dress_maxi', '116. Maxi Dress', 'relaxed', 'Flowing ankle-length column dress.', 1350, 520, 220),
  basePolo('clothing_dress_shirt', '117. Shirt Dress', 'relaxed', 'Button-up collar dress with tie belt waist.'),
  baseTee('clothing_dress_bodycon', '118. Bodycon Dress', 'slim', 'Form-fitting stretch rib midi dress.', 1050, 440, 200),
  baseTee('clothing_dress_casual', '119. Casual Dress', 'relaxed', 'Everyday T-shirt dress with side seam pockets.', 950, 560, 230),
  baseHoodie('clothing_jumpsuit', '120. Jumpsuit', 'relaxed', 'One-piece boiler suit with belted waist and zipper front.'),
  baseHoodie('clothing_romper', '121. Romper', 'regular', 'One-piece short jumpsuit with elastic drawstring waist.'),
  baseTee('clothing_bodysuit', '122. Bodysuit', 'slim', 'Fitted stretch jersey bodysuit with snap bottom closure.', 720, 450, 200),
  baseHoodie('clothing_tracksuit_top', '123. Tracksuit Top', 'regular', 'Zip-front track jacket with contrast arm panels.'),
  basePants('clothing_tracksuit_bottom', '124. Tracksuit Bottom', 'regular', 'Matching athletic track pants with ankle zippers.'),
  baseTee('clothing_sports_jersey', '125. Sports Jersey', 'oversized', 'V-neck mesh athletic jersey with sleeve banding.', 760, 600, 250),
  baseTee('clothing_basketball_jersey', '126. Basketball Jersey', 'oversized', 'Wide armhole sleeveless tank with ribbed trim.', 780, 580, 0),
  baseTee('clothing_football_jersey', '127. Football Jersey', 'oversized', 'Drop-shoulder reinforced yoke jersey for pads.', 770, 620, 260),
  baseTee('clothing_cycling_jersey', '128. Cycling Jersey', 'slim', 'Form-fitting aerodynamic top with 3 rear pockets.', 680, 460, 210),
  baseTee('clothing_scrub_top', '129. Scrub Top', 'regular', 'Medical V-neck top with twin chest and waist pockets.', 720, 540, 220),
  basePants('clothing_scrub_pants', '130. Scrub Pants', 'regular', 'Straight-leg medical pants with cargo pocket and drawstring.'),
  baseTee('clothing_apron', '131. Apron', 'regular', 'Bib work apron with adjustable neck strap and front pockets.', 850, 650, 0),
  baseHoodie('clothing_coverall', '132. Workwear Coverall', 'relaxed', 'Heavy drill protective coverall with action back pleats.'),
];

export function getTemplateById(id: string): GarmentTemplate {
  return GARMENT_TEMPLATES.find((t) => t.id === id) || GARMENT_TEMPLATES[0];
}
