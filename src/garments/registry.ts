/**
 * THREADCAD 132-GARMENT MASTER REGISTRY
 * Imports all 132 garments directly from their dedicated individual folders.
 */

import { GarmentTemplate } from '../types/garment';

import { garment as g1 } from './t-shirts/regular-fit';
import { garment as g2 } from './t-shirts/oversized';
import { garment as g3 } from './t-shirts/boxy-fit';
import { garment as g4 } from './t-shirts/drop-shoulder';
import { garment as g5 } from './t-shirts/slim-fit';
import { garment as g6 } from './t-shirts/relaxed-fit';
import { garment as g7 } from './t-shirts/longline';
import { garment as g8 } from './t-shirts/cropped';
import { garment as g9 } from './t-shirts/baby-tee';
import { garment as g10 } from './t-shirts/v-neck';
import { garment as g11 } from './t-shirts/deep-vneck';
import { garment as g12 } from './t-shirts/crew-neck';
import { garment as g13 } from './t-shirts/scoop-neck';
import { garment as g14 } from './t-shirts/ringer';
import { garment as g15 } from './t-shirts/raglan';
import { garment as g16 } from './t-shirts/baseball';
import { garment as g17 } from './t-shirts/pocket';
import { garment as g18 } from './t-shirts/graphic';
import { garment as g19 } from './t-shirts/heavyweight';
import { garment as g20 } from './t-shirts/sleeveless';
import { garment as g21 } from './polos-and-shirts/classic-polo';
import { garment as g22 } from './polos-and-shirts/oversized-polo';
import { garment as g23 } from './polos-and-shirts/slim-polo';
import { garment as g24 } from './polos-and-shirts/long-sleeve-polo';
import { garment as g25 } from './polos-and-shirts/rugby-shirt';
import { garment as g26 } from './polos-and-shirts/henley-shirt';
import { garment as g27 } from './polos-and-shirts/cuban-collar-shirt';
import { garment as g28 } from './polos-and-shirts/camp-collar-shirt';
import { garment as g29 } from './polos-and-shirts/casual-button-up';
import { garment as g30 } from './polos-and-shirts/oversized-shirt';
import { garment as g31 } from './polos-and-shirts/slim-dress-shirt';
import { garment as g32 } from './polos-and-shirts/oxford-shirt';
import { garment as g33 } from './polos-and-shirts/flannel-shirt';
import { garment as g34 } from './polos-and-shirts/denim-shirt';
import { garment as g35 } from './polos-and-shirts/linen-shirt';
import { garment as g36 } from './hoodies-and-sweats/classic-hoodie';
import { garment as g37 } from './hoodies-and-sweats/oversized-hoodie';
import { garment as g38 } from './hoodies-and-sweats/zip-up-hoodie';
import { garment as g39 } from './hoodies-and-sweats/pullover-hoodie';
import { garment as g40 } from './hoodies-and-sweats/cropped-hoodie';
import { garment as g41 } from './hoodies-and-sweats/sleeveless-hoodie';
import { garment as g42 } from './hoodies-and-sweats/heavyweight-hoodie';
import { garment as g43 } from './hoodies-and-sweats/boxy-hoodie';
import { garment as g44 } from './hoodies-and-sweats/drop-shoulder-hoodie';
import { garment as g45 } from './hoodies-and-sweats/classic-sweatshirt';
import { garment as g46 } from './hoodies-and-sweats/oversized-sweatshirt';
import { garment as g47 } from './hoodies-and-sweats/crewneck-sweatshirt';
import { garment as g48 } from './hoodies-and-sweats/half-zip-sweatshirt';
import { garment as g49 } from './hoodies-and-sweats/quarter-zip-sweatshirt';
import { garment as g50 } from './hoodies-and-sweats/cropped-sweatshirt';
import { garment as g51 } from './jackets-and-outerwear/bomber-jacket';
import { garment as g52 } from './jackets-and-outerwear/varsity-jacket';
import { garment as g53 } from './jackets-and-outerwear/denim-jacket';
import { garment as g54 } from './jackets-and-outerwear/leather-jacket';
import { garment as g55 } from './jackets-and-outerwear/biker-jacket';
import { garment as g56 } from './jackets-and-outerwear/harrington-jacket';
import { garment as g57 } from './jackets-and-outerwear/windbreaker';
import { garment as g58 } from './jackets-and-outerwear/track-jacket';
import { garment as g59 } from './jackets-and-outerwear/coach-jacket';
import { garment as g60 } from './jackets-and-outerwear/puffer-jacket';
import { garment as g61 } from './jackets-and-outerwear/parka';
import { garment as g62 } from './jackets-and-outerwear/trench-coat';
import { garment as g63 } from './jackets-and-outerwear/overcoat';
import { garment as g64 } from './jackets-and-outerwear/blazer';
import { garment as g65 } from './jackets-and-outerwear/suit-jacket';
import { garment as g66 } from './jackets-and-outerwear/utility-jacket';
import { garment as g67 } from './jackets-and-outerwear/workwear-jacket';
import { garment as g68 } from './jackets-and-outerwear/fleece-jacket';
import { garment as g69 } from './jackets-and-outerwear/softshell-jacket';
import { garment as g70 } from './jackets-and-outerwear/rain-jacket';
import { garment as g71 } from './tank-tops/classic-tank';
import { garment as g72 } from './tank-tops/racerback-tank';
import { garment as g73 } from './tank-tops/muscle-tank';
import { garment as g74 } from './tank-tops/stringer-tank';
import { garment as g75 } from './tank-tops/cropped-tank';
import { garment as g76 } from './tank-tops/ribbed-tank';
import { garment as g77 } from './tank-tops/athletic-tank';
import { garment as g78 } from './tank-tops/compression-tank';
import { garment as g79 } from './pants-and-trousers/straight-jeans';
import { garment as g80 } from './pants-and-trousers/slim-jeans';
import { garment as g81 } from './pants-and-trousers/skinny-jeans';
import { garment as g82 } from './pants-and-trousers/relaxed-jeans';
import { garment as g83 } from './pants-and-trousers/baggy-jeans';
import { garment as g84 } from './pants-and-trousers/wide-leg-jeans';
import { garment as g85 } from './pants-and-trousers/bootcut-jeans';
import { garment as g86 } from './pants-and-trousers/flared-jeans';
import { garment as g87 } from './pants-and-trousers/cargo-pants';
import { garment as g88 } from './pants-and-trousers/parachute-pants';
import { garment as g89 } from './pants-and-trousers/chino-pants';
import { garment as g90 } from './pants-and-trousers/dress-trousers';
import { garment as g91 } from './pants-and-trousers/tailored-trousers';
import { garment as g92 } from './pants-and-trousers/track-pants';
import { garment as g93 } from './pants-and-trousers/joggers';
import { garment as g94 } from './pants-and-trousers/sweatpants';
import { garment as g95 } from './pants-and-trousers/straight-trousers';
import { garment as g96 } from './pants-and-trousers/wide-trousers';
import { garment as g97 } from './shorts/denim-shorts';
import { garment as g98 } from './shorts/cargo-shorts';
import { garment as g99 } from './shorts/basketball-shorts';
import { garment as g100 } from './shorts/running-shorts';
import { garment as g101 } from './shorts/athletic-shorts';
import { garment as g102 } from './shorts/bermuda-shorts';
import { garment as g103 } from './shorts/chino-shorts';
import { garment as g104 } from './shorts/sweat-shorts';
import { garment as g105 } from './shorts/board-shorts';
import { garment as g106 } from './shorts/cycling-shorts';
import { garment as g107 } from './dresses-skirts-and-other/leggings';
import { garment as g108 } from './dresses-skirts-and-other/compression-leggings';
import { garment as g109 } from './dresses-skirts-and-other/yoga-pants';
import { garment as g110 } from './dresses-skirts-and-other/skirts-basic';
import { garment as g111 } from './dresses-skirts-and-other/pleated-skirt';
import { garment as g112 } from './dresses-skirts-and-other/aline-skirt';
import { garment as g113 } from './dresses-skirts-and-other/maxi-skirt';
import { garment as g114 } from './dresses-skirts-and-other/mini-skirt';
import { garment as g115 } from './dresses-skirts-and-other/midi-dress';
import { garment as g116 } from './dresses-skirts-and-other/maxi-dress';
import { garment as g117 } from './dresses-skirts-and-other/shirt-dress';
import { garment as g118 } from './dresses-skirts-and-other/bodycon-dress';
import { garment as g119 } from './dresses-skirts-and-other/casual-dress';
import { garment as g120 } from './dresses-skirts-and-other/jumpsuit';
import { garment as g121 } from './dresses-skirts-and-other/romper';
import { garment as g122 } from './dresses-skirts-and-other/bodysuit';
import { garment as g123 } from './dresses-skirts-and-other/tracksuit-top';
import { garment as g124 } from './dresses-skirts-and-other/tracksuit-bottom';
import { garment as g125 } from './dresses-skirts-and-other/sports-jersey';
import { garment as g126 } from './dresses-skirts-and-other/basketball-jersey';
import { garment as g127 } from './dresses-skirts-and-other/football-jersey';
import { garment as g128 } from './dresses-skirts-and-other/cycling-jersey';
import { garment as g129 } from './dresses-skirts-and-other/scrub-top';
import { garment as g130 } from './dresses-skirts-and-other/scrub-pants';
import { garment as g131 } from './dresses-skirts-and-other/apron';
import { garment as g132 } from './dresses-skirts-and-other/workwear-coverall';

export const ALL_GARMENTS: GarmentTemplate[] = [
  g1,
  g2,
  g3,
  g4,
  g5,
  g6,
  g7,
  g8,
  g9,
  g10,
  g11,
  g12,
  g13,
  g14,
  g15,
  g16,
  g17,
  g18,
  g19,
  g20,
  g21,
  g22,
  g23,
  g24,
  g25,
  g26,
  g27,
  g28,
  g29,
  g30,
  g31,
  g32,
  g33,
  g34,
  g35,
  g36,
  g37,
  g38,
  g39,
  g40,
  g41,
  g42,
  g43,
  g44,
  g45,
  g46,
  g47,
  g48,
  g49,
  g50,
  g51,
  g52,
  g53,
  g54,
  g55,
  g56,
  g57,
  g58,
  g59,
  g60,
  g61,
  g62,
  g63,
  g64,
  g65,
  g66,
  g67,
  g68,
  g69,
  g70,
  g71,
  g72,
  g73,
  g74,
  g75,
  g76,
  g77,
  g78,
  g79,
  g80,
  g81,
  g82,
  g83,
  g84,
  g85,
  g86,
  g87,
  g88,
  g89,
  g90,
  g91,
  g92,
  g93,
  g94,
  g95,
  g96,
  g97,
  g98,
  g99,
  g100,
  g101,
  g102,
  g103,
  g104,
  g105,
  g106,
  g107,
  g108,
  g109,
  g110,
  g111,
  g112,
  g113,
  g114,
  g115,
  g116,
  g117,
  g118,
  g119,
  g120,
  g121,
  g122,
  g123,
  g124,
  g125,
  g126,
  g127,
  g128,
  g129,
  g130,
  g131,
  g132,
];
