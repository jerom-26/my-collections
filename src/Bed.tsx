import { RoundedBox } from '@react-three/drei'
import { Box } from './components/room/Primitives'
import { palette } from './components/room/palette'

/** The original frame / mattress / pillow bed, expanded into a low platform bed. */
export default function Bed() {
  return (
    <group position={[1.95, 0, 0.15]}>
      <Box position={[0, 0.16, 0]} size={[2.85, 0.22, 4.25]} color={palette.darkWood} />
      <Box position={[0, 0.3, 0]} size={[2.96, 0.12, 4.35]} color={palette.wood} />
      {[-1.3, 1.3].map((x) => <Box key={x} position={[x, 0.08, 0]} size={[0.12, 0.15, 3.8]} color={palette.darkWood} />)}
      <Box position={[0, 0.92, -2.1]} size={[2.96, 1.35, 0.15]} color={palette.wood} />
      {Array.from({ length: 12 }, (_, i) => <Box key={i} position={[-1.36 + i * 0.247, 0.94, -2]} size={[0.024, 1.06, 0.018]} color="#9b6f46" />)}
      <Box position={[0, 1.54, -2.007]} size={[2.76, 0.025, 0.025]} color="#ffdb9b" glow={2} />
      <RoundedBox args={[2.67, 0.38, 4.02]} radius={0.13} smoothness={4} position={[0, 0.54, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e9dfcc" roughness={1} />
      </RoundedBox>
      <RoundedBox args={[2.72, 0.27, 2.88]} radius={0.12} smoothness={4} position={[0, 0.77, 0.57]} castShadow receiveShadow>
        <meshStandardMaterial color={palette.navy} roughness={1} />
      </RoundedBox>
      {Array.from({ length: 9 }, (_, i) => <Box key={i} position={[-1.16 + i * 0.29, 0.908, 0.59]} size={[0.012, 0.006, 2.57]} color="#596979" />)}
      <RoundedBox args={[2.74, 0.13, 0.36]} radius={0.06} smoothness={4} position={[0, 0.92, -0.67]} castShadow>
        <meshStandardMaterial color="#7e8b99" roughness={1} />
      </RoundedBox>
      {[-0.68, 0.68].map((x) => (
        <RoundedBox key={x} args={[1.14, 0.24, 0.72]} radius={0.12} smoothness={4} position={[x, 0.88, -1.47]} rotation={[0.18, 0, x * 0.06]} castShadow>
          <meshStandardMaterial color="#c4b9a7" roughness={1} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.64, 0.23, 0.6]} radius={0.09} smoothness={4} position={[0.18, 1.04, -1.23]} rotation={[0.12, 0.15, -0.13]} castShadow>
        <meshStandardMaterial color={palette.terracotta} roughness={1} />
      </RoundedBox>
      <RoundedBox args={[1.12, 0.1, 1.42]} radius={0.045} smoothness={4} position={[0.57, 0.96, 1.06]} rotation={[0, -0.12, 0]} castShadow>
        <meshStandardMaterial color="#c6ac8c" roughness={1} />
      </RoundedBox>
      {Array.from({ length: 10 }, (_, i) => <Box key={i} position={[0.02 + i * 0.115, 0.96, 1.79 - i * 0.014]} size={[0.026, 0.035, 0.12]} color="#d7c2a5" />)}
    </group>
  )
}
