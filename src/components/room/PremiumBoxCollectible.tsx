import { useEffect, useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Collectible } from '../../types/collectibles'
import type { PhysicalPresentation } from '../../data/collectiblePresentations'
import CollectibleArtworkFace from './CollectibleArtworkFace'
import { Box } from './Primitives'

/** Small stylized interpretation of the supplied Porsche, with its low body and rear wing. */
function PorscheModel() {
  const number = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128; canvas.height = 128
    const context = canvas.getContext('2d')!
    context.fillStyle = '#fffaf0'; context.fillRect(0, 0, 128, 128)
    context.fillStyle = '#202325'; context.font = 'bold 110px Arial'; context.textAlign = 'center'
    context.fillText('9', 64, 105)
    const next = new CanvasTexture(canvas); next.colorSpace = SRGBColorSpace
    return next
  }, [])
  useEffect(() => () => number.dispose(), [number])
  return <group>
    <mesh position={[0, 0.036, 0]} scale={[0.165, 0.025, 0.073]} castShadow>
      <sphereGeometry args={[1, 16, 8]} />
      <meshStandardMaterial color="#f4f0e4" metalness={0.35} roughness={0.4} />
    </mesh>
    <Box position={[0.01, 0.057, 0]} size={[0.26, 0.007, 0.05]} color="#bd272f" metalness={0.3} />
    <Box position={[0.105, 0.06, 0]} size={[0.055, 0.006, 0.07]} color="#222b2c" />
    <mesh position={[-0.022, 0.062, 0]} scale={[0.067, 0.028, 0.05]} castShadow>
      <sphereGeometry args={[1, 12, 6]} />
      <meshStandardMaterial color="#273237" roughness={0.28} />
    </mesh>
    <Box position={[-0.025, 0.086, 0]} size={[0.083, 0.006, 0.078]} color="#bd272f" metalness={0.3} />
    {[-0.07, 0.07].map((z) => <group key={z}>
      <Box position={[-0.13, 0.071, z]} size={[0.009, 0.046, 0.009]} color="#222b2c" />
      <mesh position={[-0.005, 0.042, z * 1.025]} rotation={[0, z < 0 ? Math.PI : 0, 0]}>
        <planeGeometry args={[0.038, 0.031]} /><meshBasicMaterial map={number} toneMapped={false} />
      </mesh>
    </group>)}
    <Box position={[-0.13, 0.095, 0]} size={[0.044, 0.009, 0.17]} color="#222b2c" />
    {[-0.105, 0.105].flatMap((x) => [-0.067, 0.067].map((z) => <mesh key={`${x}-${z}`} position={[x, 0.022, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.022, 0.022, 0.015, 12]} />
      <meshStandardMaterial color="#202628" roughness={0.8} />
    </mesh>))}
  </group>
}

export default function PremiumBoxCollectible({ collectible, presentation }: {
  collectible: Collectible
  presentation: Extract<PhysicalPresentation, { kind: 'premium-box' }>
}) {
  const [width, , depth] = presentation.size
  const height = presentation.boxHeight
  return <group>
    <Box position={[0, height / 2, 0]} size={[width, height, depth]} color="#efece2" />
    <Box position={[0, height - 0.006, 0]} size={[width + 0.002, 0.012, depth + 0.002]} color="#c72d37" />
    <Box position={[-width / 2 - 0.001, height / 2, 0]} size={[0.002, height, depth]} color="#272c2b" />
    <group position={[0, height / 2, depth / 2 + 0.001]}>
      <CollectibleArtworkFace imageUrl={collectible.imageUrl} size={[width, height]} quad={presentation.front} />
    </group>
    <group position={[width / 2 + 0.001, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
      <CollectibleArtworkFace imageUrl={collectible.imageUrl} size={[depth, height]} quad={presentation.right} />
    </group>
    {presentation.topModel === 'porsche-911-gt1' && <group position={[0, height, 0]}><PorscheModel /></group>}
  </group>
}
