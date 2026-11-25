import { useEffect, useMemo } from 'react'
import { CanvasTexture } from 'three'
import type { Texture } from 'three'
import type { Collectible, DisplayId, DisplaySlotId } from '../../types/collectibles'
import { Artwork } from './Artwork'
import { CollectibleItem } from './CollectibleItem'
import type { CollectibleSelectionProps } from './CollectibleItem'
import { cabinetShelves, cabinetSlots, cardSlots, modelShelfLevels, modelSlots } from './displayLayout'
import { Box } from './Primitives'
import { palette } from './palette'

interface DisplayProps extends CollectibleSelectionProps {
  collectiblesBySlot: ReadonlyMap<DisplaySlotId, Collectible>
}

export function DisplayCabinet({ collectiblesBySlot, evening, ...selection }: DisplayProps & { evening: boolean }) {
  return (
    <group position={[-3.44, 0, 1.34]} rotation={[0, Math.PI / 2, 0]}>
      <Box position={[0, 0.15, 0]} size={[2.07, 0.25, 0.73]} color={palette.ink} />
      <Box position={[0, 1.56, -0.32]} size={[2.02, 2.76, 0.065]} color="#5e6559" />
      <Box position={[0, 3, 0]} size={[2.12, 0.12, 0.8]} color={palette.ink} />
      {[-1, 0, 1].map((x) => <Box key={x} position={[x, 1.63, 0.34]} size={[0.045, 2.86, 0.045]} color={palette.ink} />)}
      {[-1, 1].map((x) => <group key={x}>
        <Box position={[x, 1.59, -0.32]} size={[0.045, 2.76, 0.045]} color={palette.ink} />
        <Box position={[x * 0.95, 1.59, -0.265]} size={[0.018, 2.66, 0.018]} color="#ffdfb0" glow={evening ? 1.25 : 0.55} castShadow={false} />
        <mesh name="cabinet-glass" position={[x, 1.61, 0]}><boxGeometry args={[0.012, 2.69, 0.64]} /><meshBasicMaterial color="#b8d5cb" transparent opacity={0.075} depthWrite={false} /></mesh>
      </group>)}
      {cabinetShelves.map(({ id, height: y }) => <group key={id}>
        <Box position={[0, y, 0]} size={[1.96, 0.045, 0.66]} color="#aab29e" />
        <Box position={[0, y + 0.025, -0.24]} size={[1.88, 0.018, 0.025]} color="#ffdfa9" glow={evening ? 1.35 : 0.6} castShadow={false} />
      </group>)}
      {cabinetSlots.map((slot) => <group key={slot.id} position={slot.position}>
        <CollectibleItem collectible={collectiblesBySlot.get(slot.id)} presentation={slot.presentation} scale={slot.scale} {...selection} />
      </group>)}
      {[-0.5, 0.5].map((x) => <group key={x}>
        <mesh name="cabinet-glass" position={[x, 1.61, 0.35]}><planeGeometry args={[0.94, 2.69]} /><meshBasicMaterial color="#d5e5d4" transparent opacity={0.045} depthWrite={false} /></mesh>
        <Box position={[x > 0 ? 0.1 : -0.1, 1.5, 0.39]} size={[0.025, 0.25, 0.035]} color={palette.brass} metalness={0.65} />
      </group>)}
    </group>
  )
}

function CardedDisplay({ collectiblesBySlot, ...selection }: DisplayProps) {
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

function ModelShelves({ displayId, position, rotation = 0, collectiblesBySlot, evening, wash, ...selection }: DisplayProps & {
  displayId: Extract<DisplayId, 'back-model-shelves' | 'left-model-shelves'>
  position: [number, number, number]
  rotation?: number
  evening: boolean
  wash: Texture
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {modelShelfLevels.map(({ id, height: y }) => <group key={id}>
        <Box position={[0, y, 0]} size={[1.75, 0.075, 0.41]} color={palette.darkWood} />
        <Box position={[0, y - 0.048, 0.05]} size={[1.56, 0.016, 0.025]} color="#ffdb9d" glow={evening ? 1.3 : 0.55} castShadow={false} />
        <mesh position={[0, y - 0.256, rotation ? -0.25 : -0.28]} raycast={() => null}>
          <planeGeometry args={[1.88, 0.42]} />
          <meshBasicMaterial alphaMap={wash} color="#ffd197" transparent opacity={evening ? 0.23 : 0.085} depthWrite={false} />
        </mesh>
      </group>)}
      {modelSlots.filter((slot) => slot.displayId === displayId).map((slot) => <group key={slot.id} position={slot.position}>
        <CollectibleItem collectible={collectiblesBySlot.get(slot.id)} presentation={slot.presentation} scale={slot.scale} {...selection} />
      </group>)}
    </group>
  )
}

function shelfWashTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 96
  canvas.height = 32
  const ctx = canvas.getContext('2d')!
  ctx.scale(48, 32)
  const falloff = ctx.createRadialGradient(1, 0, 0, 1, 0, 1)
  falloff.addColorStop(0, '#fff')
  falloff.addColorStop(0.45, '#999')
  falloff.addColorStop(1, '#000')
  ctx.fillStyle = falloff
  ctx.fillRect(0, 0, 2, 1)
  return new CanvasTexture(canvas)
}

export function WallDisplays({ evening, ...selection }: DisplayProps & { evening: boolean }) {
  const wash = useMemo(() => shelfWashTexture(), [])
  useEffect(() => () => wash.dispose(), [wash])
  return (
    <group>
      <CardedDisplay {...selection} />
      <ModelShelves evening={evening} wash={wash} displayId="back-model-shelves" position={[2.8, 1.91, -3.62]} {...selection} />
      <ModelShelves evening={evening} wash={wash} displayId="left-model-shelves" position={[-3.65, 1.98, -2.35]} rotation={Math.PI / 2} {...selection} />
    </group>
  )
}
