import { useEffect, useMemo } from 'react'
import { CanvasTexture, PlaneGeometry, SRGBColorSpace, Texture } from 'three'
import { useCollectibleArtwork } from '../../hooks/useCollectibleArtwork'
import type { ArtworkQuad } from '../../data/collectiblePresentations'
import type { Collectible } from '../../types/collectibles'

interface CollectibleArtworkFaceProps {
  imageUrl?: string
  size: [number, number]
  quad?: ArtworkQuad
  crop?: Collectible['imageCrop']
}

/** Shared by physical packaging; photographs retain their aspect ratio unless a face is specified. */
export default function CollectibleArtworkFace({ imageUrl, size: [width, height], quad, crop }: CollectibleArtworkFaceProps) {
  const { image, failed } = useCollectibleArtwork(imageUrl)
  const texture = useMemo(() => {
    let next: Texture
    if (image) next = new Texture(image)
    else {
      const canvas = document.createElement('canvas')
      canvas.width = 400; canvas.height = 600
      const context = canvas.getContext('2d')!
      context.fillStyle = '#e4d8bf'; context.fillRect(0, 0, 400, 600)
      context.fillStyle = '#354944'; context.font = '24px sans-serif'; context.textAlign = 'center'
      context.fillText(failed ? 'Artwork unavailable' : 'Loading artwork…', 200, 300)
      next = new CanvasTexture(canvas)
    }
    next.colorSpace = SRGBColorSpace; next.anisotropy = 4; next.needsUpdate = true
    if (image && crop && !quad) {
      next.repeat.set(crop.width, crop.height)
      next.offset.set(crop.left, 1 - crop.top - crop.height)
    }
    return next
  }, [image, failed, crop, quad])
  const ratio = image && !quad ? image.naturalWidth * (crop?.width ?? 1) / (image.naturalHeight * (crop?.height ?? 1)) : width / height
  const geometry = useMemo(() => {
    const segments = quad ? 12 : 1
    const next = new PlaneGeometry(Math.min(width, height * ratio), Math.min(height, width / ratio), segments, segments)
    if (image && quad) {
      // Sample only this photographed face, leaving the surrounding box/photo off the mesh.
      const uv = next.getAttribute('uv')
      const [tl, tr, br, bl] = quad
      for (let index = 0; index < uv.count; index++) {
        const x = uv.getX(index), y = 1 - uv.getY(index)
        const u = (tl[0] * (1 - x) + tr[0] * x) * (1 - y) + (bl[0] * (1 - x) + br[0] * x) * y
        const v = (tl[1] * (1 - x) + tr[1] * x) * (1 - y) + (bl[1] * (1 - x) + br[1] * x) * y
        uv.setXY(index, u, 1 - v)
      }
    }
    return next
  }, [width, height, ratio, image, quad])
  useEffect(() => () => texture.dispose(), [texture])
  useEffect(() => () => geometry.dispose(), [geometry])

  return <mesh geometry={geometry}>
    <meshBasicMaterial map={texture} toneMapped={false} />
  </mesh>
}
