import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Bed from "./bed";

function App() {
  return (
    <main className="showroom">
      <h1>My Personal Collections</h1>
      <p>This is my personal collection of die cast cars and action figures</p>

      <div className="scene">
        <Canvas camera={{ position: [5, 4, 8], fov: 50 }}>

          <Bed />

          <color attach="background" args={["#cabfd8"]} />
          <Environment preset="sunset" />

          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />

          {/* Floor */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[8, 0.2, 8]} />
            <meshStandardMaterial color="#796198" />
          </mesh>

          {/* Left Wall */}
          <mesh position={[-3.9, 1.5, 0]}>
            <boxGeometry args={[0.2, 3, 8]} />
            <meshStandardMaterial color="#9885bd" />
          </mesh>

          {/* Back Wall */}
          <mesh position={[0, 1.5, -4]}>
            <boxGeometry args={[8, 3, 0.2]} />
            <meshStandardMaterial color="#8576a3" />
          </mesh>

          <OrbitControls />

        </Canvas>
      </div>
    </main>
  );
}

export default App;