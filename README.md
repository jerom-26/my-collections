
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
| `src/components/room/Decorations.tsx` | Rug, plants, bedside storage/lamp, and small decorative details |
| `src/components/room/Lighting.tsx` | Ambient/key/accent lights and a locally rendered environment for reflections |
| `src/components/room/Primitives.tsx` | Reusable box, placeholder diecast car, and plant geometry |
| `src/components/room/Artwork.tsx` | Shared canvas textures for original artwork, packaging, screens, rug, and wood grain |
| `src/components/room/palette.ts` | Shared furniture and architectural colors |
| `src/App.css`, `src/index.css` | Viewer styling, responsive layout, and global styles |
| `index.html`, `public/room-mark.svg` | Page metadata and room favicon |

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
