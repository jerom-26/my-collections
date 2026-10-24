/** Inventory information is independent of shelf coordinates and rendering. */
export interface Collectible {
  readonly id: string
  readonly name: string
  readonly category: string
  readonly manufacturer: string
  readonly edition: string
  readonly color: string
  readonly isSample: boolean
  /** Optional asset references; the current renderer uses procedural placeholders. */
  readonly imageUrl?: string
  readonly modelUrl?: string
}

export type DisplayId = 'cabinet' | 'card-wall' | 'back-model-shelves' | 'left-model-shelves'
export type DisplaySlotId = `${DisplayId}:${string}`
export type DisplayPresentation = 'loose' | 'carded'

/** An omitted key or null value leaves that physical slot empty. */
export type DisplayAssignments = Readonly<Partial<Record<DisplaySlotId, string | null>>>
