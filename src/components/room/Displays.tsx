import { displayAssignments, resolveDisplayContents } from '../../data/displayAssignments'
import { sampleCollectibles } from '../../data/sampleCollectibles'
import type { DisplayId } from '../../types/collectibles'
import { Artwork } from './Artwork'
import { CollectibleItem } from './CollectibleItem'
import type { CollectibleSelectionProps } from './CollectibleItem'
import { cabinetShelves, cabinetSlots, cardSlots, displaySlots, modelShelfLevels, modelSlots } from './displayLayout'
import { Box, Plant } from './Primitives'
import { palette } from './palette'

const { collectiblesBySlot, issues } = resolveDisplayContents(
  sampleCollectibles, displayAssignments, displaySlots.map((slot) => slot.id),
)

if (import.meta.env.DEV && issues.length) {
  console.warn('[Collectible displays]', ...issues)
}

export function DisplayCabinet(selection: CollectibleSelectionProps) {
  return (
    <group position={[-3.44, 0, 1.34]} rotation={[0, Math.PI / 2, 0]}>
      <Box position={[0, 0.15, 0]} size={[2.07, 0.25, 0.73]} color={palette.ink} />
      <Box position={[0, 1.56, -0.32]} size={[2.02, 2.76, 0.065]} color="#6c715f" />
      <Box position={[0, 3, 0]} size={[2.12, 0.12, 0.8]} color={palette.ink} />
      {[-1, 0, 1].map((x) => <Box key={x} position={[x, 1.63, 0.34]} size={[0.045, 2.86, 0.045]} color={palette.ink} />)}
      {[-1, 1].map((x) => <group key={x}>
        <Box position={[x, 1.59, -0.32]} size={[0.045, 2.76, 0.045]} color={palette.ink} />
        <Box position={[x * 0.95, 1.59, -0.265]} size={[0.018, 2.66, 0.018]} color="#ffe1a0" glow={2} />
        <mesh position={[x, 1.61, 0]}><boxGeometry args={[0.012, 2.69, 0.64]} /><meshStandardMaterial color="#b8d5cb" transparent opacity={0.12} roughness={0.15} depthWrite={false} /></mesh>
      </group>)}
      {cabinetShelves.map(({ id, height: y }) => <group key={id}>
        <Box position={[0, y, 0]} size={[1.96, 0.045, 0.66]} color="#b1b7a1" metalness={0.2} />
        <Box position={[0, y + 0.025, -0.24]} size={[1.88, 0.018, 0.025]} color="#ffcc7f" glow={1.8} />
      </group>)}
      {cabinetSlots.map((slot) => <group key={slot.id} position={slot.position}>
        <CollectibleItem collectible={collectiblesBySlot.get(slot.id)} presentation={slot.presentation} scale={slot.scale} {...selection} />
      </group>)}
      {[-0.5, 0.5].map((x) => <group key={x}>
        <mesh position={[x, 1.61, 0.35]}><planeGeometry args={[0.94, 2.69]} /><meshStandardMaterial color="#d5e5d4" transparent opacity={0.075} roughness={0.12} metalness={0.25} depthWrite={false} /></mesh>
        <Box position={[x > 0 ? 0.1 : -0.1, 1.5, 0.39]} size={[0.025, 0.25, 0.035]} color={palette.brass} metalness={0.65} />
      </group>)}
      <Plant position={[-0.68, 3.07, 0]} scale={0.8} />
      <Box position={[0.3, 3.13, 0]} size={[0.9, 0.1, 0.43]} color={palette.terracotta} />
      <Box position={[0.26, 3.23, 0]} size={[0.8, 0.08, 0.4]} color="#d9c59c" />
    </group>
  )
}

function CardedDisplay(selection: CollectibleSelectionProps) {
  return (
    <group position={[0.6, 2.48, -3.85]}>
      <Box size={[2.09, 1.9, 0.055]} color={palette.ink} />
      {cardSlots.map((slot) => (
        <group key={slot.id} position={slot.position}>
          <Box position={[0, 0.242, 0.008]} size={[0.085, 0.013, 0.012]} color={palette.ink} />
          <CollectibleItem collectible={collectiblesBySlot.get(slot.id)} presentation={slot.presentation} scale={slot.scale} {...selection} />
        </group>
      ))}
      <Box position={[0, 1.1, 0]} size={[2.1, 0.34, 0.065]} color={palette.ink} />
      <Artwork kind="sign" size={[2, 0.5]} position={[0, 1.1, 0.04]} />
    </group>
  )
}

function ModelShelves({ displayId, position, rotation = 0, ...selection }: CollectibleSelectionProps & {
  displayId: Extract<DisplayId, 'back-model-shelves' | 'left-model-shelves'>
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {modelShelfLevels.map(({ id, height: y }) => <group key={id}>
        <Box position={[0, y, 0]} size={[1.75, 0.075, 0.41]} color={palette.darkWood} />
        <Box position={[0, y - 0.048, 0.05]} size={[1.56, 0.016, 0.025]} color="#ffda94" glow={2} />
      </group>)}
      {modelSlots.filter((slot) => slot.displayId === displayId).map((slot) => <group key={slot.id} position={slot.position}>
        <CollectibleItem collectible={collectiblesBySlot.get(slot.id)} presentation={slot.presentation} scale={slot.scale} {...selection} />
      </group>)}
    </group>
  )
}

export function WallDisplays(selection: CollectibleSelectionProps) {
  return (
    <group>
      <CardedDisplay {...selection} />
      <ModelShelves displayId="back-model-shelves" position={[2.8, 1.91, -3.62]} {...selection} />
      <ModelShelves displayId="left-model-shelves" position={[-3.65, 1.98, -2.35]} rotation={Math.PI / 2} {...selection} />
      <group position={[-3.865, 2.52, -0.42]} rotation={[0, Math.PI / 2, 0]}>
        <Box size={[1.28, 1.69, 0.055]} color={palette.ink} />
        <Artwork kind="poster" size={[1.15, 1.55]} position={[0, 0, 0.032]} />
      </group>
    </group>
  )
}
