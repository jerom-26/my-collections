import { useEffect, useRef } from 'react'
import type { ComponentRef } from 'react'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Mesh, Raycaster } from 'three'
import Bed from '../../Bed'
import { ArtworkProvider } from './Artwork'
import Decorations from './Decorations'
import { DisplayCabinet, WallDisplays } from './Displays'
import Lighting from './Lighting'
import Room from './Room'
import Workstation from './Workstation'
import type { Collectible, DisplaySlotId } from '../../types/collectibles'

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

interface RoomSceneProps {
  collectiblesBySlot: ReadonlyMap<DisplaySlotId, Collectible>
  evening: boolean
  resetKey: number
  selectedCollectibleId: string | null
  onSelectCollectible: (id: string) => void
}

export default function RoomScene({ evening, resetKey, selectedCollectibleId, onSelectCollectible, collectiblesBySlot }: RoomSceneProps) {
  const canvas = useThree((state) => state.gl.domElement)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)
  const pickingRay = useRef(new Raycaster())
  const gesture = useRef({ pointerId: -1, x: 0, y: 0, blocked: true, clickReady: false })

  useEffect(() => {
    const pointers = new Set<number>()
    const modifiers = (event: PointerEvent) => event.shiftKey || event.ctrlKey || event.metaKey || event.altKey
    const moved = (event: PointerEvent) => Math.hypot(event.clientX - gesture.current.x, event.clientY - gesture.current.y) > 5
    const down = (event: PointerEvent) => {
      pointers.add(event.pointerId)
      if (pointers.size > 1) {
        gesture.current.blocked = true
        gesture.current.clickReady = false
        return
      }
      gesture.current = {
        pointerId: event.pointerId, x: event.clientX, y: event.clientY,
        blocked: !event.isPrimary || event.button !== 0 || modifiers(event), clickReady: false,
      }
    }
    const move = (event: PointerEvent) => {
      if (pointers.has(event.pointerId) && (moved(event) || modifiers(event))) gesture.current.blocked = true
    }
    const up = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return
      move(event)
      pointers.delete(event.pointerId)
      gesture.current.clickReady = event.pointerId === gesture.current.pointerId && pointers.size === 0 && !gesture.current.blocked
    }
    const cancel = () => {
      pointers.clear()
      gesture.current.blocked = true
      gesture.current.clickReady = false
    }
    // Observe native gestures without cancelling them or taking pointer capture from OrbitControls.
    canvas.addEventListener('pointerdown', down, true)
    document.addEventListener('pointermove', move, true)
    document.addEventListener('pointerup', up, true)
    document.addEventListener('pointercancel', cancel, true)
    canvas.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('blur', cancel)
    return () => {
      canvas.removeEventListener('pointerdown', down, true)
      document.removeEventListener('pointermove', move, true)
      document.removeEventListener('pointerup', up, true)
      document.removeEventListener('pointercancel', cancel, true)
      canvas.removeEventListener('wheel', cancel)
      window.removeEventListener('blur', cancel)
    }
  }, [canvas])

  const selectCollectible = (id: string, event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    const click = gesture.current
    const primaryPointer = !('pointerId' in event.nativeEvent) || event.nativeEvent.pointerId === click.pointerId
    if (!click.clickReady || !primaryPointer || event.delta > 5 || event.button !== 0 || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return
    click.clickReady = false

    // Glass stays click-through; solid furniture/walls still obscure cars behind them.
    const ray = pickingRay.current
    ray.ray.copy(event.ray)
    ray.camera = camera
    ray.far = event.distance
    const blocked = ray.intersectObjects(scene.children, true).some((hit) => {
      if (!(hit.object instanceof Mesh) || !hit.object.visible || hit.distance >= event.distance - 0.001) return false
      for (let parent = hit.object.parent; parent; parent = parent.parent) {
        if (parent === event.eventObject) return false
      }
      const material = Array.isArray(hit.object.material)
        ? hit.object.material[hit.face?.materialIndex ?? 0] : hit.object.material
      return material?.visible && material.opacity >= 0.95
    })
    if (!blocked) onSelectCollectible(id)
  }

  return (
    <>
      <color attach="background" args={['#da9921']} />
      <Lighting evening={evening} />
      <ArtworkProvider>
        <Room />
        <Bed />
        <Workstation />
        <DisplayCabinet collectiblesBySlot={collectiblesBySlot} selectedCollectibleId={selectedCollectibleId} onSelectCollectible={selectCollectible} />
        <WallDisplays collectiblesBySlot={collectiblesBySlot} selectedCollectibleId={selectedCollectibleId} onSelectCollectible={selectCollectible} />
        <Decorations evening={evening} />
        <ContactShadows position={[0, 0.026, 0]} scale={12} far={4.5} opacity={0.38} blur={2} resolution={512} frames={1} color="#554332" />
      </ArtworkProvider>
      <CameraRig resetKey={resetKey} />
    </>
  )
}
