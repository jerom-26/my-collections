export default function Bed() {
  return (
    <group position={[3, 0.25, -1.65]}>

      {/* Bed frame */}
      <mesh>
        <boxGeometry args={[1.6, 0.5, 3]} />
        <meshStandardMaterial color="brown" />
      </mesh>

      {/* Mattress */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.5, 0.2, 3]} />
        <meshStandardMaterial color="beige" />
      </mesh>

      {/* Pillow */}
      <mesh position={[0, 0.55, -1.2]}>
        <boxGeometry args={[1.4, 0.2, 0.5]} />
        <meshStandardMaterial color="gold" />
      </mesh>

    </group>
  );
}