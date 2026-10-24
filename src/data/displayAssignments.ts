import type { Collectible, DisplayAssignments, DisplaySlotId } from '../types/collectibles'

/** Slot keys are physical locations; record IDs stay the same when records move. */
export const displayAssignments: DisplayAssignments = {
  'cabinet:shelf-1-left': 'sample-car-01',
  'cabinet:shelf-1-right': 'sample-car-02',
  'cabinet:shelf-2-left': 'sample-car-03',
  'cabinet:shelf-2-right': 'sample-car-04',
  'cabinet:shelf-3-left': 'sample-car-05',
  'cabinet:shelf-3-right': 'sample-car-06',
  'cabinet:shelf-4-left': 'sample-car-07',
  'cabinet:shelf-4-right': 'sample-car-08',
  'card-wall:row-1-slot-1': 'sample-car-09',
  'card-wall:row-1-slot-2': 'sample-car-10',
  'card-wall:row-1-slot-3': 'sample-car-11',
  'card-wall:row-1-slot-4': 'sample-car-12',
  'card-wall:row-1-slot-5': 'sample-car-13',
  'card-wall:row-2-slot-1': 'sample-car-14',
  'card-wall:row-2-slot-2': 'sample-car-15',
  'card-wall:row-2-slot-3': 'sample-car-16',
  'card-wall:row-2-slot-4': 'sample-car-17',
  'card-wall:row-2-slot-5': 'sample-car-18',
  'card-wall:row-3-slot-1': 'sample-car-19',
  'card-wall:row-3-slot-2': 'sample-car-20',
  'card-wall:row-3-slot-3': 'sample-car-21',
  'card-wall:row-3-slot-4': 'sample-car-22',
  'card-wall:row-3-slot-5': 'sample-car-23',
  'back-model-shelves:shelf-1-left': 'sample-car-24',
  'back-model-shelves:shelf-1-right': 'sample-car-25',
  'back-model-shelves:shelf-2-left': 'sample-car-26',
  'back-model-shelves:shelf-2-right': 'sample-car-27',
  'back-model-shelves:shelf-3-left': 'sample-car-28',
  'back-model-shelves:shelf-3-right': 'sample-car-29',
  'left-model-shelves:shelf-1-left': 'sample-car-30',
  'left-model-shelves:shelf-1-right': 'sample-car-31',
  'left-model-shelves:shelf-2-left': 'sample-car-32',
  'left-model-shelves:shelf-2-right': 'sample-car-33',
  'left-model-shelves:shelf-3-left': 'sample-car-34',
  'left-model-shelves:shelf-3-right': 'sample-car-35',
}

/** Resolve once for static data. Invalid links leave empty slots instead of crashing. */
export function resolveDisplayContents(
  collectibles: readonly Collectible[],
  assignments: DisplayAssignments,
  slotIds: readonly DisplaySlotId[],
): { collectiblesBySlot: ReadonlyMap<DisplaySlotId, Collectible>; issues: readonly string[] } {
  const issues: string[] = []
  const records = new Map<string, Collectible>()
  const validSlots = new Set<DisplaySlotId>()
  const placedRecords = new Set<string>()
  const collectiblesBySlot = new Map<DisplaySlotId, Collectible>()

  for (const id of slotIds) {
    if (validSlots.has(id)) issues.push(`Duplicate display slot ID: ${id}`)
    validSlots.add(id)
  }

  for (const record of collectibles) {
    if (records.has(record.id)) {
      issues.push(`Duplicate collectible ID: ${record.id}; keeping the first record.`)
      continue
    }
    records.set(record.id, record)
  }

  for (const slotId of Object.keys(assignments) as DisplaySlotId[]) {
    if (!validSlots.has(slotId)) {
      issues.push(`Unknown display slot: ${slotId}`)
      continue
    }
    const collectibleId = assignments[slotId]
    if (collectibleId == null) continue

    const collectible = records.get(collectibleId)
    if (!collectible) {
      issues.push(`Missing collectible ${collectibleId} assigned to ${slotId}; leaving the slot empty.`)
      continue
    }
    if (placedRecords.has(collectibleId)) {
      issues.push(`Collectible ${collectibleId} is assigned more than once; leaving ${slotId} empty.`)
      continue
    }
    collectiblesBySlot.set(slotId, collectible)
    placedRecords.add(collectibleId)
  }

  return { collectiblesBySlot, issues }
}
