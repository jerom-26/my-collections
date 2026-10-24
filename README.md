
# Personal Collectibles

A stylized, interactive collector’s bedroom built with the existing React, TypeScript, Vite, Three.js, React Three Fiber, and Drei stack.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). A browser with WebGL and hardware acceleration is required. All room assets are procedural and local; the scene does not fetch models, HDR environments, fonts, or textures from a CDN.

```sh
npm run build   # TypeScript validation and production build
npm run lint    # ESLint
npm run preview # Serve the production build locally
```

## Explore the room

- Drag with the left mouse button to orbit; scroll to zoom.
- Right-drag or Shift-drag to pan.
- On touch screens, use one finger to orbit and two fingers to zoom/pan.
- Use **Reset camera** to return to the initial view.
- Toggle **Warm evening** / **Soft daylight** to compare lighting.
- Use the **?** control for camera instructions.

The camera can orbit around the room, with a limited vertical angle to keep it above the floor. The two walls are solid, so they naturally obscure the interior from behind. Reset returns to the open dollhouse view. Resizing also reframes the camera to fit the viewport.

## Scene structure

| File | Responsibility |
| --- | --- |
| `src/App.tsx` | Responsive viewer, lighting state, reset/help controls, WebGL error fallback |
| `src/Bed.tsx` | Existing bed expanded with a low wooden platform, slatted headboard, mattress, pillows, stitched comforter, and throw |
| `src/components/room/RoomScene.tsx` | Scene composition, responsive camera framing, OrbitControls, contact shadows |
| `src/components/room/Room.tsx` | 8 × 8 floor, staggered planks, two walls, trims, and ground shadow |
| `src/components/room/Workstation.tsx` | L-shaped desk, monitor/laptop, keyboard/mouse, tower, speakers, drawers, and chair |
| `src/components/room/Displays.tsx` | Glass-front cabinet, carded display grid, and floating model shelves |
| `src/types/collectibles.ts` | Collectible metadata, display IDs, and slot assignment types |
| `src/data/sampleCollectibles.ts` | 35 explicitly labeled sample records with stable IDs and placeholder colors |
| `src/data/displayAssignments.ts` | Slot-to-record assignments and safe reference resolution |
| `src/components/room/displayLayout.ts` | Stable physical slot IDs, local transforms, and shared shelf heights |
| `src/components/room/CollectibleItem.tsx` | Procedural car and carded packaging rendering, independent of inventory lookup |
| `src/components/room/Decorations.tsx` | Rug, plants, bedside storage/lamp, and small decorative details |
| `src/components/room/Lighting.tsx` | Ambient/key/accent lights and a locally rendered environment for reflections |
| `src/components/room/Primitives.tsx` | Reusable box, placeholder diecast car, and plant geometry |
| `src/components/room/Artwork.tsx` | Shared canvas textures for original artwork, packaging, screens, rug, and wood grain |
| `src/components/room/palette.ts` | Shared furniture and architectural colors |
| `src/App.css`, `src/index.css` | Viewer styling, responsive layout, and global styles |
| `index.html`, `public/room-mark.svg` | Page metadata and room favicon |

## Collectible records and display slots

The displays now separate **what an item is**, **where it goes**, and **how it is drawn**. The initial data contains 35 sample cars: 8 cabinet cars, 15 carded cars, and 6 cars on each of the two loose-model shelf groups. Their original colors, local positions, scales, and packaging are preserved. The separate decorative car on the workstation is unchanged and is not part of these records.

`Collectible` records contain `id`, `name`, `category`, `manufacturer`, `edition`, `color`, `isSample`, and optional `imageUrl` / `modelUrl` references. Current manufacturer and edition values are explicitly sample metadata, not claims about a real collection. The renderer continues using the existing procedural car; image and model references are metadata only and do not trigger asset downloads.

To add another sample car, add a record to `src/data/sampleCollectibles.ts`, using a new stable ID:

```ts
{ ...sampleDetails, id: 'sample-car-36', name: 'Sample diecast car 36', color: '#5e8794' },
```

Then place it by changing an existing slot's value in `src/data/displayAssignments.ts`:

```ts
'cabinet:shelf-1-left': 'sample-car-36',
```

The replaced record remains in the catalog but is no longer displayed. Records do not need an assignment. Reordering records does not change their placement, and replacing an assignment does not require editing shelf geometry. Adding more physical capacity is a separate layout change.

Slots have display-prefixed IDs such as `cabinet:shelf-1-left`, `card-wall:row-1-slot-1`, `back-model-shelves:shelf-1-left`, and `left-model-shelves:shelf-1-left`. Shelf numbers run bottom to top; card rows run top to bottom. Keep these IDs when reordering layout configuration or adjusting coordinates. The two loose-model shelf groups have separate prefixes so their IDs never overlap.

Omit an assignment or set it to `null` to empty a slot. A missing record also leaves its slot empty, with a development-console diagnostic. Shelves, cabinet glass, lighting, and card mounting clips remain; an empty card slot has no collectible, backing card, or plastic bubble. Unknown slot references are ignored. Duplicate record IDs keep the first record, and assigning the same record more than once leaves later placements empty. Duplicate physical slot IDs are reported as layout errors. A slot-keyed assignment object permits only one record per slot.

Assignment resolution is a pure function, run once for the static scene data. It returns resolved records and diagnostics without adding React state, persistence, or a backend. `CollectibleItem` receives a resolved record plus presentation and scale; it returns nothing for an empty or missing record. Future asset rendering can be added there without changing shelves.

## Design and performance

Scene units express a visual 8 × 8 footprint, rather than measured physical dimensions. The bed occupies the front-right area, the workstation the back-left corner, and the display cabinet the left wall. Warm oak, sage plaster, slate bedding, and terracotta accents follow the supplied miniature-room reference.

Geometry uses low-segment primitives and rounded boxes where softness matters. Canvas textures are created once per scene and shared between repeated objects. The renderer caps device pixel ratio at 1.75, renders on demand, uses one shadow-casting key light, and captures contact shadows and the reflection environment once. Accent point lights do not cast shadows. No dependencies were added.

## Prototype boundaries

- Cars and carded packaging are visual placeholders; the generic collector artwork is original procedural artwork, not Hot Wheels branding.
- Objects are static. Collectible selection, editing, persistent inventory, and cabinet-door animation are future work.
- The cabinet uses inexpensive transparent surfaces instead of physically accurate glass refraction. Overlapping transparent surfaces may show sorting artifacts at extreme angles.
- Bedding is stylized geometry, without cloth simulation.
- Real-time 3D remains GPU-dependent. Lower-powered mobile devices may need a lower pixel-ratio cap or instanced collectible geometry as the collection grows.
- Vite reports a large-bundle advisory because the prototype includes the Three.js renderer and scene tools. Production bundle splitting can be considered in a later optimization pass.
- The installed React Three Fiber / Three.js combination may log a non-blocking `THREE.Clock` deprecation warning. No dependency upgrades are included in this visual iteration.

There is no backend, authentication, blockchain/NFT functionality, external hardware integration, or marketplace integration.
