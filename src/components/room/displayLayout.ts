import type { DisplayId, DisplayPresentation, DisplaySlotId } from '../../types/collectibles'

export interface DisplaySlot {
  readonly id: DisplaySlotId
  readonly displayId: DisplayId
  readonly presentation: DisplayPresentation
  /** Local to the cabinet or wall group, rather than room/world coordinates. */
  readonly position: [number, number, number]
  readonly scale: number
}

// Keep these IDs when changing shelf heights or ordering the configuration.
export const cabinetShelves = [
  { id: 'shelf-1', height: 0.34 },
  { id: 'shelf-2', height: 0.99 },
  { id: 'shelf-3', height: 1.64 },
  { id: 'shelf-4', height: 2.29 },
] as const

export const modelShelfLevels = [
  { id: 'shelf-1', height: 0 },
  { id: 'shelf-2', height: 0.58 },
  { id: 'shelf-3', height: 1.16 },
] as const

const cabinetPositions = [{ id: 'left', x: -0.58 }, { id: 'right', x: 0.55 }] as const
const modelPositions = [{ id: 'left', x: -0.45 }, { id: 'right', x: 0.43 }] as const
const modelDisplays = ['back-model-shelves', 'left-model-shelves'] as const
const cardRows = [
  { id: 'row-1', y: 0.59 },
  { id: 'row-2', y: 0.59 - 0.6 },
  { id: 'row-3', y: 0.59 - 2 * 0.6 },
] as const
const cardColumns = [
  { id: 'slot-1', x: -0.81 },
  { id: 'slot-2', x: -0.81 + 0.405 },
  { id: 'slot-3', x: -0.81 + 2 * 0.405 },
  { id: 'slot-4', x: -0.81 + 3 * 0.405 },
  { id: 'slot-5', x: -0.81 + 4 * 0.405 },
] as const

export const cabinetSlots = cabinetShelves.flatMap((shelf) => cabinetPositions.map((side): DisplaySlot => ({
  id: `cabinet:${shelf.id}-${side.id}`,
  displayId: 'cabinet', presentation: 'loose',
  position: [side.x, shelf.height + 0.04, 0.02], scale: 1.55,
})))

export const cardSlots = cardRows.flatMap((row) => cardColumns.map((column): DisplaySlot => ({
  id: `card-wall:${row.id}-${column.id}`,
  displayId: 'card-wall', presentation: 'carded',
  position: [column.x, row.y, 0.05], scale: 0.57,
})))

export const modelSlots = modelDisplays.flatMap((displayId) => modelShelfLevels.flatMap((shelf) => (
  modelPositions.map((side): DisplaySlot => ({
    id: `${displayId}:${shelf.id}-${side.id}`,
    displayId, presentation: 'loose',
    position: [side.x, shelf.height + 0.04, 0], scale: 1.23,
  }))
)))

export const displaySlots: readonly DisplaySlot[] = [...cabinetSlots, ...cardSlots, ...modelSlots]
