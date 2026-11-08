# Physical collectibles

Inventory lives in `src/data/physicalCollectibles.ts`, combined with sample and WAX
records by the existing `App`. Inventory has no room coordinates. The three Hot
Wheels records include the owner's inventory number, ownership, packaging type,
release year and verified product metadata. They have no WAX metadata or API link.
All 35 original sample records remain available; replaced records are unassigned.

| Cabinet slot | Item | Replaced sample |
| --- | --- | --- |
| `cabinet:shelf-4-left` | Batman Beyond #458 Transparent Chase | 07 (previous iteration) |
| `cabinet:shelf-4-right` | #40 ’69 Chevelle SS 396, NFT Garage Series 6 #28, HWW87 | 08 |
| `cabinet:shelf-3-left` | #6 Alfa Romeo 155 V6 TI, 2024 Collector Edition, HTF96 | 05 |
| `cabinet:shelf-3-right` | #11 Robert Lewandowski × 1997 Porsche 911 GT1, JWT48 | 06 |
| `cabinet:shelf-2-left` | Thor Comic Cover, Pop! Comic Covers #09 | 03 |
| `cabinet:shelf-2-right` | Mattel Brick Shop Cadillac Project GTP Hypercar | 04 |

`displayAssignments.ts` contains the placement links. `collectiblePresentations.ts`
contains packaging renderer choices, dimensions and artwork face coordinates.
`CollectibleItem` selects those renderers and uses the same dimensions for picking
and selection outlines. Missing slots/records keep the existing empty-slot behavior.
Physical packaging is independent of the slot's default loose-car presentation;
other placeholder cars and WAX artwork keep their existing renderers.

`ClamshellCollectible` renders an upright card with a raised blister and separate
transparent protective case. It uses inexpensive standard materials and edge
highlights, without transmission render targets or additional lights. The 0.36 ×
0.55 × 0.14 scene-unit shell fits below the next shelf with about 0.0375 units of
clearance. Both cards use the product photographs supplied by the owner, replacing
the original temporary illustrations. The records' normalized `imageCrop` trims
the white margins consistently in the 3D textures and details panel while keeping
the original images unchanged and preserving each card's aspect ratio. Temporary
artwork notices are no longer shown. Shelf geometry and assignments are unchanged.

`PremiumBoxCollectible` is an upright 0.38 × 0.48 × 0.28 box. Its front/right faces
sample only the corresponding quadrilaterals of the supplied Porsche reference,
using a subdivided plane's UV coordinates. The complete perspective photograph
is shown in the details panel. Unsupplied faces use solid materials. The box has
a red top, white front, black sides and a simplified procedural red/white/black
Porsche with rear wing and number 9 on top. This is a stylized approximation of
the model, not an exact manufacturer 3D asset. Total height is 0.58, leaving
about 0.0075 units below the next shelf in its current third-shelf position;
front glass clearance is 0.19. The Chevelle occupies the top-right slot beside
Batman after the owner's requested swap. Neither item was resized.
The car and box share one inventory ID, click target and outline.

Thor and Cadillac use the existing `BoxedCollectible` through a `kind: 'box'`
presentation entry. The renderer accepts optional body color and protector
settings; its defaults preserve Batman's previous appearance. Thor is an upright
0.37 × 0.55 × 0.23 scene-unit display case with its supplied front photo. Cadillac
is a horizontal 0.76 × 0.44 × 0.22 retail box with a dark-blue body and no outer
protector. Artwork proportions match the cropped product photos. No new box
renderer or dependencies were needed. Both bases are offset down by 0.0175 from
the original car anchors to rest on the actual shelf surface; hit boxes and
highlights use the same offset. Neither slot's saved coordinates changed.

Thor has about 0.055 units of clearance below the next shelf, and Cadillac has
0.165; both stay inside the frame, back and front glass. Cadillac's nearest side
frame clearance is about 0.0475 units. Only the two original sample links changed;
the sample records are retained unassigned. Thor's comic/franchise/character/box
number and Cadillac's line/vehicle/piece count/age rating appear in the existing
details panel. Missing release years or inventory numbers remain unspecified.
The supplied images and their provenance are stored in
`public/collectibles/thor-comic-cover-09/` and
`public/collectibles/cadillac-project-gtp-hypercar/`.

The details artwork grid uses a shrinkable column so landscape photos fit the
panel instead of causing horizontal overflow. This was verified with the full
Cadillac packaging image on desktop and at a 390 × 844 mobile viewport.

`CollectibleArtworkFace` reuses `useCollectibleArtwork` for still-image loading,
cancellation and failure handling. It releases its textures/geometries on change
or unmount. Ordinary card artwork retains its aspect ratio. Loading or failed
images show readable status textures, and the physical object remains selectable.
No media decoder, model loader, additional dependency or backend is introduced.

Batman retains its exact existing record, photo crop, slot and `BoxedCollectible`
renderer. Its 0.38 × 0.52 × 0.28 box, Chase sticker and photo are unchanged.
The WAX integration, seven poster assets, wall assignments, cabinet/shelf geometry,
workstation, furniture, lighting and camera/gesture handlers are unchanged.

Sources and artwork limitations are documented in
`public/collectibles/physical-hot-wheels/README.md`. No online product photographs
were downloaded or hotlinked. The supplied Porsche reference is preserved
unchanged; no general reuse license is claimed.

Validation:

- `npm run build`, `npm run lint`, `node --test tests/collectibles.test.mjs` (13 tests).
- Tests check exactly three new physical records, unique IDs, approved placements,
  Thor/Cadillac replacements and metadata, retained sample data, unchanged other assignments, local artwork, WAX separation
  and clearance against the actual shelf/roof/back/glass/frame dimensions.
- Browser verification: each new item opens its correct panel on desktop and a
  390 × 844 mobile viewport; supplied product artwork loads without temporary labels;
  highlighting, close button and Escape work; mobile metadata scrolls and has no
  horizontal overflow. All six physical records and a live WAX card remain selectable,
  with seven WAX cards loaded. Lighting toggle, orbit/zoom/reset work; dragging from a
  collectible does not open its panel. No console errors were observed.
- Updated-photo screenshots: `hot-wheels-real-artwork-desktop.jpg` and
  `hot-wheels-real-artwork-mobile.jpg` in the session visualization directory.
  Thor/Cadillac screenshots: `thor-cadillac-desktop.jpg`,
  `thor-cadillac-thor-details.jpg`, `thor-mobile.jpg`, `cadillac-mobile.jpg`.
  Physical touch hardware was not available; mobile testing used a narrow viewport.
- Build retains the existing large-bundle advisory. Browser logs also include the
  library's existing Three.Clock deprecation and a graphics-driver precision warning.

Changed or added files for v0.6:

1. `src/types/collectibles.ts`
2. `src/data/physicalCollectibles.ts`
3. `src/data/displayAssignments.ts`
4. `src/data/collectiblePresentations.ts` (new)
5. `src/components/room/CollectibleItem.tsx`
6. `src/components/room/ClamshellCollectible.tsx` (new)
7. `src/components/room/PremiumBoxCollectible.tsx` (new)
8. `src/components/room/CollectibleArtworkFace.tsx` (new)
9. `src/components/CollectibleDetails.tsx`
10. `public/collectibles/physical-hot-wheels/alfa-romeo-155-v6-ti.png` (replaces temporary SVG)
11. `public/collectibles/physical-hot-wheels/chevelle-ss-396-series-6.png` (replaces temporary SVG)
12. `public/collectibles/physical-hot-wheels/porsche-reference.png` (new)
13. `public/collectibles/physical-hot-wheels/README.md` (new)
14. `tests/collectibles.test.mjs`
15. `docs/physical-collectibles.md`

Files changed or added for the Thor/Cadillac update (existing pending changes retained):

1. `src/types/collectibles.ts`
2. `src/data/physicalCollectibles.ts`
3. `src/data/displayAssignments.ts`
4. `src/data/collectiblePresentations.ts`
5. `src/components/room/BoxedCollectible.tsx`
6. `src/components/room/CollectibleItem.tsx`
7. `src/components/CollectibleDetails.tsx`
8. `src/App.css`
9. `tests/collectibles.test.mjs`
10. `docs/physical-collectibles.md`
11. `public/collectibles/thor-comic-cover-09/product-reference.png` (new)
12. `public/collectibles/thor-comic-cover-09/README.md` (new)
13. `public/collectibles/cadillac-project-gtp-hypercar/product-reference.png` (new)
14. `public/collectibles/cadillac-project-gtp-hypercar/README.md` (new)
