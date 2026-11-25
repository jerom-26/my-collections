import { Box3, Mesh, Ray, Vector3 } from 'three'
import type { Object3D } from 'three'
import type { CameraPose } from './cameraFraming'

export interface CameraObstacle {
  object: Mesh
  bounds: Box3
  clearance: Box3
  glass: boolean
}

export interface FocusView extends CameraPose {
  frontAngle: number
  minDistance: number
}

export function getCameraObstacles(scene: Object3D) {
  const obstacles: CameraObstacle[] = []
  scene.updateMatrixWorld(true)
  scene.traverseVisible((object) => {
    if (!(object instanceof Mesh)) return
    const glass = object.name === 'cabinet-glass'
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    if (!glass && !materials.some((material) => material.visible && material.opacity >= 0.95)) return
    object.geometry.computeBoundingBox()
    const bounds = object.geometry.boundingBox!.clone().applyMatrix4(object.matrixWorld)
    obstacles.push({ object, bounds, clearance: bounds.clone().expandByScalar(0.14), glass })
  })
  return obstacles
}

function clearSegment(from: Vector3, to: Vector3, boxes: Box3[]) {
  const delta = to.clone().sub(from)
  const length = delta.length()
  if (length < 0.0001) return !boxes.some((box) => box.containsPoint(from))
  const ray = new Ray(from, delta.divideScalar(length))
  const intersection = new Vector3()
  return boxes.every((box) => !box.containsPoint(from)
    && (!ray.intersectBox(box, intersection) || intersection.distanceToSquared(from) > length * length))
}

export function cameraPath(from: Vector3, to: Vector3, obstacles: CameraObstacle[]) {
  const boxes = obstacles.map(({ clearance }) => clearance)
  if (clearSegment(from, to, boxes)) return [from, to]

  // The dollhouse has an open top. Travel above it if the direct route is blocked.
  const height = Math.max(4.45, from.y, to.y)
  const path = [from, new Vector3(from.x, height, from.z), new Vector3(to.x, height, to.z), to]
  for (let i = 1; i < path.length; i++) {
    if (!clearSegment(path[i - 1], path[i], boxes)) return null
  }
  return path
}

export function safeCameraStep(from: Vector3, to: Vector3, obstacles: CameraObstacle[]) {
  return clearSegment(from, to, obstacles.map(({ clearance }) => clearance))
}

export function findFocusView(item: Object3D, aspect: number, fov: number, obstacles: CameraObstacle[]) {
  const hitbox = item.getObjectByName('collectible-hitbox')
  if (!(hitbox instanceof Mesh)) return null
  hitbox.geometry.computeBoundingBox()
  const bounds = hitbox.geometry.boundingBox!
  const target = hitbox.localToWorld(bounds.getCenter(new Vector3()))
  const size = bounds.getSize(new Vector3()).multiply(hitbox.getWorldScale(new Vector3()))
  const forward = new Vector3(0, 0, 1).transformDirection(item.matrixWorld)
  const right = new Vector3(forward.z, 0, -forward.x)
  const aperture = Math.tan(fov * Math.PI / 360)
  const distance = Math.max(1.28, Math.max(size.y, size.x / Math.max(0.3, aspect)) / (2 * aperture * 0.57) + size.z / 2)
  const sightObstacles = obstacles.filter(({ object, glass }) => {
    if (glass) return false
    for (let parent: Object3D | null = object; parent; parent = parent.parent) {
      if (parent === item) return false
    }
    return true
  }).map(({ bounds }) => bounds)

  for (const offset of [0.18, 0, -0.18, 0.36, -0.36]) {
    for (const rise of [0.14, 0.28, 0.045]) {
      const position = target.clone().addScaledVector(forward, distance).addScaledVector(right, distance * offset)
      position.y += distance * rise
      if (obstacles.some(({ clearance }) => clearance.containsPoint(position))) continue
      if (!clearSegment(position, target, sightObstacles)) continue
      return { position, target, frontAngle: Math.atan2(forward.x, forward.z), minDistance: Math.max(0.9, distance * 0.64) } satisfies FocusView
    }
  }
  return null
}
