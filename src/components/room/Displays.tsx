import { Artwork } from './Artwork'
import { Box, Car, Plant } from './Primitives'
import { palette } from './palette'

const carColors = ['#ca6543', '#d8ae47', '#e7e0ca', '#4c7b91', '#77927d', '#b4483a']

export function DisplayCabinet() {
  return (
    <group position={[-3.44, 0, 1.34]} rotation={[0, Math.PI / 2, 0]}>
      <Box position={[0, 0.15, 0]} size={[2.07, 0.25, 0.73]} color={palette.ink} />
      <Box position={[0, 1.56, -0.32]} size={[2.02, 2.76, 0.065]} color="#6c715f" />
      <Box position={[0, 3, 0]} size={[2.12, 0.12, 0.8]} color={palette.ink} />
      {[-1, 0, 1].map((x) => <Box key={x} position={[x, 1.63, 0.34]} size={[0.045, 2.86, 0.045]} color={palette.ink} />)}
      {[-1, 1].map((x) => <group key={x}>
        <Box position={[x, 1.59, -0.32]} size={[0.045, 2.76, 0.045]} color={palette.ink} />
        <Box position={[x * 0.95, 1.59, -0.265]} size={[0.018, 2.66, 0.018]} color="#ffe1a0" glow={2} />
        <mesh position={[x, 1.61, 0]}><boxGeometry args={[0.012, 2.69, 0.64]} /><meshStandardMaterial color="#b8d5cb" transparent opacity={0.12} roughness={0.15} depthWrite={false} /></mesh>
      </group>)}
      {[0.34, 0.99, 1.64, 2.29].map((y, row) => <group key={y}>
        <Box position={[0, y, 0]} size={[1.96, 0.045, 0.66]} color="#b1b7a1" metalness={0.2} />
        <Box position={[0, y + 0.025, -0.24]} size={[1.88, 0.018, 0.025]} color="#ffcc7f" glow={1.8} />
        {[-0.58, 0.55].map((x, col) => <Car key={x} position={[x, y + 0.04, 0.02]} color={carColors[(row * 2 + col) % carColors.length]} scale={1.55} />)}
      </group>)}
      {[-0.5, 0.5].map((x) => <group key={x}>
        <mesh position={[x, 1.61, 0.35]}><planeGeometry args={[0.94, 2.69]} /><meshStandardMaterial color="#d5e5d4" transparent opacity={0.075} roughness={0.12} metalness={0.25} depthWrite={false} /></mesh>
        <Box position={[x > 0 ? 0.1 : -0.1, 1.5, 0.39]} size={[0.025, 0.25, 0.035]} color={palette.brass} metalness={0.65} />
      </group>)}
      <Plant position={[-0.68, 3.07, 0]} scale={0.8} />
      <Box position={[0.3, 3.13, 0]} size={[0.9, 0.1, 0.43]} color={palette.terracotta} />
      <Box position={[0.26, 3.23, 0]} size={[0.8, 0.08, 0.4]} color="#d9c59c" />
    </group>
  )
}

function CardedDisplay() {
  return (
    <group position={[0.6, 2.48, -3.85]}>
      <Box size={[2.09, 1.9, 0.055]} color={palette.ink} />
      {Array.from({ length: 3 }, (_, row) => Array.from({ length: 5 }, (_, col) => (
        <group key={`${row}-${col}`} position={[-0.81 + col * 0.405, 0.59 - row * 0.6, 0.05]}>
          <Artwork kind="card" size={[0.35, 0.53]} />
          <Box position={[0, 0.242, 0.008]} size={[0.085, 0.013, 0.012]} color={palette.ink} />
          <Car position={[0, -0.18, 0.05]} scale={0.57} color={carColors[(col + row * 2) % carColors.length]} />
          <mesh position={[0, -0.11, 0.09]}><boxGeometry args={[0.32, 0.17, 0.12]} /><meshStandardMaterial color="#c6e1dd" transparent opacity={0.13} depthWrite={false} roughness={0.2} /></mesh>
        </group>
      )))}
      <Box position={[0, 1.1, 0]} size={[2.1, 0.34, 0.065]} color={palette.ink} />
      <Artwork kind="sign" size={[2, 0.5]} position={[0, 1.1, 0.04]} />
    </group>
  )
}

function ModelShelves({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[0, 0.58, 1.16].map((y, row) => <group key={y}>
        <Box position={[0, y, 0]} size={[1.75, 0.075, 0.41]} color={palette.darkWood} />
        <Box position={[0, y - 0.048, 0.05]} size={[1.56, 0.016, 0.025]} color="#ffda94" glow={2} />
        {[-0.45, 0.43].map((x, col) => <Car key={x} position={[x, y + 0.04, 0]} scale={1.23} color={carColors[(row * 2 + col + 1) % carColors.length]} />)}
      </group>)}
    </group>
  )
}

export function WallDisplays() {
  return (
    <group>
      <CardedDisplay />
      <ModelShelves position={[2.8, 1.91, -3.62]} />
      <ModelShelves position={[-3.65, 1.98, -2.35]} rotation={Math.PI / 2} />
      <group position={[-3.865, 2.52, -0.42]} rotation={[0, Math.PI / 2, 0]}>
        <Box size={[1.28, 1.69, 0.055]} color={palette.ink} />
        <Artwork kind="poster" size={[1.15, 1.55]} position={[0, 0, 0.032]} />
      </group>
    </group>
  )
}
