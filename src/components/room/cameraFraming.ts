import { Vector3 } from 'three'

const roomCorners = [
  [-4.12, -0.43, -4.12], [-4.12, -0.43, 4.12], [4.12, -0.43, -4.12], [4.12, -0.43, 4.12],
  [-4.12, 3.87, -4.12], [-4.12, 3.87, 4.12], [4.12, 3.87, -4.12],
].map(([x, y, z]) => new Vector3(x, y, z))

export interface CameraPose {
  position: Vector3
  target: Vector3
}

export function frameRoom(aspect: number, fov: number): CameraPose {
  const back = new Vector3(11, 8.4, 12).normalize()
  const right = new Vector3().crossVectors(new Vector3(0, 1, 0), back).normalize()
  const up = new Vector3().crossVectors(back, right)
  const tan = Math.tan(fov * Math.PI / 360)
  const fit = (axis: Vector3, limit: number) => {
    // Fit the perspective projection of the floor and the two wall tops.
    const high = Math.max(...roomCorners.map((point) => point.dot(axis) + limit * point.dot(back)))
    const low = Math.min(...roomCorners.map((point) => point.dot(axis) - limit * point.dot(back)))
    return { distance: (high - low) / (2 * limit), center: (high + low) / 2 }
  }
  const horizontal = fit(right, tan * Math.max(aspect, 0.25) * (aspect < 1 ? 0.92 : 0.94))
  const vertical = fit(up, tan * (aspect < 1 ? 0.84 : 0.89))
  const target = right.multiplyScalar(horizontal.center).addScaledVector(up, vertical.center + (aspect < 1 ? 0.02 : -0.07))
  const distance = Math.max(horizontal.distance, vertical.distance)
  return { target, position: target.clone().addScaledVector(back, distance) }
}
