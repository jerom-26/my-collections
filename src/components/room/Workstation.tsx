import { RoundedBox } from '@react-three/drei'
import { Artwork } from './Artwork'
import { Box, Car, Plant } from './Primitives'
import { palette } from './palette'

function Chair() {
  return (
    <group position={[-1.3, 0, -1.75]} rotation={[0, -0.18, 0]}>
      <Box position={[0, 0.36, 0]} size={[0.09, 0.5, 0.09]} color={palette.ink} metalness={0.5} />
      {Array.from({ length: 5 }, (_, i) => <group key={i} rotation={[0, i * Math.PI * 0.4, 0]}>
        <Box position={[0.2, 0.12, 0]} size={[0.48, 0.055, 0.055]} color={palette.ink} />
        <mesh position={[0.43, 0.075, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.065, 0.065, 0.07, 10]} /><meshStandardMaterial color="#272f31" /></mesh>
      </group>)}
      <RoundedBox args={[0.8, 0.17, 0.76]} radius={0.07} smoothness={3} position={[0, 0.7, 0]} castShadow><meshStandardMaterial color="#34464a" roughness={0.9} /></RoundedBox>
      <RoundedBox args={[0.72, 0.98, 0.16]} radius={0.08} smoothness={3} position={[0, 1.19, 0.33]} rotation={[-0.12, 0, 0]} castShadow><meshStandardMaterial color="#34464a" roughness={0.9} /></RoundedBox>
      <Box position={[0, 1.22, 0.425]} size={[0.12, 0.72, 0.035]} color={palette.terracotta} />
      {[-0.48, 0.48].map((x) => <group key={x}>
        <Box position={[x, 0.87, 0.08]} size={[0.045, 0.34, 0.045]} color={palette.ink} />
        <Box position={[x, 1.02, 0]} size={[0.14, 0.075, 0.54]} color={palette.ink} />
      </group>)}
    </group>
  )
}

export default function Workstation() {
  return (
    <group>
      <Box position={[-1.55, 1.12, -3.25]} size={[3.75, 0.13, 1.05]} color={palette.wood} />
      <Box position={[-3.05, 1.12, -2.23]} size={[0.75, 0.13, 1]} color={palette.wood} />
      <Box position={[-2.95, 0.55, -3.25]} size={[0.66, 1.04, 0.85]} color="#4b5047" />
      {[0.3, 0.62, 0.94].map((y) => <group key={y}>
        <Box position={[-2.95, y, -2.812]} size={[0.59, 0.27, 0.025]} color="#555a51" />
        <Box position={[-2.95, y + 0.04, -2.785]} size={[0.2, 0.025, 0.025]} color={palette.brass} />
      </group>)}
      {[-3.3, 0.18].map((x) => <Box key={x} position={[x, 0.55, -2.87]} size={[0.065, 1.1, 0.065]} color={palette.ink} />)}
      <Box position={[-3.05, 0.55, -1.77]} size={[0.065, 1.1, 0.065]} color={palette.ink} />
      <Box position={[-0.15, 0.51, -3.26]} size={[0.49, 0.96, 0.78]} color={palette.ink} />
      <Box position={[-0.15, 0.53, -2.857]} size={[0.4, 0.82, 0.025]} color="#182a30" />
      {[0.3, 0.66].map((y) => <mesh key={y} position={[-0.15, y, -2.835]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.014, 6, 24]} /><meshStandardMaterial color="#dca16e" emissive="#db9457" emissiveIntensity={1.1} />
      </mesh>)}
      <Box position={[-1.55, 1.205, -3.35]} size={[0.58, 0.045, 0.33]} color={palette.ink} />
      <Box position={[-1.55, 1.44, -3.48]} size={[0.08, 0.46, 0.07]} color={palette.ink} />
      <Box position={[-1.55, 1.83, -3.49]} size={[1.86, 0.91, 0.09]} color="#202c30" />
      <Artwork kind="screen" size={[1.76, 0.8]} position={[-1.55, 1.84, -3.44]} />
      <Box position={[-1.47, 1.204, -2.97]} size={[1.59, 0.018, 0.43]} color="#394c4d" />
      <Box position={[-1.62, 1.23, -2.99]} size={[0.92, 0.045, 0.28]} color="#202e32" />
      {Array.from({ length: 4 }, (_, row) => Array.from({ length: 12 }, (_, col) => <Box key={`${row}-${col}`} position={[-2.02 + col * 0.073, 1.257, -3.08 + row * 0.06]} size={[0.05, 0.008, 0.038]} color={(col + row) % 7 === 0 ? '#d8b77d' : '#86938e'} />))}
      <mesh position={[-0.95, 1.25, -2.97]} scale={[0.065, 0.035, 0.1]} castShadow><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#c1b89f" /></mesh>
      <group position={[-2.93, 1.21, -2.02]} rotation={[0, Math.PI / 3, 0]}>
        <Box size={[0.69, 0.035, 0.48]} color="#9fa6a0" />
        <Box position={[0, 0.01, 0]} size={[0.59, 0.02, 0.32]} color="#344247" />
        <group position={[0, 0.25, -0.23]} rotation={[-0.15, 0, 0]}>
          <Box size={[0.69, 0.48, 0.025]} color="#303c40" />
          <Artwork kind="screen" size={[0.62, 0.4]} position={[0, 0, 0.017]} />
        </group>
      </group>
      {[-2.68, -0.4].map((x) => <group key={x} position={[x, 1.39, -3.49]}>
        <Box size={[0.21, 0.4, 0.22]} color={palette.ink} />
        <mesh position={[0, -0.025, 0.116]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.012, 16]} /><meshStandardMaterial color="#9c9b85" /></mesh>
      </group>)}
      <Plant position={[-3.02, 1.19, -3.42]} scale={0.68} />
      <Car position={[-2.93, 1.21, -2.55]} scale={0.6} color="#be613c" />
      <Chair />
    </group>
  )
}
