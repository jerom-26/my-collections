import { Artwork } from './Artwork'
import { Box, Plant } from './Primitives'
import { palette } from './palette'

export default function Decorations({ evening }: { evening: boolean }) {
  return (
    <group>
      <Box position={[-1.24, 0.045, 0.92]} size={[2.65, 0.035, 3.34]} color="#485c60" />
      <Artwork kind="rug" size={[2.6, 3.28]} position={[-1.24, 0.066, 0.92]} rotation={[-Math.PI / 2, 0, 0]} />
      <group position={[3.55, 0, -1.48]}>
        <Box position={[0, 0.39, 0]} size={[0.62, 0.76, 0.62]} color={palette.darkWood} />
        <Box position={[0, 0.79, 0]} size={[0.69, 0.08, 0.69]} color={palette.wood} />
        <Box position={[0, 0.42, 0.316]} size={[0.47, 0.46, 0.018]} color="#3d4037" />
        {['#b9bdab', '#d3ac76', '#8a9c98'].map((color, i) => <Box key={color} position={[-0.01, 0.25 + i * 0.075, 0.27]} size={[0.37 - i * 0.035, 0.055, 0.2]} color={color} />)}
        <mesh position={[0, 0.865, 0]} castShadow><cylinderGeometry args={[0.16, 0.2, 0.06, 20]} /><meshStandardMaterial color={palette.brass} metalness={0.6} roughness={0.4} /></mesh>
        <mesh position={[0, 1.065, 0]} castShadow><sphereGeometry args={[0.21, 20, 16]} /><meshStandardMaterial color="#ffe6b2" emissive="#ffc678" emissiveIntensity={evening ? 1.9 : 0.5} roughness={0.6} /></mesh>
        <pointLight position={[0, 1.25, 0]} intensity={evening ? 4 : 0.7} color="#ffbd71" distance={3.5} decay={2} />
      </group>
      <Plant position={[3.43, 0.04, -3.02]} scale={1.9} />
      <Plant position={[0.02, 0.04, -1.86]} scale={0.95} />
      <group position={[-3.5, 3.24, -3.51]}>
        <Plant scale={0.72} />
        {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0.09 + Math.sin(i * 1.7) * 0.06, -0.12 - i * 0.11, 0.12]} scale={[0.09, 0.11, 0.04]} rotation={[0, 0, i % 2 ? 0.6 : -0.6]} castShadow><sphereGeometry args={[1, 7, 5]} /><meshStandardMaterial color={i % 2 ? '#526c45' : '#71804a'} /></mesh>)}
      </group>
      <Box position={[-3.5, 3.21, -3.52]} size={[0.65, 0.08, 0.65]} color={palette.darkWood} />
      <group position={[2.84, 3.53, -3.85]}>
        <Box size={[1.76, 0.25, 0.04]} color="#e3d8bf" />
        {Array.from({ length: 9 }, (_, i) => <Box key={i} position={[-0.68 + i * 0.17, 0, 0.03]} size={[0.04, 0.12, 0.012]} color={i < 6 ? '#a26949' : '#6f7e70'} />)}
      </group>
    </group>
  )
}
