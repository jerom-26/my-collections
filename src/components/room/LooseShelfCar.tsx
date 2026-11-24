import { useMemo } from 'react'
import { Shape } from 'three'
import type { LooseCarPresentation } from '../../data/collectiblePresentations'
import { Box } from './Primitives'

type Profile = LooseCarPresentation['body']

function shellShape(profile: Profile, length: number, height: number, closeAt?: number) {
  const shape = new Shape()
  profile.forEach(([x, y], index) => {
    if (index === 0) shape.moveTo(x * length, y * height)
    else shape.lineTo(x * length, y * height)
  })
  if (closeAt !== undefined) {
    shape.lineTo(profile[profile.length - 1][0] * length, closeAt * height)
    shape.lineTo(profile[0][0] * length, closeAt * height)
  }
  shape.closePath()
  return shape
}

function CarShell({ shape, width, color, glazing = false }: {
  shape: Shape
  width: number
  color: string
  glazing?: boolean
}) {
  const bevel = 0.006
  return <mesh position={[0, 0, bevel - width / 2]} castShadow receiveShadow>
    <extrudeGeometry args={[shape, {
      depth: width - bevel * 2, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 1, steps: 1,
    }]} />
    <meshStandardMaterial color={color} metalness={glazing ? 0.25 : 0.4} roughness={glazing ? 0.26 : 0.4} />
  </mesh>
}

export default function LooseShelfCar({ presentation }: { presentation: LooseCarPresentation }) {
  const {
    size: [length, height, depth], body, cabin, paint, roof, stripes, hood,
    glazing, wheelRim, sideStripe, frontBumper, exposedEngine, busLivery,
  } = presentation
  const bodyShape = useMemo(() => shellShape(body, length, height, 0.16), [body, length, height])
  const cabinShape = useMemo(() => shellShape(cabin, length, height), [cabin, length, height])
  const tireRadius = Math.min(height * 0.29, depth * 0.24)
  const roofLength = (cabin[2][0] - cabin[1][0]) * length
  const roofX = (cabin[1][0] + cabin[2][0]) * length / 2
  const roofY = cabin[1][1] * height + 0.006
  const [noseX, noseY] = body[body.length - 1]
  const [hoodX, hoodY] = body[body.length - 2]
  const hoodRun = (noseX - hoodX) * length
  const hoodRise = (noseY - hoodY) * height
  const hoodAngle = Math.atan2(hoodRise, hoodRun)

  return <group>
    <CarShell shape={bodyShape} width={depth * 0.82} color={paint} />
    <CarShell shape={cabinShape} width={depth * 0.68} color={glazing ?? (busLivery ? '#9e3442' : '#263e4a')} glazing />
    <Box position={[roofX, roofY, 0]} size={[roofLength, 0.012, depth * 0.64]} color={roof ?? paint} metalness={0.4} />
    {frontBumper && <Box position={[noseX * length + 0.005, noseY * height - 0.031, 0]} size={[0.011, 0.019, depth * 0.8]} color={frontBumper} metalness={0.55} />}
    {(hood || stripes || exposedEngine) && <group
      position={[(noseX + hoodX) * length / 2, (noseY + hoodY) * height / 2 + 0.008, 0]}
      rotation={[0, 0, hoodAngle]}
    >
      {hood && <Box size={[Math.hypot(hoodRun, hoodRise) * 0.87, 0.004, depth * 0.61]} color={hood} />}
      {stripes && [-0.024, 0.024].map((z) =>
        <Box key={z} position={[0, 0, z]} size={[Math.hypot(hoodRun, hoodRise) * 0.88, 0.004, 0.024]} color={stripes} />)}
      {exposedEngine && <>
        <Box position={[-0.018, 0.012, 0]} size={[0.11, 0.028, 0.10]} color="#b5b8b8" metalness={0.55} />
        <Box position={[0.043, 0.021, 0]} size={[0.042, 0.038, 0.045]} color="#a63431" />
        <mesh position={[0.017, 0.033, 0.023]} rotation={[0, 0, -0.14]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.063, 10]} />
          <meshStandardMaterial color="#777b7c" metalness={0.5} roughness={0.45} />
        </mesh>
      </>}
    </group>}
    {stripes && [-0.024, 0.024].map((z) =>
      <Box key={z} position={[roofX, roofY + 0.007, z]} size={[roofLength, 0.003, 0.024]} color={stripes} />)}
    {[-1, 1].map((side) => <group key={side}>
      {[-0.29, 0.29].map((axle) => <group
        key={axle}
        position={[axle * length, tireRadius, side * depth * 0.396]}
        rotation={[side * Math.PI / 2, 0, 0]}
      >
        <mesh castShadow>
          <cylinderGeometry args={[tireRadius, tireRadius, depth * 0.184, 16]} />
          <meshStandardMaterial color="#25292c" roughness={0.85} />
        </mesh>
        <mesh position={[0, depth * 0.093, 0]}>
          <cylinderGeometry args={[tireRadius * 0.64, tireRadius * 0.64, 0.005, 12]} />
          <meshStandardMaterial color={wheelRim ?? (busLivery ? '#f9eee3' : '#a7a9a4')} metalness={0.45} roughness={0.46} />
        </mesh>
        {wheelRim && <mesh position={[0, depth * 0.093 + 0.0025, 0]}>
          <cylinderGeometry args={[tireRadius * 0.51, tireRadius * 0.51, 0.002, 12]} />
          <meshStandardMaterial color="#25292c" roughness={0.58} />
        </mesh>}
      </group>)}
      {sideStripe && <Box position={[0, height * 0.40, side * depth * 0.413]} size={[length * 0.67, 0.018, 0.003]} color={sideStripe} />}
      <Box position={[noseX * length + 0.006, noseY * height - 0.021, side * depth * 0.26]} size={[0.008, 0.019, depth * 0.19]} color="#ffefce" />
      <Box position={[body[0][0] * length - 0.006, body[0][1] * height - 0.025, side * depth * 0.28]} size={[0.008, 0.015, depth * 0.14]} color="#ca5143" />
      {busLivery && <group position={[0, height * 0.43, side * depth * 0.416]}>
        <Box size={[length * 0.54, 0.017, 0.004]} color="#ba573e" />
        <Box position={[-0.032, 0.014, 0]} rotation={[0, 0, -0.3]} size={[length * 0.2, 0.014, 0.004]} color="#f3d9b7" />
        <mesh position={[0.070, 0.014, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.021, 0.021, 0.005, 12]} />
          <meshStandardMaterial color="#d66c56" roughness={0.6} />
        </mesh>
      </group>}
    </group>)}
  </group>
}
