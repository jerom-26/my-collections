import { createContext, useContext, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import type { ThreeElements } from '@react-three/fiber'

type ArtworkKind = 'screen' | 'poster' | 'sign' | 'card' | 'rug' | 'wood'

function paint(kind: ArtworkKind) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = kind === 'sign' ? 256 : 768
  const ctx = canvas.getContext('2d')!
  const { width: w, height: h } = canvas
  if (kind === 'screen') {
    const sky = ctx.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#202d54'); sky.addColorStop(0.52, '#cd9c8e'); sky.addColorStop(1, '#e1b583')
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#ffe6b0'; ctx.beginPath(); ctx.arc(710, 260, 84, 0, Math.PI * 2); ctx.fill()
    ;['#778092', '#4c6578', '#304a59', '#1c3542'].forEach((color, layer) => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, h)
      for (let x = 0; x <= w; x += 64) ctx.lineTo(x, 340 + layer * 65 + Math.sin(x * 0.012 + layer * 3) * 75 + Math.cos(x * 0.027) * 28)
      ctx.lineTo(w, h); ctx.fill()
    })
    ctx.strokeStyle = '#e8b581'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(490, h); ctx.bezierCurveTo(350, 620, 700, 590, 650, 500); ctx.stroke()
    ctx.fillStyle = '#f5e6cf'; ctx.font = '24px sans-serif'; ctx.fillText('S L O W   E V E N I N G S', 54, 72)
  } else if (kind === 'poster') {
    ctx.fillStyle = '#ede1c9'; ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#b86042'; ctx.beginPath(); ctx.arc(680, 305, 212, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#273c43'; ctx.font = 'bold 105px sans-serif'; ctx.fillText('DRIVEN', 65, 135)
    ctx.font = '26px sans-serif'; ctx.fillText('BY THE LITTLE THINGS.', 70, 184)
    ctx.fillStyle = '#86917f'; ctx.fillRect(0, 520, w, 248)
    ctx.fillStyle = '#eee0bd'; ctx.beginPath(); ctx.moveTo(150, 480); ctx.lineTo(305, 450); ctx.lineTo(410, 340); ctx.lineTo(670, 340); ctx.lineTo(790, 445); ctx.lineTo(895, 475); ctx.lineTo(890, 560); ctx.lineTo(150, 560); ctx.fill()
    ctx.fillStyle = '#3a545d'; ctx.beginPath(); ctx.moveTo(350, 445); ctx.lineTo(435, 365); ctx.lineTo(645, 365); ctx.lineTo(735, 445); ctx.fill()
    ;[300, 745].forEach((x) => { ctx.fillStyle = '#233338'; ctx.beginPath(); ctx.arc(x, 550, 70, 0, 7); ctx.fill(); ctx.fillStyle = '#c2b79d'; ctx.beginPath(); ctx.arc(x, 550, 33, 0, 7); ctx.fill() })
    ctx.fillStyle = '#f9edd8'; ctx.font = '23px sans-serif'; ctx.fillText('THE EVERYDAY / EXTRAORDINARY', 70, 708)
  } else if (kind === 'sign') {
    ctx.fillStyle = '#263b3d'; ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#e8bc74'; ctx.font = 'bold 88px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('SMALL SCALE', w / 2, 115)
    ctx.fillStyle = '#efe1bf'; ctx.font = '32px sans-serif'; ctx.fillText('B I G   S T O R I E S', w / 2, 185)
  } else if (kind === 'card') {
    ctx.fillStyle = '#346680'; ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#f3b547'; ctx.font = 'italic bold 100px sans-serif'; ctx.fillText('DIECAST', 65, 145)
    ctx.fillStyle = '#acc4c5'; ctx.beginPath(); ctx.moveTo(0, 420); ctx.lineTo(w, 170); ctx.lineTo(w, 480); ctx.lineTo(0, 650); ctx.fill()
    ctx.fillStyle = '#f5e9d3'; ctx.fillRect(0, 530, w, 238)
    ctx.fillStyle = '#234255'; ctx.font = 'bold 42px sans-serif'; ctx.fillText('1:64  /  COLLECTOR SERIES', 70, 700)
  } else if (kind === 'wood') {
    for (let i = 0; i < 110; i++) {
      ctx.strokeStyle = i % 3 ? '#51371916' : '#fff1d913'
      ctx.lineWidth = i % 4 + 1
      ctx.beginPath()
      const y = (i * 139) % h
      ctx.moveTo(0, y)
      ctx.bezierCurveTo(w * 0.3, y + Math.sin(i) * 22, w * 0.7, y - Math.sin(i) * 35, w, y + 3)
      ctx.stroke()
    }
  } else {
    ctx.fillStyle = '#3f555b'; ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#c4b290'; ctx.lineWidth = 4; ctx.strokeRect(30, 30, w - 60, h - 60); ctx.strokeRect(44, 44, w - 88, h - 88)
    ctx.save(); ctx.translate(w / 2, h / 2); ctx.rotate(-0.12)
    ctx.fillStyle = '#ddd0b0'; ctx.textAlign = 'center'; ctx.font = 'italic bold 84px Georgia'; ctx.fillText('Small wonders.', 0, 8)
    ctx.font = '22px sans-serif'; ctx.fillText('A   C O L L E C T O R ’ S   P L A C E', 0, 64); ctx.restore()
    for (let i = 0; i < 1600; i++) { ctx.fillStyle = i % 2 ? '#ffffff09' : '#00000009'; ctx.fillRect((i * 73) % w, (i * 137) % h, 2, 12) }
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

const ArtworkContext = createContext<Partial<Record<ArtworkKind, CanvasTexture>>>({})

export function ArtworkProvider({ children }: { children: ReactNode }) {
  const textures = useMemo(() => Object.fromEntries(
    (['screen', 'poster', 'sign', 'card', 'rug', 'wood'] as const).map((kind) => [kind, paint(kind)]),
  ), [])
  useEffect(() => () => Object.values(textures).forEach((texture) => texture.dispose()), [textures])
  return <ArtworkContext.Provider value={textures}>{children}</ArtworkContext.Provider>
}

export function Artwork({ kind, size, ...props }: ThreeElements['mesh'] & { kind: ArtworkKind; size: [number, number] }) {
  const textures = useContext(ArtworkContext)
  return (
    <mesh receiveShadow={kind === 'wood' || kind === 'rug'} {...props}>
      <planeGeometry args={size} />
      {kind === 'screen'
        ? <meshBasicMaterial map={textures[kind]} toneMapped={false} />
        : <meshStandardMaterial map={textures[kind]} roughness={0.95} transparent={kind === 'wood'} depthWrite={kind !== 'wood'} />}
    </mesh>
  )
}
