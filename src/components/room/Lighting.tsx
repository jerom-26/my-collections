import { useLayoutEffect, useRef } from 'react'
import { Environment, Lightformer } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Color, MathUtils } from 'three'
import type { AmbientLight, DirectionalLight, HemisphereLight, Light, PointLight } from 'three'
import { lightingThemes } from './roomThemes'
import type { RoomTheme } from './roomThemes'

const reflectionLights = <>
  <Lightformer position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 10, 1]} intensity={1.5} color="#fff1d9" />
  <Lightformer position={[4, 3, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 5, 1]} intensity={1} color="#d4e1ef" />
</>

export default function Lighting({ theme }: { theme: RoomTheme }) {
  const ambient = useRef<AmbientLight>(null)
  const hemisphere = useRef<HemisphereLight>(null)
  const key = useRef<DirectionalLight>(null)
  const left = useRef<PointLight>(null)
  const right = useRef<PointLight>(null)
  const cabinet = useRef<PointLight>(null)
  const background = useRef<Color>(null)
  const hasMounted = useRef(false)
  const transition = useRef<{ elapsed: number; apply: (amount: number) => void } | null>(null)
  const get = useThree((state) => state.get)
  const invalidate = useThree((state) => state.invalidate)

  useLayoutEffect(() => {
    const { scene } = get()
    const preset = lightingThemes[theme]
    const changes: [Light | null, number, string?][] = [
      [ambient.current, preset.ambient], [hemisphere.current, preset.hemisphere],
      [key.current, preset.key, preset.keyColor], [cabinet.current, preset.cabinet, preset.cabinetColor],
      [left.current, preset.leftShelf, preset.leftShelfColor], [right.current, preset.rightShelf, preset.rightShelfColor],
    ]
    const moves = changes.flatMap(([light, intensity, color]) => light ? [{
      light, intensity, fromIntensity: light.intensity,
      color: color && new Color(color), fromColor: light.color.clone(),
    }] : [])
    const backdrop = background.current
    const fromBackground = backdrop?.clone()
    const nextBackground = new Color(preset.background)
    const fromEnvironment = scene.environmentIntensity
    const apply = (amount: number) => {
      for (const move of moves) {
        move.light.intensity = MathUtils.lerp(move.fromIntensity, move.intensity, amount)
        if (move.color) move.light.color.lerpColors(move.fromColor, move.color, amount)
      }
      if (backdrop && fromBackground) backdrop.lerpColors(fromBackground, nextBackground, amount)
      scene.environmentIntensity = MathUtils.lerp(fromEnvironment, preset.environment, amount)
    }
    if (!hasMounted.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      transition.current = null
      apply(1)
    } else {
      transition.current = { elapsed: 0, apply }
    }
    hasMounted.current = true
    invalidate()
  }, [get, invalidate, theme])

  useFrame((_, delta) => {
    const fade = transition.current
    if (!fade) return
    fade.elapsed += Math.min(delta, 0.04)
    const progress = Math.min(1, fade.elapsed / 0.22)
    fade.apply(progress * progress * (3 - 2 * progress))
    if (progress < 1) invalidate()
    else transition.current = null
  })

  return (
    <>
      <color ref={background} attach="background" args={['#202b35']} />
      <ambientLight ref={ambient} color="#fff1d7" />
      <hemisphereLight ref={hemisphere} args={['#e6ecf4', '#8a7155']} />
      <directionalLight
        ref={key} position={[0, 9, 6]}
        castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-8} shadow-camera-right={8}
        shadow-camera-top={8} shadow-camera-bottom={-8} shadow-camera-near={1} shadow-camera-far={25}
        shadow-normalBias={0.035} shadow-bias={-0.0002} shadow-radius={3}
      />
      <pointLight ref={left} position={[-2.45, 2.7, -2.44]} distance={3.9} />
      <pointLight ref={cabinet} position={[-2.47, 1.65, 1.34]} distance={3.5} />
      <pointLight ref={right} position={[2.36, 2.72, -2.47]} distance={3.5} />
      <Environment resolution={64} frames={1}>{reflectionLights}</Environment>
    </>
  )
}
