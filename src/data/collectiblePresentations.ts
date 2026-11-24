/** Packaging visuals and dimensions, independent of inventory and shelf coordinates. */
export type ArtworkQuad = readonly [
  readonly [number, number], readonly [number, number],
  readonly [number, number], readonly [number, number],
]

type ProfilePoint = readonly [x: number, y: number]

export interface LooseCarPresentation {
  readonly kind: 'loose-car'
  readonly size: [number, number, number]
  readonly baseOffset: number
  readonly paint: string
  /** Side profiles measured in fractions of the model's length and height. Front is +X. */
  readonly body: readonly ProfilePoint[]
  readonly cabin: readonly [ProfilePoint, ProfilePoint, ProfilePoint, ProfilePoint]
  readonly roof?: string
  readonly stripes?: string
  readonly hood?: string
  readonly glazing?: string
  readonly wheelRim?: string
  readonly sideStripe?: string
  readonly frontBumper?: string
  readonly exposedEngine?: boolean
  readonly busLivery?: boolean
}

export type PhysicalPresentation = {
  readonly kind: 'clamshell'
  readonly size: [number, number, number]
} | {
  readonly kind: 'box'
  readonly size: [number, number, number]
  readonly bodyColor: string
  readonly protector: boolean
  /** Align this box with the shelf surface below the slot's original car anchor. */
  readonly baseOffset: number
} | {
  readonly kind: 'premium-box'
  /** Includes the model on top, so picking/highlighting uses the entire item. */
  readonly size: [number, number, number]
  readonly boxHeight: number
  /** Normalized image corners: top-left, top-right, bottom-right, bottom-left. */
  readonly front: ArtworkQuad
  readonly right: ArtworkQuad
  readonly topModel?: 'porsche-911-gt1'
} | {
  readonly kind: 'blister'
  readonly size: [number, number, number]
  readonly baseOffset: number
} | LooseCarPresentation

// The wall shelf tops sit 0.0375 units above their centers. Slot anchors sit 0.04 above.
const wallShelfBaseOffset = -0.0025
const mainlineBlister = { kind: 'blister', size: [0.32, 0.49, 0.12], baseOffset: wallShelfBaseOffset } satisfies PhysicalPresentation

export const collectiblePresentations: Readonly<Partial<Record<string, PhysicalPresentation>>> = {
  'physical-hot-wheels-alfa-romeo-155-v6-ti-2024': {
    kind: 'clamshell', size: [0.36, 0.55, 0.14],
  },
  'physical-hot-wheels-chevelle-ss-396-series-6': {
    kind: 'clamshell', size: [0.36, 0.55, 0.14],
  },
  'physical-hot-wheels-lewandowski-porsche-911-gt1': {
    kind: 'premium-box', size: [0.38, 0.58, 0.28], boxHeight: 0.48,
    front: [[0.2081, 0.1894], [0.6656, 0.3612], [0.6306, 0.9112], [0.2456, 0.695]],
    right: [[0.6656, 0.3612], [0.825, 0.2412], [0.7738, 0.7831], [0.6306, 0.9112]],
    topModel: 'porsche-911-gt1',
  },
  'physical-funko-thor-comic-cover-09': {
    kind: 'box', size: [0.37, 0.55, 0.23], bodyColor: '#707b77', protector: true, baseOffset: -0.0175,
  },
  'physical-brick-shop-cadillac-project-gtp-hypercar': {
    kind: 'box', size: [0.76, 0.44, 0.22], bodyColor: '#143857', protector: false, baseOffset: -0.0175,
  },
  'physical-hot-wheels-corvette-stingray': {
    kind: 'loose-car', size: [0.66, 0.235, 0.273], baseOffset: wallShelfBaseOffset, paint: '#f3efe3',
    hood: '#343439', sideStripe: '#d87d24', wheelRim: '#b23931',
    body: [[-0.47, 0.53], [-0.34, 0.66], [-0.12, 0.52], [0.17, 0.51], [0.30, 0.60], [0.48, 0.38]],
    cabin: [[-0.35, 0.52], [-0.18, 0.89], [-0.02, 0.89], [0.15, 0.48]],
  },
  'physical-hot-wheels-ford-shelby-gt350r': {
    kind: 'loose-car', size: [0.67, 0.265, 0.27], baseOffset: wallShelfBaseOffset, paint: '#a8adb0',
    stripes: '#292e34', wheelRim: '#43474b',
    body: [[-0.47, 0.52], [-0.32, 0.61], [0.18, 0.57], [0.47, 0.50]],
    cabin: [[-0.39, 0.54], [-0.19, 0.89], [0.06, 0.89], [0.23, 0.53]],
  },
  'physical-hot-wheels-land-rover-defender-110': {
    kind: 'loose-car', size: [0.68, 0.34, 0.30], baseOffset: wallShelfBaseOffset, paint: '#34363a',
    glazing: '#282a2e', wheelRim: '#1e2023',
    body: [[-0.47, 0.52], [-0.43, 0.56], [0.38, 0.54], [0.47, 0.50]],
    cabin: [[-0.46, 0.49], [-0.44, 0.88], [0.15, 0.88], [0.23, 0.49]],
  },
  'physical-hot-wheels-mattel-dream-mobile': {
    kind: 'loose-car', size: [0.63, 0.24, 0.26], baseOffset: wallShelfBaseOffset, paint: '#a92e45',
    roof: '#252629', glazing: '#24262a', frontBumper: '#c1c3c3',
    body: [[-0.48, 0.66], [-0.27, 0.52], [0.20, 0.57], [0.35, 0.54], [0.48, 0.38]],
    cabin: [[-0.24, 0.50], [-0.09, 0.86], [0.08, 0.86], [0.29, 0.49]],
  },
  'physical-hot-wheels-custom-71-datsun-240z': {
    kind: 'loose-car', size: [0.65, 0.235, 0.255], baseOffset: wallShelfBaseOffset, paint: '#3d3936',
    hood: '#242329', sideStripe: '#814b2f', exposedEngine: true,
    body: [[-0.47, 0.52], [-0.34, 0.58], [0.19, 0.56], [0.47, 0.49]],
    cabin: [[-0.41, 0.49], [-0.18, 0.90], [-0.03, 0.90], [0.15, 0.51]],
  },
  'physical-hot-wheels-custom-68-camaro': {
    kind: 'loose-car', size: [0.67, 0.252, 0.27], baseOffset: wallShelfBaseOffset, paint: '#f1eee8',
    stripes: '#bc3031', sideStripe: '#bc3031', wheelRim: '#27292a',
    body: [[-0.48, 0.53], [-0.37, 0.62], [0.16, 0.54], [0.47, 0.46]],
    cabin: [[-0.39, 0.52], [-0.19, 0.87], [-0.02, 0.87], [0.16, 0.51]],
  },
  'physical-hot-wheels-70-plymouth-aar-cuda': {
    kind: 'loose-car', size: [0.68, 0.262, 0.285], baseOffset: wallShelfBaseOffset, paint: '#242426',
    hood: '#1f2022', wheelRim: '#a32f26',
    body: [[-0.48, 0.60], [-0.32, 0.61], [0.17, 0.57], [0.47, 0.52]],
    cabin: [[-0.36, 0.54], [-0.23, 0.87], [-0.04, 0.87], [0.15, 0.52]],
  },
  'physical-hot-wheels-aint-fare': {
    kind: 'loose-car', size: [0.72, 0.29, 0.27], baseOffset: wallShelfBaseOffset, paint: '#292e34', busLivery: true,
    body: [[-0.48, 0.55], [-0.41, 0.60], [0.37, 0.60], [0.48, 0.52]],
    cabin: [[-0.46, 0.51], [-0.43, 0.90], [0.31, 0.90], [0.47, 0.46]],
  },
  // The Ferrari photo shows a short card; the Veneno has a tall Silver Series card.
  'physical-hot-wheels-ferrari-f40-competizione': { ...mainlineBlister, size: [0.357, 0.36, 0.12] },
  'physical-hot-wheels-lamborghini-veneno': { ...mainlineBlister, size: [0.322, 0.49, 0.13] },
  'physical-hot-wheels-bmw-m4-gt3': { ...mainlineBlister, size: [0.342, 0.49, 0.12] },
  'physical-hot-wheels-nissan-skyline-bnr34': { ...mainlineBlister, size: [0.345, 0.49, 0.12] },
}
