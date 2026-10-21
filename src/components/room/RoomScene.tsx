import { useEffect, useRef } from 'react'
import type { ComponentRef } from 'react'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import Bed from '../../Bed'
import { ArtworkProvider } from './Artwork'
import Decorations from './Decorations'
import { DisplayCabinet, WallDisplays } from './Displays'
import Lighting from './Lighting'
import Room from './Room'
import Workstation from './Workstation'

function CameraRig({ resetKey }: { resetKey: number }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null)
  const camera = useThree((state) => state.camera)
  const aspect = useThree((state) => state.size.width / state.size.height)
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    const distance = aspect < 1 ? 1.1 / aspect : 1
    camera.position.set(11 * distance, 9.4 * distance, 12 * distance)
    camera.lookAt(0, 1, 0)
    controls.current?.target.set(0, 1, 0)
    controls.current?.update()
    invalidate()
  }, [camera, aspect, resetKey, invalidate])

  return <OrbitControls key={resetKey} ref={controls} makeDefault enableDamping dampingFactor={0.08} minDistance={6} maxDistance={38} minPolarAngle={0.16} maxPolarAngle={Math.PI / 2 - 0.04} target={[0, 1, 0]} />
}

export default function RoomScene({ evening, resetKey }: { evening: boolean; resetKey: number }) {
  return (
    <>
      <color attach="background" args={['#e5ddce']} />
      <Lighting evening={evening} />
      <ArtworkProvider>
        <Room />
        <Bed />
        <Workstation />
        <DisplayCabinet />
        <WallDisplays />
        <Decorations evening={evening} />
        <ContactShadows position={[0, 0.026, 0]} scale={12} far={4.5} opacity={0.38} blur={2} resolution={512} frames={1} color="#554332" />
      </ArtworkProvider>
      <CameraRig resetKey={resetKey} />
    </>
  )
}
