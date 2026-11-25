import { Environment, Lightformer } from '@react-three/drei'

export default function Lighting({ evening }: { evening: boolean }) {
  return (
    <group>
      <ambientLight intensity={evening ? 0.45 : 0.8} color="#fff1d7" />
      <hemisphereLight args={['#e6ecf4', '#8a7155', evening ? 0.8 : 1.3]} />
      <directionalLight
        position={[0, 9, 6]} intensity={evening ? 2.4 : 3.1} color={evening ? '#ffdeb0' : '#fff3df'}
        castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-8} shadow-camera-right={8}
        shadow-camera-top={8} shadow-camera-bottom={-8} shadow-camera-near={1} shadow-camera-far={25}
        shadow-normalBias={0.035} shadow-bias={-0.0002} shadow-radius={3}
      />
      <pointLight position={[-2.45, 2.7, -2.44]} intensity={evening ? 6 : 2} distance={3.9} color="#ffd09a" />
      <pointLight position={[-2.47, 1.65, 1.34]} intensity={evening ? 7.5 : 3.7} distance={3.5} color="#ffdfb5" />
      <pointLight position={[2.36, 2.72, -2.47]} intensity={evening ? 5.5 : 2} distance={3.5} color="#ffd09a" />
      <Environment resolution={64} frames={1}>
        <Lightformer position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 10, 1]} intensity={1.5} color="#fff1d9" />
        <Lightformer position={[4, 3, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 5, 1]} intensity={1} color="#d4e1ef" />
      </Environment>
    </group>
  )
}
