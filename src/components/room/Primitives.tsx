import type { ThreeElements } from '@react-three/fiber'

type BoxProps = Omit<ThreeElements['mesh'], 'args'> & {
  size: [number, number, number]
  color: string
  glow?: number
  metalness?: number
}

export function Box({ size, color, glow = 0, metalness = 0, ...props }: BoxProps) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={metalness ? 0.4 : 0.78} metalness={metalness} emissive={color} emissiveIntensity={glow} />
    </mesh>
  )
}

export function Car({ color = '#d5a142', ...props }: ThreeElements['group'] & { color?: string }) {
  return (
    <group {...props}>
      <Box position={[0, 0.105, 0]} size={[0.47, 0.105, 0.205]} color={color} metalness={0.45} />
      <Box position={[-0.025, 0.19, 0]} size={[0.235, 0.09, 0.175]} color={color} metalness={0.4} />
      <Box position={[-0.025, 0.205, 0]} size={[0.18, 0.047, 0.181]} color="#263d45" metalness={0.45} />
      <Box position={[-0.025, 0.24, 0]} size={[0.16, 0.013, 0.16]} color={color} metalness={0.4} />
      {[-0.15, 0.15].flatMap((x) => [-0.104, 0.104].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0.075, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.063, 0.063, 0.035, 10]} />
          <meshStandardMaterial color="#252b2c" roughness={0.8} />
        </mesh>
      )))}
      <Box position={[0.239, 0.122, 0]} size={[0.008, 0.027, 0.145]} color="#ffe4a6" />
      <Box position={[-0.239, 0.122, 0]} size={[0.008, 0.025, 0.145]} color="#b44837" />
    </group>
  )
}

export function Plant({ scale = 1, ...props }: Omit<ThreeElements['group'], 'scale'> & { scale?: number }) {
  return (
    <group scale={scale} {...props}>
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.115, 0.3, 12]} />
        <meshStandardMaterial color="#c6b89d" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.315, 0]}>
        <cylinderGeometry args={[0.145, 0.145, 0.015, 12]} />
        <meshStandardMaterial color="#594837" />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => {
        const angle = i * 2.4
        return <mesh key={i} position={[Math.cos(angle) * 0.13, 0.46 + (i % 3) * 0.09, Math.sin(angle) * 0.13]} rotation={[Math.sin(angle) * 0.65, angle, Math.cos(angle) * 0.65]} scale={[0.09, 0.25, 0.045]} castShadow>
          <sphereGeometry args={[1, 7, 5]} />
          <meshStandardMaterial color={i % 2 ? '#647650' : '#3f5d42'} roughness={0.9} />
        </mesh>
      })}
    </group>
  )
}
