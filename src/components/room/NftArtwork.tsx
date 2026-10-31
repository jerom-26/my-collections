import { useEffect, useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace, Texture } from 'three'
import { useCollectibleArtwork } from '../../hooks/useCollectibleArtwork'
import type { Collectible } from '../../types/collectibles'

function statusTexture(failed: boolean) {
  const canvas = document.createElement('canvas')
  canvas.width = 350; canvas.height = 530
  const context = canvas.getContext('2d')!
  context.fillStyle = '#e4d8bf'; context.fillRect(0, 0, 350, 530)
  context.strokeStyle = '#9a8763'; context.lineWidth = 3; context.strokeRect(12, 12, 326, 506)
  context.fillStyle = '#354944'; context.textAlign = 'center'
  context.font = '22px sans-serif'; context.fillText(failed ? 'Artwork unavailable' : 'Loading artwork', 175, 260)
  context.font = '18px sans-serif'; context.fillText('WAX / HOT WHEELS', 175, 295)
  return new CanvasTexture(canvas)
}

/** Artwork fits inside the existing card area; the pick box remains in CollectibleItem. */
export default function NftArtwork({ collectible }: { collectible: Collectible }) {
  const { image, failed } = useCollectibleArtwork(collectible.imageUrl)
  const texture = useMemo(() => {
    const next = image ? new Texture(image) : statusTexture(failed)
    next.colorSpace = SRGBColorSpace
    next.needsUpdate = true
    next.anisotropy = 4
    return next
  }, [image, failed])
  useEffect(() => () => texture.dispose(), [texture])
  const ratio = image ? image.naturalWidth / image.naturalHeight : 0.35 / 0.53
  const width = Math.min(0.35, 0.53 * ratio)
  const height = Math.min(0.53, 0.35 / ratio)

  return <group>
    <mesh position={[0, 0, -0.002]}>
      <planeGeometry args={[0.35, 0.53]} />
      <meshStandardMaterial color="#e4d8bf" roughness={0.95} />
    </mesh>
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  </group>
}
