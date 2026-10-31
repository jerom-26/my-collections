/** Inventory information is independent of shelf coordinates and rendering. */
export interface Collectible {
  readonly id: string
  readonly name: string
  readonly category: string
  readonly manufacturer?: string
  readonly edition?: string
  readonly color?: string
  readonly isSample: boolean
  /** Media references contain no physical display coordinates. */
  readonly imageUrl?: string
  /** Optional crop in normalized image coordinates, measured from the top-left. */
  readonly imageCrop?: { readonly left: number; readonly top: number; readonly width: number; readonly height: number }
  readonly representation?: 'boxed'
  readonly series?: string
  readonly boxNumber?: string
  readonly productNumber?: string
  readonly packaging?: string
  readonly modelUrl?: string
  readonly wax?: WaxCollectibleMetadata
}

export interface WaxCollectibleMetadata {
  readonly assetId: string
  readonly owner: string
  readonly collection: string
  readonly collectionName?: string
  readonly series?: string
  readonly set?: string
  readonly make?: string
  readonly model?: string
  readonly rarity?: string
  readonly templateId?: string
  readonly mint?: string
  readonly maxSupply?: string
  readonly year?: string
  readonly designer?: string
  readonly animationUrl?: string
}

export type DisplayId = 'cabinet' | 'card-wall' | 'back-model-shelves' | 'left-model-shelves'
export type DisplaySlotId = `${DisplayId}:${string}`
export type DisplayPresentation = 'loose' | 'carded'

/** An omitted key or null value leaves that physical slot empty. */
export type DisplayAssignments = Readonly<Partial<Record<DisplaySlotId, string | null>>>
