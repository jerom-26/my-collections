import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFile } from 'node:fs/promises'
import { parseWaxAssets, resolveMediaUrl, fetchWaxCollectibles } from '../src/services/wax.ts'
import { assignWallCollectibles, displayAssignments, resolveDisplayContents } from '../src/data/displayAssignments.ts'
import { sampleCollectibles } from '../src/data/sampleCollectibles.ts'
import { physicalCollectibles } from '../src/data/physicalCollectibles.ts'
import { cabinetSlots, cabinetShelves, cardSlots, displaySlots, modelSlots, modelShelfLevels } from '../src/components/room/displayLayout.ts'
import { collectiblePresentations } from '../src/data/collectiblePresentations.ts'
import { loadStaticArtwork } from '../src/services/collectibleMedia.ts'

// Synthetic parser fixtures are test data, never inventory shown in the room.
const video = 'QmUARJedfNNefhpFT3G43GwUJTWoJ5XqrPTw1iJB88dbWE/NFTs/HW%20Dream%20Garage/HWPaganiZondaRBASE34.mp4'
const fixture = (id = '9007199254740993001') => ({
  asset_id: id, owner: 'passionfruti', collection: { collection_name: 'hotwheels' },
  schema: { schema_name: 'series3' }, template_mint: '0',
  template: { template_id: '123', max_supply: '0', immutable_data: {
    name: 'Parser fixture', video, model: 'Fixture model', rarity: 'Fixture rarity',
  } },
})

test('parses metadata without inventing manufacturer/color; matches a real media preview', () => {
  const [asset] = parseWaxAssets({ success: true, data: [fixture()] })
  assert.equal(asset.id, 'wax:9007199254740993001')
  assert.equal(asset.wax.mint, '0')
  assert.equal(asset.wax.series, 'Series 3')
  assert.equal(asset.wax.model, 'Fixture model')
  assert.equal(asset.imageUrl, '/nft-posters/7301c13ca762a4fdf0d8.jpg')
  assert.equal(asset.manufacturer, undefined)
  assert.equal(asset.color, undefined)
  assert.equal(asset.isSample, false)
})

test('rejects malformed responses, wrong ownership/collection, duplicate and invalid IDs', () => {
  assert.throws(() => parseWaxAssets({ data: [] }), /incomplete/)
  assert.deepEqual(parseWaxAssets({ success: true, data: [] }), [])
  const data = [fixture(), fixture(), { ...fixture('2'), owner: 'someoneelse' },
    { ...fixture('3'), collection: { collection_name: 'other' } }, fixture('bad-id'), fixture(123), null]
  assert.equal(parseWaxAssets({ success: true, data }).length, 1)
  const [minimal] = parseWaxAssets({ success: true, data: [
    { asset_id: '1', owner: 'passionfruti', collection: { collection_name: 'hotwheels' } },
  ] })
  assert.equal(minimal.name, 'WAX asset 1')
  assert.equal(minimal.edition, undefined)
  assert.equal(minimal.wax.model, undefined)
})

test('blank asset fields fall back to immutable template metadata', () => {
  const [asset] = parseWaxAssets({ success: true, data: [{
    ...fixture(), data: { name: '', model: null, video: '' },
  }] })
  assert.equal(asset.name, 'Parser fixture')
  assert.equal(asset.wax.model, 'Fixture model')
  assert.equal(asset.imageUrl, '/nft-posters/7301c13ca762a4fdf0d8.jpg')
})

test('normalizes supported IPFS references and excludes unsafe media schemes', () => {
  const expected = 'https://gateway.pinata.cloud/ipfs/' + video
  assert.equal(resolveMediaUrl(video), expected)
  assert.equal(resolveMediaUrl('ipfs://' + video), expected)
  assert.equal(resolveMediaUrl({ uri: 'ipfs://ipfs/' + video }), expected)
  assert.equal(resolveMediaUrl('https://example.com/my image.jpg'), 'https://example.com/my%20image.jpg')
  assert.equal(resolveMediaUrl('javascript:alert(1)'), undefined)
  assert.equal(resolveMediaUrl('http://example.com/insecure.jpg'), undefined)
  assert.equal(resolveMediaUrl({}), undefined)
})

test('assigns only wall slots, keeps 20 other placements and 35 original sample records', () => {
  const records = Array.from({ length: 7 }, (_, index) => parseWaxAssets({ success: true, data: [fixture(String(index + 1))] })[0])
  const slots = cardSlots.map(slot => slot.id)
  const assignments = assignWallCollectibles(displayAssignments, slots, records)
  const resolved = resolveDisplayContents([...sampleCollectibles, ...physicalCollectibles, ...records], assignments, displaySlots.map(slot => slot.id))
  assert.equal(new Set(displaySlots.map(slot => slot.id)).size, 35)
  assert.equal(sampleCollectibles.length, 35)
  assert.equal(resolved.collectiblesBySlot.size, 27)
  assert.deepEqual(resolved.issues, [])
  assert.equal(slots.filter(id => resolved.collectiblesBySlot.has(id)).length, 7)
  assert.equal(assignments[slots[7]], null)
  for (const [id, record] of Object.entries(displayAssignments)) {
    if (!id.startsWith('card-wall:')) assert.equal(assignments[id], record)
  }
  assert.equal(displayAssignments[slots[0]], 'sample-car-09')
  const empty = assignWallCollectibles(displayAssignments, slots, [])
  assert.equal(slots.filter(id => empty[id] === null).length, 15)
  const broken = resolveDisplayContents([], { [slots[0]]: 'missing' }, slots)
  assert.equal(broken.collectiblesBySlot.size, 0)
  assert.match(broken.issues[0], /Missing collectible/)
})

test('Batman keeps its top-left cabinet slot, photo, metadata and renderer', async () => {
  const [batman] = physicalCollectibles
  assert.equal(batman.manufacturer, 'Funko')
  assert.equal(batman.boxNumber, '458')
  assert.equal(batman.edition, 'Transparent Chase')
  assert.equal(batman.representation, 'boxed')
  assert.equal(batman.isSample, false)
  assert.equal(batman.wax, undefined)
  assert.equal(batman.color, undefined)
  assert.equal(batman.packaging, 'Protective case; Limited Chase Edition sticker only')
  const resolved = resolveDisplayContents([...sampleCollectibles, ...physicalCollectibles], displayAssignments, displaySlots.map(slot => slot.id))
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.collectiblesBySlot.get('cabinet:shelf-4-left'), batman)
  assert.equal([...resolved.collectiblesBySlot.values()].filter(item => item.id === 'sample-car-07').length, 0)
  assert.ok(sampleCollectibles.some(item => item.id === 'sample-car-07'))
  for (const [slot, id] of [
    ['cabinet:shelf-1-left', 'sample-car-01'], ['cabinet:shelf-1-right', 'sample-car-02'],
  ]) assert.equal(resolved.collectiblesBySlot.get(slot).id, id)
  const crop = batman.imageCrop
  assert.ok(crop.left >= 0 && crop.top >= 0 && crop.width > 0 && crop.height > 0)
  assert.ok(crop.left + crop.width <= 1 && crop.top + crop.height <= 1)
  const bytes = await readFile(new URL('../public' + batman.imageUrl, import.meta.url))
  assert.equal(bytes.readUInt16BE(0), 0xffd8)
})

test('retains the three original physical Hot Wheels in the approved cabinet slots', async () => {
  assert.equal(new Set(physicalCollectibles.map(item => item.id)).size, physicalCollectibles.length)
  const resolved = resolveDisplayContents([...sampleCollectibles, ...physicalCollectibles], displayAssignments, displaySlots.map(slot => slot.id))
  assert.deepEqual(resolved.issues, [])
  const expected = [
    ['cabinet:shelf-3-left', 6, 'HTF96', 'clamshell'],
    ['cabinet:shelf-3-right', 11, 'JWT48', 'premium-box'],
    ['cabinet:shelf-4-right', 40, 'HWW87', 'clamshell'],
  ]
  for (const [slot, inventory, product, kind] of expected) {
    const item = resolved.collectiblesBySlot.get(slot)
    assert.equal(item.inventoryNumber, inventory)
    assert.equal(item.productNumber, product)
    assert.equal(item.ownership, 'Owned')
    assert.equal(item.wax, undefined)
    assert.equal(item.isSample, false)
    assert.equal(item.representation, undefined)
    assert.equal(collectiblePresentations[item.id].kind, kind)
    const bytes = await readFile(new URL('../public' + item.imageUrl, import.meta.url))
    assert.equal(bytes.readUInt32BE(0), 0x89504e47)
    assert.equal(item.artworkStatus, undefined)
    if (inventory !== 11) {
      const crop = item.imageCrop
      assert.ok(crop.left >= 0 && crop.top >= 0 && crop.width > 0 && crop.height > 0)
      assert.ok(crop.left + crop.width <= 1 && crop.top + crop.height <= 1)
      const aspect = bytes.readUInt32BE(16) * crop.width / (bytes.readUInt32BE(20) * crop.height)
      assert.ok(aspect > 0.6 && aspect < 0.7, 'card retains its portrait proportions')
    }
  }
  for (const id of ['sample-car-05', 'sample-car-06', 'sample-car-08']) {
    assert.ok(sampleCollectibles.some(item => item.id === id))
    assert.ok(![...resolved.collectiblesBySlot.values()].some(item => item.id === id))
  }
  cardSlots.forEach((slot, index) => {
    assert.equal(displayAssignments[slot.id], `sample-car-${String(index + 9).padStart(2, '0')}`)
  })
})

test('places the eight loose cars and four blister cards in their wall-shelf slots with clearance', async () => {
  const expected = {
    'left-model-shelves:shelf-3-left': ['Custom ’71 Datsun 240Z', 27],
    'left-model-shelves:shelf-3-right': ['’70 Plymouth AAR ’Cuda', 29],
    'left-model-shelves:shelf-2-left': ['Ford Shelby GT350R', 14],
    'left-model-shelves:shelf-2-right': ['Custom ’68 Camaro', 28],
    'left-model-shelves:shelf-1-left': ['Land Rover Defender 110', 15],
    'left-model-shelves:shelf-1-right': ['Corvette Stingray', 7],
    'back-model-shelves:shelf-3-left': ['Ain’t Fare', 32],
    'back-model-shelves:shelf-3-right': ['Mattel Dream Mobile', 18],
    'back-model-shelves:shelf-2-left': ['Ferrari F40 Competizione', 5, 'blister'],
    'back-model-shelves:shelf-2-right': ['Lamborghini Veneno', 1, 'blister'],
    'back-model-shelves:shelf-1-left': ['BMW M4 GT3', 3, 'blister'],
    'back-model-shelves:shelf-1-right': ['Nissan Skyline GT-R (BNR34)', 4, 'blister'],
  }
  const suppliedPhotos = {
    1: '01-lamborghini-veneno-photo.webp',
    3: '03-bmw-m4-gt3-photo.jpg',
    4: '04-nissan-skyline-bnr34-photo.jpg',
    5: '05-ferrari-f40-competizione-photo.webp',
    7: '07-corvette-stingray-photo.jpg',
    14: '14-ford-shelby-gt350r-photo.webp',
    15: '15-land-rover-defender-110-photo.jpg',
    18: '18-mattel-dream-mobile-photo.jpg',
    27: '27-custom-71-datsun-240z-photo.webp',
    28: '28-custom-68-camaro-photo.jpg',
    29: '29-plymouth-aar-cuda-photo.jpg',
    32: '32-aint-fare-photo.webp',
  }
  const fullCardPhotoRatios = { 1: 657 / 1000, 5: 1488 / 1500 }
  const resolved = resolveDisplayContents([...sampleCollectibles, ...physicalCollectibles], displayAssignments, displaySlots.map(slot => slot.id))
  assert.deepEqual(resolved.issues, [])
  assert.equal(modelSlots.length, Object.keys(expected).length)
  for (const slot of modelSlots) {
    const [name, number, kind = 'loose-car'] = expected[slot.id]
    const item = resolved.collectiblesBySlot.get(slot.id)
    const config = collectiblePresentations[item.id]
    assert.equal(item.name, name)
    assert.equal(item.inventoryNumber, number)
    assert.equal(item.ownership, 'Owned')
    assert.equal(item.wax, undefined)
    assert.equal(item.isSample, false)
    assert.equal(config.kind, kind)
    assert.equal(item.packaging, kind === 'blister' ? 'Blister-packed' : 'Opened / loose')
    const [x, y, z] = slot.position
    const [width, height, depth] = config.size
    const base = y + config.baseOffset
    const shelf = modelShelfLevels.findLast(level => level.height < y)
    const nextShelf = modelShelfLevels.find(level => level.height > y)
    assert.ok(Math.abs(base - (shelf.height + 0.075 / 2)) < 1e-8, `${slot.id}: rests on shelf`)
    if (nextShelf) assert.ok(base + height < nextShelf.height - 0.075 / 2, `${slot.id}: overhead clearance`)
    assert.ok(Math.abs(x) + width / 2 < 1.75 / 2, `${slot.id}: side clearance`)
    assert.ok(Math.abs(z) + depth / 2 < 0.41 / 2, `${slot.id}: depth clearance`)
    const suppliedPhoto = suppliedPhotos[number]
    assert.equal(item.imageUrl, '/collectibles/wall-shelves/' + suppliedPhoto)
    assert.equal(item.artworkStatus, undefined)
    const image = await readFile(new URL('../public' + item.imageUrl, import.meta.url))
    if (suppliedPhoto.endsWith('.webp')) {
      assert.equal(image.toString('ascii', 0, 4), 'RIFF')
      assert.equal(image.toString('ascii', 8, 12), 'WEBP')
    } else {
      assert.equal(image.readUInt16BE(0), 0xffd8)
    }
    const crop = item.imageCrop
    if (crop) {
      assert.ok(crop.left >= 0 && crop.top >= 0 && crop.width > 0 && crop.height > 0)
      assert.ok(crop.left + crop.width <= 1 && crop.top + crop.height <= 1)
    }
    if (kind === 'blister') {
      // The cropped BMW and Nissan photos both have square source frames.
      const photoRatio = crop ? crop.width / crop.height : fullCardPhotoRatios[number]
      assert.ok(Math.abs(width / height - photoRatio) < 0.002)
    }
  }
})

test('physical packaging fits the unchanged cabinet, including the Porsche top model', () => {
  for (const slot of cabinetSlots) {
    const config = collectiblePresentations[displayAssignments[slot.id]]
    if (!config) continue
    const [width, height, depth] = config.size
    const [x, anchor, z] = slot.position
    const y = anchor + (config.kind === 'box' ? config.baseOffset : 0)
    const nextShelf = cabinetShelves.find(shelf => shelf.height > y)
    const ceiling = nextShelf ? nextShelf.height - 0.045 / 2 : 3 - 0.12 / 2
    assert.ok(y + height < ceiling, `${slot.id}: vertical clearance`)
    assert.ok(z + depth / 2 < 0.35, `${slot.id}: front glass clearance`)
    assert.ok(z - depth / 2 > -0.32 + 0.065 / 2, `${slot.id}: back clearance`)
    assert.ok(Math.abs(x) + width / 2 < 1 - 0.045 / 2, `${slot.id}: side clearance`)
    assert.ok(Math.abs(x) - width / 2 > 0.045 / 2, `${slot.id}: center frame clearance`)
    if (config.kind === 'premium-box') {
      assert.equal(config.topModel, 'porsche-911-gt1')
      assert.ok(config.boxHeight + 0.0995 <= height)
      for (const quad of [config.front, config.right]) {
        for (const point of quad) assert.ok(point.every(value => value >= 0 && value <= 1))
      }
    }
  }
})

test('Thor and Cadillac replace only cars 03/04 with correctly proportioned selectable boxes', async () => {
  const resolved = resolveDisplayContents([...sampleCollectibles, ...physicalCollectibles], displayAssignments, displaySlots.map(slot => slot.id))
  assert.deepEqual(resolved.issues, [])
  const thor = resolved.collectiblesBySlot.get('cabinet:shelf-2-left')
  const cadillac = resolved.collectiblesBySlot.get('cabinet:shelf-2-right')
  assert.equal(thor.id, 'physical-funko-thor-comic-cover-09')
  assert.equal(thor.name, 'Thor Comic Cover')
  assert.equal(thor.manufacturer, 'Funko')
  assert.equal(thor.line, 'Pop! Comic Covers')
  assert.equal(thor.franchise, 'Marvel')
  assert.equal(thor.character, 'Thor')
  assert.equal(thor.comic, 'Journey Into Mystery #83')
  assert.equal(thor.boxNumber, '09')
  assert.equal(thor.packaging, 'Sealed boxed')
  assert.equal(cadillac.id, 'physical-brick-shop-cadillac-project-gtp-hypercar')
  assert.equal(cadillac.manufacturer, 'Mattel')
  assert.equal(cadillac.line, 'Mattel Brick Shop / Hot Wheels')
  assert.equal(cadillac.vehicle, 'Cadillac Project GTP Hypercar')
  assert.equal(cadillac.pieceCount, 236)
  assert.equal(cadillac.ageRating, '10+')
  assert.equal(cadillac.packaging, 'Boxed')
  for (const item of [thor, cadillac]) {
    assert.equal(item.ownership, 'Owned')
    assert.equal(item.isSample, false)
    assert.equal(item.wax, undefined)
    assert.equal(item.releaseYear, undefined)
    const config = collectiblePresentations[item.id]
    assert.equal(config.kind, 'box')
    const image = await readFile(new URL('../public' + item.imageUrl, import.meta.url))
    assert.equal(image.readUInt32BE(0), 0x89504e47)
    const crop = item.imageCrop
    assert.ok(crop.left >= 0 && crop.top >= 0 && crop.width > 0 && crop.height > 0)
    assert.ok(crop.left + crop.width <= 1 && crop.top + crop.height <= 1)
    const ratio = image.readUInt32BE(16) * crop.width / (image.readUInt32BE(20) * crop.height)
    assert.ok(Math.abs(ratio - config.size[0] / config.size[1]) < 0.02)
  }
  assert.ok(collectiblePresentations[thor.id].size[1] > collectiblePresentations[thor.id].size[0])
  assert.ok(collectiblePresentations[cadillac.id].size[0] > collectiblePresentations[cadillac.id].size[1])
  for (const [slot, id] of [
    ['cabinet:shelf-4-left', 'physical-batman-beyond-458-chase'],
    ['cabinet:shelf-4-right', 'physical-hot-wheels-chevelle-ss-396-series-6'],
    ['cabinet:shelf-3-left', 'physical-hot-wheels-alfa-romeo-155-v6-ti-2024'],
    ['cabinet:shelf-3-right', 'physical-hot-wheels-lewandowski-porsche-911-gt1'],
  ]) assert.equal(resolved.collectiblesBySlot.get(slot).id, id)
  for (const id of ['sample-car-03', 'sample-car-04']) {
    assert.ok(sampleCollectibles.some(item => item.id === id))
    assert.ok(![...resolved.collectiblesBySlot.values()].some(item => item.id === id))
  }
})

test('bundled artwork references all exist and are JPEGs', async () => {
  const posters = JSON.parse(await readFile(new URL('../src/data/waxPosters.json', import.meta.url), 'utf8'))
  assert.equal(Object.keys(posters).length, 7)
  for (const path of Object.values(posters)) {
    const bytes = await readFile(new URL('../public' + path, import.meta.url))
    assert.equal(bytes.readUInt16BE(0), 0xffd8)
  }
})

test('fetches public assets with filters and sorts string IDs without precision loss', async t => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url.searchParams.get('owner'), 'passionfruti')
    assert.equal(url.searchParams.get('collection_name'), 'hotwheels')
    assert.equal(options.cache, 'no-store')
    assert.ok(options.signal)
    return { ok: true, json: async () => ({ success: true, data: [fixture('9007199254740993001'), fixture('9007199254740993002')] }) }
  })
  const assets = await fetchWaxCollectibles(new AbortController().signal)
  assert.equal(assets[0].wax.assetId, '9007199254740993002')
  assert.equal(assets[1].wax.assetId, '9007199254740993001')
})

test('API errors, cancellation and invalid payloads reject without producing fake NFTs', async t => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: false }))
  await assert.rejects(fetchWaxCollectibles(new AbortController().signal), /unavailable/)
  globalThis.fetch.mock.mockImplementation(async () => ({ ok: true, json: async () => ({ success: false }) }))
  await assert.rejects(fetchWaxCollectibles(new AbortController().signal), /incomplete/)
  globalThis.fetch.mock.mockImplementation(async (_url, options) => { options.signal.throwIfAborted() })
  const controller = new AbortController(); controller.abort()
  await assert.rejects(fetchWaxCollectibles(controller.signal), { name: 'AbortError' })
})

test('static artwork handles image success, failure and cancellation without a WebGL dependency', async t => {
  class TestImage {
    naturalWidth = 350
    naturalHeight = 530
    removeAttribute() {}
    set src(url) { queueMicrotask(() => url === 'good' || url.startsWith('data:image/') ? this.onload?.() : this.onerror?.()) }
  }
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'Image')
  Object.defineProperty(globalThis, 'Image', { configurable: true, writable: true, value: TestImage })
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, 'Image', previous)
    else delete globalThis.Image
  })
  assert.ok(await loadStaticArtwork('good', new AbortController().signal))
  await assert.rejects(loadStaticArtwork('bad', new AbortController().signal), /unavailable/)
  await assert.rejects(loadStaticArtwork(undefined, new AbortController().signal), /unavailable/)
  const controller = new AbortController(); controller.abort()
  await assert.rejects(loadStaticArtwork('good', controller.signal), { name: 'AbortError' })
})
