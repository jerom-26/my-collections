import type { ThreeEvent } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import type { Collectible, DisplayPresentation } from '../../types/collectibles'
import { Artwork } from './Artwork'
import { Car } from './Primitives'
import { palette } from './palette'
import NftArtwork from './NftArtwork'

export interface CollectibleSelectionProps {
  selectedCollectibleId: string | null
  onSelectCollectible: (id: string, event: ThreeEvent<MouseEvent>) => void
}

interface CollectibleItemProps extends CollectibleSelectionProps {
  collectible?: Collectible
  presentation: DisplayPresentation
  scale: number
}

/** Rendering only: records and assignments are supplied by the display composition. */
export function CollectibleItem({ collectible, presentation, scale, selectedCollectibleId, onSelectCollectible }: CollectibleItemProps) {
  if (!collectible) return null

  const carded = presentation === 'carded'
  const selected = selectedCollectibleId === collectible.id
  const bounds: [number, number, number] = carded ? [0.37, 0.55, 0.2] : [0.55 * scale, 0.3 * scale, 0.29 * scale]
  const center: [number, number, number] = carded ? [0, 0, 0.04] : [0, 0.15 * scale, 0]

  return (
    <group name={`collectible-${collectible.id}`} onClick={(event) => onSelectCollectible(collectible.id, event)}>
      {carded && collectible.wax ? <NftArtwork collectible={collectible} /> : carded ? <>
        <Artwork kind="card" size={[0.35, 0.53]} />
        <Car position={[0, -0.18, 0.05]} color={collectible.color} scale={scale} />
        <mesh position={[0, -0.11, 0.09]}>
          <boxGeometry args={[0.32, 0.17, 0.12]} />
          <meshStandardMaterial color="#c6e1dd" transparent opacity={0.13} depthWrite={false} roughness={0.2} />
        </mesh>
      </> : <Car color={collectible.color} scale={scale} />}
      {/* Invisible pick geometry remains raycastable without adding visible clutter. */}
      <mesh position={center} visible={false}>
        <boxGeometry args={bounds} />
        <meshBasicMaterial />
      </mesh>
      {selected && <mesh position={center} raycast={() => null}>
        <boxGeometry args={bounds} />
        <meshBasicMaterial visible={false} />
        <Edges color={palette.brass} transparent opacity={0.85} raycast={() => null} />
      </mesh>}
    </group>
  )
}
