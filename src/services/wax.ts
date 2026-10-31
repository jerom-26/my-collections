import posters from '../data/waxPosters.json' with { type: 'json' }
import type { Collectible } from '../types/collectibles'

export const WAX_ACCOUNT = 'passionfruti'
export const WAX_COLLECTION = 'hotwheels'
const ASSETS_ENDPOINT = 'https://wax.api.atomicassets.io/atomicassets/v1/assets'
const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'

// Adapted from collectible-showcase/app/api/wax-assets/route.ts.
type UnknownRecord = Record<string, unknown>
function record(value: unknown): UnknownRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as UnknownRecord : {}
}

function text(value: unknown, depth = 0): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (depth >= 4) return undefined
  const object = record(value)
  for (const field of [object.url, object.uri, object.cid, object.hash, object.value]) {
    if (field == null) continue
    const candidate = text(field, depth + 1)
    if (candidate) return candidate
  }
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    const candidate = text(value)
    if (candidate) return candidate
  }
}

export function resolveMediaUrl(value: unknown): string | undefined {
  const candidate = text(value)
  if (!candidate) return undefined
  if (/^https:\/\//i.test(candidate)) {
    try { return new URL(candidate).href } catch { return undefined }
  }
  const path = candidate.replace(/^ipfs:\/\//i, '').replace(/^ipfs\//i, '')
  if (/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]+)(\/.*)?$/i.test(path)) {
    return new URL(path, IPFS_GATEWAY).href
  }
}

/** Reject records that cannot be verified against the requested owner/collection. */
export function parseWaxAssets(payload: unknown, account = WAX_ACCOUNT): Collectible[] {
  const result = record(payload)
  if (result.success !== true || !Array.isArray(result.data)) {
    throw new Error('The WAX indexer returned an incomplete response.')
  }
  const seen = new Set<string>()
  const assets: Collectible[] = []
  for (const value of result.data) {
    const asset = record(value)
    const assetId = typeof asset.asset_id === 'string' ? asset.asset_id.trim() : undefined
    const collection = record(asset.collection)
    if (!assetId || !/^\d+$/.test(assetId) || seen.has(assetId)
      || asset.owner !== account || collection.collection_name !== WAX_COLLECTION) continue
    seen.add(assetId)
    const template = record(asset.template)
    const layers = [asset.data, asset.mutable_data, asset.immutable_data, template.immutable_data].map(record)
    const field = (...keys: string[]) => firstText(...layers.flatMap((layer) => keys.map((key) => layer[key])))
    const animationUrl = resolveMediaUrl(field('video', 'animation_url'))
    const imageUrl = resolveMediaUrl(field('img', 'image'))
      ?? (animationUrl ? (posters as Record<string, string>)[animationUrl] : undefined)
    const rarity = field('rarity')
    const schema = text(record(asset.schema).schema_name)
    assets.push({
      id: `wax:${assetId}`,
      name: firstText(field('name'), asset.name) ?? `WAX asset ${assetId}`,
      category: 'digital-collectible', edition: rarity, isSample: false, imageUrl,
      wax: {
        assetId, owner: account, collection: WAX_COLLECTION,
        collectionName: text(collection.name),
        series: schema?.replace(/^series(\d+)$/i, 'Series $1'),
        set: field('collection'), make: field('make'), model: field('model'),
        rarity, templateId: text(template.template_id), mint: text(asset.template_mint),
        maxSupply: text(template.max_supply), year: field('year released'),
        designer: field('designer'), animationUrl,
      },
    })
  }
  return assets
}

/** Read enough sorted records for the board; this is not a full wallet inventory. */
export async function fetchWaxCollectibles(signal: AbortSignal): Promise<Collectible[]> {
  const url = new URL(ASSETS_ENDPOINT)
  url.search = new URLSearchParams({
    owner: WAX_ACCOUNT, collection_name: WAX_COLLECTION,
    page: '1', limit: '100', order: 'desc', sort: 'asset_id',
  }).toString()
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.any([signal, AbortSignal.timeout(12_000)]),
  })
  if (!response.ok) throw new Error('The WAX indexer is temporarily unavailable.')
  const assets = parseWaxAssets(await response.json())
  // Asset IDs stay strings: blockchain identifiers must never lose numeric precision.
  return assets.sort((a, b) => {
    const left = BigInt(a.wax!.assetId), right = BigInt(b.wax!.assetId)
    return left === right ? 0 : left > right ? -1 : 1
  })
}
