/** Packaging visuals and dimensions, independent of inventory and shelf coordinates. */
export type ArtworkQuad = readonly [
  readonly [number, number], readonly [number, number],
  readonly [number, number], readonly [number, number],
]

export type PhysicalPresentation = {
  readonly kind: 'clamshell'
  readonly size: [number, number, number]
} | {
  readonly kind: 'premium-box'
  /** Includes the model on top, so picking/highlighting uses the entire item. */
  readonly size: [number, number, number]
  readonly boxHeight: number
  /** Normalized image corners: top-left, top-right, bottom-right, bottom-left. */
  readonly front: ArtworkQuad
  readonly right: ArtworkQuad
  readonly topModel?: 'porsche-911-gt1'
}

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
}
