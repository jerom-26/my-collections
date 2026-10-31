# Physical collectibles

Local records live in `src/data/physicalCollectibles.ts` and are combined with
sample and WAX records in `App`. Records contain no room coordinates. A record
with `representation: 'boxed'` uses the reusable `BoxedCollectible` renderer;
cars and NFT cards keep their existing renderers.

Batman Beyond #458 (Transparent Chase) occupies `cabinet:shelf-4-left`, formerly
sample-car-07. The sample record is retained but unassigned. Every other display
assignment and all shelf/room geometry remain unchanged.

The box uses a 0.38 × 0.52 × 0.28 scene-unit body and protector, standing upright
in the cabinet's existing coordinate frame. Its front points along the cabinet's
local +Z direction, through the glass toward the room. The selection hit box and
outline match its physical dimensions rather than the old car's dimensions.

The uploaded JPEG stays unchanged. `imageCrop` selects a normalized rectangle
from its front face, used consistently by the 3D texture and HTML details image.
Both preserve the cropped image's aspect ratio. Loading/cancellation and image
failures use the shared `useCollectibleArtwork` and `collectibleMedia` helpers.
The box front shows a loading/unavailable label if its photograph cannot load;
the box remains selectable and the details panel also reports the failure.

Product metadata is grounded in the owner's photograph and the official Funko
listing linked in the asset's README. The visible Chase sticker is preserved;
the record does not claim an additional retailer-exclusive sticker or a blue
edition. The photo retains its original lighting, glare and partial hand edge.

No backend, dependencies, character-model framework or additional cabinet is
introduced. To add another boxed item, add its local record and assign its ID to
an existing suitable slot. The current box size is intended for standard boxes;
oversized products need a deliberate fit review.

Checks: `npm run build`, `npm run lint`, `node --test tests/collectibles.test.mjs`.

Changed files: `types/collectibles.ts` adds optional media/product fields;
`data/physicalCollectibles.ts` supplies the local record; `data/displayAssignments.ts`
changes one link; `App.tsx` includes physical records. `CollectibleItem.tsx` selects
the new `BoxedCollectible.tsx` renderer and matching hit bounds. `CollectibleDetails.tsx`
and two rules in `App.css` show the photo crop and metadata. The existing image hook
and service were renamed to `useCollectibleArtwork.ts` and `collectibleMedia.ts`;
`NftArtwork.tsx` only changes that import/call name. Tests, asset provenance and
the WAX documentation references were updated accordingly.

Browser verification covered the actual cabinet slot, visible photo and Chase
sticker, neighboring car selection, WAX card selection, camera drag/zoom/reset,
close/Escape, and a 390×844 mobile viewport with scrolling metadata. The box
stays inside the cabinet with approximately 0.09 scene units of roof clearance
and 0.19 units between its front and the glass. Physical touch hardware was not
available for testing.
The audit also forced the product photo to fail in a temporary test page: the
box remained selectable, the details reported unavailable artwork, and restoring
the normal page loaded the original photo again. The test page was removed.
