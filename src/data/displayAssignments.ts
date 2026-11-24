import type { Collectible, DisplayAssignments, DisplaySlotId } from '../types/collectibles'

/** Slot keys are physical locations; record IDs stay the same when records move. */
export const displayAssignments: DisplayAssignments = {
  'cabinet:shelf-1-left': 'sample-car-01',
  'cabinet:shelf-1-right': 'sample-car-02',
  'cabinet:shelf-2-left': 'physical-funko-thor-comic-cover-09',
  'cabinet:shelf-2-right': 'physical-brick-shop-cadillac-project-gtp-hypercar',
  'cabinet:shelf-3-left': 'physical-hot-wheels-alfa-romeo-155-v6-ti-2024',
  'cabinet:shelf-3-right': 'physical-hot-wheels-lewandowski-porsche-911-gt1',
  'cabinet:shelf-4-left': 'physical-batman-beyond-458-chase',
  'cabinet:shelf-4-right': 'physical-hot-wheels-chevelle-ss-396-series-6',
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
  'back-model-shelves:shelf-1-left': 'physical-hot-wheels-bmw-m4-gt3',
  'back-model-shelves:shelf-1-right': 'physical-hot-wheels-nissan-skyline-bnr34',
  'back-model-shelves:shelf-2-left': 'physical-hot-wheels-ferrari-f40-competizione',
  'back-model-shelves:shelf-2-right': 'physical-hot-wheels-lamborghini-veneno',
  'back-model-shelves:shelf-3-left': 'physical-hot-wheels-aint-fare',
  'back-model-shelves:shelf-3-right': 'physical-hot-wheels-mattel-dream-mobile',
  'left-model-shelves:shelf-1-left': 'physical-hot-wheels-land-rover-defender-110',
  'left-model-shelves:shelf-1-right': 'physical-hot-wheels-corvette-stingray',
  'left-model-shelves:shelf-2-left': 'physical-hot-wheels-ford-shelby-gt350r',
  'left-model-shelves:shelf-2-right': 'physical-hot-wheels-custom-68-camaro',
  'left-model-shelves:shelf-3-left': 'physical-hot-wheels-custom-71-datsun-240z',
  'left-model-shelves:shelf-3-right': 'physical-hot-wheels-70-plymouth-aar-cuda',
}

/** Replace only the wall grid, without changing the saved sample inventory or other assignments. */
export function assignWallCollectibles(
  base: DisplayAssignments,
  wallSlotIds: readonly DisplaySlotId[],
  collectibles: readonly Collectible[],
): DisplayAssignments {
  const assignments = { ...base }
  wallSlotIds.forEach((id, index) => {
    if (id.startsWith('card-wall:')) assignments[id] = collectibles[index]?.id ?? null
  })
  return assignments
}

/** Invalid links leave empty slots instead of crashing. */
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
