import { useLayoutEffect, useRef } from 'react'
import type { ComponentRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Vector3 } from 'three'
import { cameraPath, findFocusView, getCameraObstacles, safeCameraStep } from './cameraFocus'
import type { CameraObstacle, FocusView } from './cameraFocus'
import { frameRoom } from './cameraFraming'
import type { CameraPose } from './cameraFraming'

export type CameraCommand = { kind: 'focus'; id: string } | { kind: 'back' } | { kind: 'reset' }

export interface CameraRigProps {
  command: CameraCommand | null
  onFocusedChange: (id: string | null) => void
  onCameraMessage: (message: string | null) => void
}

type Controls = ComponentRef<typeof OrbitControls>
type ReturnView = CameraPose & { manual: boolean; aspect: number }
type Travel = {
  path: Vector3[]
  lengths: number[]
  distance: number
  elapsed: number
  duration: number
  fromTarget: Vector3
  toTarget: Vector3
  focus: FocusView | null
}

function setOrbitLimits(orbit: Controls, focus: FocusView | null) {
  orbit.minDistance = focus?.minDistance ?? 6
  orbit.maxDistance = focus ? 7 : 80
  orbit.minPolarAngle = focus ? 1.03 : 0.16
  orbit.maxPolarAngle = Math.PI / 2 - 0.04
  orbit.minAzimuthAngle = focus ? focus.frontAngle - 0.5 : -Infinity
  orbit.maxAzimuthAngle = focus ? focus.frontAngle + 0.5 : Infinity
  orbit.enablePan = !focus
}

export default function CameraRig({ command, onFocusedChange, onCameraMessage }: CameraRigProps) {
  const controls = useRef<Controls>(null)
  const camera = useThree((state) => state.camera)
  const scene = useThree((state) => state.scene)
  const aspect = useThree((state) => state.size.width / Math.max(1, state.size.height))
  const invalidate = useThree((state) => state.invalidate)
  const handled = useRef<CameraCommand | null>(null)
  const manual = useRef(false)
  const returnView = useRef<ReturnView | null>(null)
  const travel = useRef<Travel | null>(null)
  const activeFocus = useRef<FocusView | null>(null)
  const obstacles = useRef<CameraObstacle[]>([])
  const safePosition = useRef(new Vector3())

  useLayoutEffect(() => {
    const orbit = controls.current
    if (!orbit || !(camera instanceof PerspectiveCamera) || aspect <= 0) return

    const finish = (pose: CameraPose, focus: FocusView | null) => {
      travel.current = null
      activeFocus.current = focus
      setOrbitLimits(orbit, focus)
      camera.position.copy(pose.position)
      orbit.target.copy(pose.target)
      safePosition.current.copy(camera.position)
      orbit.enabled = true
      orbit.update()
      invalidate()
    }

    if (command && handled.current !== command) {
      handled.current = command
      onCameraMessage(null)
      if (command.kind === 'reset') {
        manual.current = false
        returnView.current = null
        onFocusedChange(null)
        // Flush residual OrbitControls movement before applying the reset pose.
        orbit.enableDamping = false
        orbit.update()
        orbit.enableDamping = true
        finish(frameRoom(aspect, camera.fov), null)
        return
      }

      let destination: CameraPose
      let focus: FocusView | null = null
      const before = returnView.current
      if (command.kind === 'focus') {
        const item = scene.getObjectByName(`collectible-${command.id}`)
        obstacles.current = getCameraObstacles(scene)
        focus = item ? findFocusView(item, aspect, camera.fov, obstacles.current) : null
        if (!focus) {
          onCameraMessage('This collectible has no clear close-up from the current view.')
          return
        }
        destination = focus
      } else {
        if (!before) return
        destination = !before.manual && Math.abs(aspect - before.aspect) > 0.01 ? frameRoom(aspect, camera.fov) : before
      }

      const path = cameraPath(camera.position.clone(), destination.position, obstacles.current)
      if (!path) {
        onCameraMessage('The route is blocked. Reset the camera for a clear view.')
        return
      }
      const target = orbit.target.clone()
      const position = camera.position.clone()
      activeFocus.current = null
      orbit.enabled = false
      orbit.enableDamping = false
      orbit.update()
      orbit.enableDamping = true
      camera.position.copy(position)
      orbit.target.copy(target)

      if (command.kind === 'focus') {
        returnView.current ??= { position, target, manual: manual.current, aspect }
        onFocusedChange(command.id)
      } else {
        manual.current = before!.manual
        returnView.current = null
        onFocusedChange(null)
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finish(destination, focus)
        return
      }
      const lengths = path.slice(1).map((point, index) => point.distanceTo(path[index]))
      const distance = lengths.reduce((sum, length) => sum + length, 0)
      travel.current = { path, lengths, distance, elapsed: 0, duration: path.length > 2 ? 0.92 : 0.65,
        fromTarget: target, toTarget: destination.target, focus }
      invalidate()
    } else if (!manual.current && !travel.current && !activeFocus.current) {
      finish(frameRoom(aspect, camera.fov), null)
    }
  }, [aspect, camera, command, invalidate, onCameraMessage, onFocusedChange, scene])

  useFrame((_, delta) => {
    const motion = travel.current
    const orbit = controls.current
    if (!motion || !orbit) return
    motion.elapsed += Math.min(delta, 0.05)
    const progress = Math.min(1, motion.elapsed / motion.duration)
    const mix = progress * progress * (3 - 2 * progress)
    let remaining = mix * motion.distance
    let segment = 0
    while (segment < motion.lengths.length - 1 && remaining >= motion.lengths[segment]) {
      remaining -= motion.lengths[segment++]
    }
    camera.position.lerpVectors(motion.path[segment], motion.path[segment + 1], motion.lengths[segment] ? remaining / motion.lengths[segment] : 1)
    orbit.target.lerpVectors(motion.fromTarget, motion.toTarget, mix)
    camera.lookAt(orbit.target)
    if (progress < 1) {
      invalidate()
      return
    }
    travel.current = null
    activeFocus.current = motion.focus
    safePosition.current.copy(camera.position)
    setOrbitLimits(orbit, motion.focus)
    orbit.enabled = true
    orbit.update()
  })

  return <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.08}
    onStart={() => { if (!activeFocus.current) manual.current = true }}
    onChange={() => {
      if (!activeFocus.current || camera.position.equals(safePosition.current)) return
      if (safeCameraStep(safePosition.current, camera.position, obstacles.current)) safePosition.current.copy(camera.position)
      else {
        camera.position.copy(safePosition.current)
        if (controls.current) camera.lookAt(controls.current.target)
      }
    }} />
}
