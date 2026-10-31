# WAX wall cards

The existing 15-slot card wall displays public `hotwheels` assets owned by
`passionfruti`. The browser queries AtomicAssets directly; no wallet connection,
signing or server is involved. Each reload fetches current ownership. A retry
button is available if the API times out or fails.

Fetching and normalization live in `src/services/wax.ts`, adapted from
`jerom-26/collectible-showcase` at commit
`f0b98ef0738faa13ae7d8237f759bd05c7d43d6e`:

- `app/api/wax-assets/route.ts`: validation, metadata and IPFS references.
- `lib/collection.ts`: series and mint labels.
- `lib/nft-media.ts`: image loading, cancellation and timeouts.
- `lib/nft-posters.json` and `public/nft-posters`: seven existing JPEG previews.

The previews are real frames of the NFT artwork, keyed by video URL, not an
inventory snapshot. Ownership and names always come from the API. A metadata
front image takes precedence over the matching saved preview. Video URLs are
retained as metadata; videos are never downloaded or decoded by this feature.
A video-only NFT without a saved preview, or unreachable image media, leaves a
selectable card marked “Artwork unavailable”; it does not block the scene.

Records have no room coordinates. `App` combines records, composes wall-only
assignments and resolves them against the unchanged slot layout. The renderer
receives those contents. Stable `wax:<asset_id>` identifiers connect cards to
the existing selection panel. Asset IDs remain strings, including when sorting
with `BigInt`. API order never changes collectible identity.

The board shows at most 15 assets, ordered by descending asset ID, from the
API's first 100 records. This feature is a wall display, not a complete inventory
browser. Unused slots stay empty. All 35 sample records and all non-wall sample
assignments are retained.

AtomicAssets availability/indexing and image gateway CORS remain external
constraints. The bundled previews avoid gateway downloads for the seven known
video artworks. Newly acquired NFTs may reorder wall placement on reload.

Validation: `npm run build`, `npm run lint`, and
`node --test tests/collectibles.test.mjs`.

## File map

- `src/types/collectibles.ts`: optional WAX metadata and unknown descriptive fields.
- `src/services/wax.ts`, `src/hooks/useWaxCollectibles.ts`: API access and React request state.
- `src/data/displayAssignments.ts`: compose wall-only assignments.
- `src/App.tsx`, `src/components/room/RoomScene.tsx`: pass resolved contents to the scene and keep selected IDs in React.
- `src/components/room/Displays.tsx`, `CollectibleItem.tsx`, `NftArtwork.tsx`: physical displays and static card rendering.
- `src/services/nftMedia.ts`, `src/hooks/useNftArtwork.ts`: bounded still-image requests and cancellation.
- `src/components/CollectibleDetails.tsx`, `src/App.css`: NFT artwork, metadata, explorer link and request status.
- `src/data/waxPosters.json`, `public/nft-posters/*.jpg`: preview mapping and seven reused artwork frames.
- `tests/collectibles.test.mjs`: metadata, precision, assignments, API/media failures and preview files.

Browser checks covered all seven NFT selections, empty slots, cabinet selection,
camera drag versus click, modified clicks, zoom/reset, lighting, close/Escape,
390×844 layout, metadata scrolling, API failure, retry recovery and an empty
collection. API failure/empty responses were supplied through a temporary browser
test page, removed after validation. Physical touch/pinch hardware was not tested.
AtomicHub's external security verification prevented automated inspection of its
asset page; the generated link uses the validated asset ID and the previous
project's WAX mainnet URL format.
