import { useEffect, useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace, Texture } from 'three'
import type { Collectible } from '../../types/collectibles'
import { useCollectibleArtwork } from '../../hooks/useCollectibleArtwork'

interface BoxedCollectibleProps {
  collectible: Collectible
  size: [number, number, number]
}

function photoStatusTexture(failed: boolean) {
  const canvas = document.createElement('canvas')
  canvas.width = 380; canvas.height = 520
  const context = canvas.getContext('2d')!
  context.fillStyle = '#e4d8bf'; context.fillRect(0, 0, 380, 520)
  context.fillStyle = '#354944'; context.textAlign = 'center'; context.font = '26px sans-serif'
  context.fillText(failed ? 'Photo unavailable' : 'Loading photo…', 190, 260)
  return new CanvasTexture(canvas)
}

/** A physical box; its photograph is a front-face texture, not a floating image. */
export default function BoxedCollectible({ collectible, size: [width, height, depth] }: BoxedCollectibleProps) {
  const { image, failed } = useCollectibleArtwork(collectible.imageUrl)
  const crop = collectible.imageCrop
  const texture = useMemo(() => {
    const next = image ? new Texture(image) : photoStatusTexture(failed)
    next.colorSpace = SRGBColorSpace
    next.anisotropy = 4
    if (image && crop) {
      next.repeat.set(crop.width, crop.height)
      next.offset.set(crop.left, 1 - crop.top - crop.height)
    }
    next.needsUpdate = true
    return next
  }, [image, crop, failed])
  useEffect(() => () => texture.dispose(), [texture])
  const ratio = image ? image.naturalWidth * (crop?.width ?? 1) / (image.naturalHeight * (crop?.height ?? 1)) : width / height
  const artWidth = Math.min(width - 0.008, (height - 0.008) * ratio)
  const artHeight = Math.min(height - 0.008, (width - 0.008) / ratio)

  return <group position={[0, height / 2, 0]}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[width - 0.006, height - 0.006, depth - 0.006]} />
      <meshStandardMaterial color="#eee9dd" roughness={0.8} />
    </mesh>
    <mesh position={[0, 0, depth / 2 - 0.002]}>
      <planeGeometry args={[artWidth, artHeight]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
    <mesh>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color="#d3e3df" transparent opacity={0.06} roughness={0.2} depthWrite={false} />
    </mesh>
  </group>
}
