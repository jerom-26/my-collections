import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFile } from 'node:fs/promises'
import { parseWaxAssets, resolveMediaUrl, fetchWaxCollectibles } from '../src/services/wax.ts'
import { assignWallCollectibles, displayAssignments, resolveDisplayContents } from '../src/data/displayAssignments.ts'
import { sampleCollectibles } from '../src/data/sampleCollectibles.ts'
import { physicalCollectibles } from '../src/data/physicalCollectibles.ts'
import { cardSlots, displaySlots } from '../src/components/room/displayLayout.ts'
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

test('Batman replaces only the top-left cabinet car and stays independent of WAX', async () => {
  const [batman] = physicalCollectibles
  assert.equal(physicalCollectibles.length, 1)
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
    ['cabinet:shelf-2-left', 'sample-car-03'], ['cabinet:shelf-2-right', 'sample-car-04'],
    ['cabinet:shelf-3-left', 'sample-car-05'], ['cabinet:shelf-3-right', 'sample-car-06'],
    ['cabinet:shelf-4-right', 'sample-car-08'],
  ]) assert.equal(resolved.collectiblesBySlot.get(slot).id, id)
  const crop = batman.imageCrop
  assert.ok(crop.left >= 0 && crop.top >= 0 && crop.width > 0 && crop.height > 0)
  assert.ok(crop.left + crop.width <= 1 && crop.top + crop.height <= 1)
  const bytes = await readFile(new URL('../public' + batman.imageUrl, import.meta.url))
  assert.equal(bytes.readUInt16BE(0), 0xffd8)
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
