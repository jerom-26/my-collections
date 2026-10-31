// Adapted from collectible-showcase/lib/nft-media.ts; this version loads still images only.
export function loadStaticArtwork(url: string | undefined, signal: AbortSignal): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(signal.reason); return }
    if (!url) { reject(new Error('Artwork unavailable')); return }
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.decoding = 'async'
    const clean = () => {
      clearTimeout(timer)
      image.onload = image.onerror = null
      signal.removeEventListener('abort', abort)
    }
    const fail = (error: Error) => {
      clean()
      image.removeAttribute('src')
      reject(error)
    }
    const abort = () => fail(new DOMException('Artwork request cancelled', 'AbortError'))
    const timer = setTimeout(() => fail(new Error('Artwork request timed out')), 15_000)
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) fail(new Error('Artwork has no dimensions'))
      else { clean(); resolve(image) }
    }
    image.onerror = () => fail(new Error('Artwork unavailable'))
    signal.addEventListener('abort', abort, { once: true })
    image.src = url
  })
}
