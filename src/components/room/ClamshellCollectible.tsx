import { Edges } from '@react-three/drei'
import type { Collectible } from '../../types/collectibles'
import CollectibleArtworkFace from './CollectibleArtworkFace'

/** Upright sealed card, blister, and a separate clear outer protector. */
export default function ClamshellCollectible({ collectible, size: [width, height, depth] }: {
  collectible: Collectible
  size: [number, number, number]
}) {
  return <group position={[0, height / 2, 0]}>
    <mesh position={[0, 0, -depth / 2 + 0.02]} castShadow receiveShadow>
      <boxGeometry args={[width - 0.024, height - 0.024, 0.008]} />
      <meshStandardMaterial color="#d9d6c5" roughness={0.85} />
    </mesh>
    <group position={[0, 0, -depth / 2 + 0.025]}>
      <CollectibleArtworkFace imageUrl={collectible.imageUrl} size={[width - 0.024, height - 0.024]} />
    </group>
    <mesh position={[0, -height * 0.23, 0.004]}>
      <boxGeometry args={[width - 0.05, height * 0.27, depth - 0.05]} />
      <meshStandardMaterial color="#e2eeea" transparent opacity={0.1} metalness={0.12} roughness={0.15} depthWrite={false} />
    </mesh>
    <mesh>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color="#e1eee7" transparent opacity={0.045} metalness={0.15} roughness={0.18} depthWrite={false} />
      <Edges color="#d5e5df" transparent opacity={0.32} raycast={() => null} />
    </mesh>
    <mesh position={[0, height / 2 - 0.023, depth / 2 - 0.003]}>
      <boxGeometry args={[width * 0.35, 0.009, 0.004]} />
      <meshStandardMaterial color="#e4ede4" transparent opacity={0.35} roughness={0.2} depthWrite={false} />
    </mesh>
  </group>
}
