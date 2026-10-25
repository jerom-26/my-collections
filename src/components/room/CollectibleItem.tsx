import type { Collectible, DisplayPresentation } from '../../types/collectibles'
import { Artwork } from './Artwork'
import { Car } from './Primitives'

interface CollectibleItemProps {
  collectible?: Collectible
  presentation: DisplayPresentation
  scale: number
}

/** Rendering only: records and assignments are supplied by the display composition. */
export function CollectibleItem({ collectible, presentation, scale }: CollectibleItemProps) {
  if (!collectible) return null

  if (presentation === 'loose') return <Car color={collectible.color} scale={scale} />

  return (
    <>
      <Artwork kind="card" size={[0.35, 0.53]} />
      <Car position={[0, -0.18, 0.05]} color={collectible.color} scale={scale} />
      <mesh position={[0, -0.11, 0.09]}>
        <boxGeometry args={[0.32, 0.17, 0.12]} />
        <meshStandardMaterial color="#c6e1dd" transparent opacity={0.13} depthWrite={false} roughness={0.2} />
      </mesh>
    </>
  )
}
