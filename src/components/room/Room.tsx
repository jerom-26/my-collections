import { Artwork } from './Artwork'
import { Box } from './Primitives'
import { palette } from './palette'

const boards = ['#bd9468', '#c49b6d', '#b88e62', '#caa276', '#bc9267', '#c59c73']

export default function Room() {
  return (
    <group>
      <Box position={[0, -0.22, 0]} size={[8.18, 0.42, 8.18]} color="#555950" />
      {Array.from({ length: 16 }, (_, row) => Array.from({ length: row % 2 ? 5 : 4 }, (_, col) => {
        const start = Math.max(-4, -4 + col * 2 - (row % 2))
        const end = Math.min(4, -2 + col * 2 - (row % 2))
        const width = end - start - 0.012
        return <group key={`${row}-${col}`}>
          <Box position={[(start + end) / 2, 0.006, -3.75 + row * 0.5]} size={[width, 0.035, 0.487]} color={boards[(row * 3 + col * 5) % boards.length]} />
          <Artwork kind="wood" size={[width, 0.487]} position={[(start + end) / 2, 0.024, -3.75 + row * 0.5]} rotation={[-Math.PI / 2, 0, 0]} />
        </group>
      }))}
      <Box position={[-4, 1.9, 0]} size={[0.18, 3.8, 8.15]} color={palette.wall} />
      <Box position={[0, 1.9, -4]} size={[8.15, 3.8, 0.18]} color="#c4c6b9" />
      <Box position={[-3.89, 0.13, 0]} size={[0.055, 0.22, 8]} color="#e4d9c3" />
      <Box position={[0, 0.13, -3.89]} size={[8, 0.22, 0.055]} color="#e4d9c3" />
      <Box position={[-4, 3.82, 0]} size={[0.23, 0.08, 8.18]} color="#70786e" />
      <Box position={[0, 3.82, -4]} size={[8.18, 0.08, 0.23]} color="#70786e" />
      <mesh position={[0, -0.46, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <shadowMaterial color="#665f50" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}
