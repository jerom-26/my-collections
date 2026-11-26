import { Component, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { PCFShadowMap } from 'three'
import RoomScene from './components/room/RoomScene'
import type { CameraCommand } from './components/room/CameraRig'
import { lightingThemes, roomThemeOptions } from './components/room/roomThemes'
import type { RoomTheme } from './components/room/roomThemes'
import CollectibleDetails from './components/CollectibleDetails'
import { sampleCollectibles } from './data/sampleCollectibles'
import { physicalCollectibles } from './data/physicalCollectibles'
import { assignWallCollectibles, displayAssignments, resolveDisplayContents } from './data/displayAssignments'
import { cardSlots, displaySlots } from './components/room/displayLayout'
import { useWaxCollectibles } from './hooks/useWaxCollectibles'
import './App.css'

function SceneFallback() {
  return <div className="canvas-fallback" role="status"><strong>The room needs WebGL.</strong><p>Enable hardware acceleration in your browser, then reload to explore the room.</p></div>
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children }
}

export default function App() {
  const [roomTheme, setRoomTheme] = useState<RoomTheme>('warm-evening')
  const [cameraCommand, setCameraCommand] = useState<CameraCommand | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [cameraMessage, setCameraMessage] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [selectedCollectibleId, setSelectedCollectibleId] = useState<string | null>(null)
  const sceneRegion = useRef<HTMLDivElement>(null)
  const closeDetails = useCallback(() => {
    setSelectedCollectibleId(null)
    setCameraMessage(null)
    sceneRegion.current?.focus({ preventScroll: true })
  }, [])
  const wax = useWaxCollectibles()
  const { records, collectiblesBySlot, issues } = useMemo(() => {
    const records = [...sampleCollectibles, ...physicalCollectibles, ...wax.collectibles]
    const assignments = assignWallCollectibles(displayAssignments, cardSlots.map((slot) => slot.id), wax.collectibles)
    const resolved = resolveDisplayContents(records, assignments, displaySlots.map((slot) => slot.id))
    return { records, ...resolved }
  }, [wax.collectibles])
  useEffect(() => {
    if (import.meta.env.DEV && issues.length) console.warn('[Collectible displays]', ...issues)
  }, [issues])
  const selectedCollectible = records.find((record) => record.id === selectedCollectibleId)

  return (
    <main className="showroom" data-theme={roomTheme}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m20 3 15 8.5v17L20 37 5 28.5v-17L20 3Z" /><path d="m5 11.5 15 9 15-9M20 20.5V37M12.5 7.3l15 8.7v9l-7.5 4.3-7.5-4.3v-9L27.5 7.3" /></svg></span>
          <span>Personal<span> Collectibles</span></span>
        </div>
      </header>

      <section className={`room-viewer${selectedCollectible ? ' has-details' : ''}`} aria-label="Interactive collector’s bedroom">
        <div className="viewer-stage">
        <div ref={sceneRegion} tabIndex={-1} className="scene" role="region" aria-label="Interactive 3D bedroom. Select a displayed collectible for details. Drag to orbit, scroll to zoom, right-drag to pan." aria-describedby="camera-help">
          <SceneBoundary>
            <Canvas shadows={{ type: PCFShadowMap }} dpr={[1, 1.75]} frameloop="demand" camera={{ position: [11, 9.4, 12], fov: 37, near: 0.1, far: 250 }} gl={{ antialias: true, powerPreference: 'high-performance' }} fallback={<SceneFallback />}>
              <RoomScene collectiblesBySlot={collectiblesBySlot} theme={roomTheme} command={cameraCommand} onFocusedChange={setFocusedId} onCameraMessage={setCameraMessage}
                selectedCollectibleId={selectedCollectibleId} onSelectCollectible={(id) => { setSelectedCollectibleId(id); setCameraMessage(null) }} />
            </Canvas>
          </SceneBoundary>
        </div>

        <div className="wax-status" role="status">
          {wax.loading ? 'Loading WAX wall cards…' : wax.error ? <>
            <span>{wax.error}</span><button type="button" onClick={wax.retry}>Retry WAX cards</button>
          </> : wax.collectibles.length === 0 ? 'No Hot Wheels NFTs found for passionfruti.'
            : `${Math.min(wax.collectibles.length, cardSlots.length)} WAX cards on display · passionfruti${wax.collectibles.length > cardSlots.length ? ' · Wall capacity: 15' : ''}`}
        </div>

        <div className="viewer-tools" aria-label="Room controls">
          {focusedId && <button type="button" className="tool-button return-button" onClick={() => {
            setCameraCommand({ kind: 'back' })
            sceneRegion.current?.focus({ preventScroll: true })
          }}>Back to Room</button>}
          <select className="tool-button theme-select" aria-label="Room lighting theme" value={roomTheme} onChange={(event) => setRoomTheme(event.currentTarget.value as RoomTheme)}>
            {roomThemeOptions.map((theme) => <option key={theme} value={theme}>{lightingThemes[theme].label}</option>)}
          </select>
          <button className="tool-button icon-button" onClick={() => setCameraCommand({ kind: 'reset' })} aria-label="Reset camera" title="Reset camera">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 7a6.7 6.7 0 1 1-.4 5M4 2.8V7h4.2" /></svg>
          </button>
          <button className="tool-button icon-button" onClick={() => setShowHelp((value) => !value)} aria-label="Camera controls help" aria-expanded={showHelp} aria-controls="camera-help" title="Camera controls">
            <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="M8 7.2a2.1 2.1 0 1 1 3.4 1.7c-1 .6-1.4 1.1-1.4 2.1m0 2.1v.2" /></svg>
          </button>
        </div>
        <aside id="camera-help" className="help-card" hidden={!showHelp}>
          <button className="help-close" aria-label="Close camera help" onClick={() => setShowHelp(false)}>×</button>
          <strong>Make yourself at home.</strong>
          <p>Drag to look around. Scroll to zoom. Right-drag or Shift-drag to pan.</p>
          <p>On touch screens, drag with one finger to rotate. Pinch or use two fingers to zoom and pan.</p>
          <p>Use the reset button to return to this view.</p>
          <p>Click or tap a collectible for details. Choose View Closer for a close-up, then Back to Room to return.</p>
        </aside>

        {cameraMessage && <p className="camera-message" role="status">{cameraMessage}</p>}
        <div className="viewer-hint" aria-hidden="true"><svg viewBox="0 0 18 24"><rect x="3" y="1" width="12" height="21" rx="6" /><path d="M9 5v5" /></svg><span className="desktop-hint">Drag to explore</span><i className="divider desktop-hint" /><span>Scroll / pinch to zoom</span></div>
        </div>
        {selectedCollectible && <CollectibleDetails collectible={selectedCollectible} onClose={closeDetails} isFocused={focusedId === selectedCollectible.id}
          onFocus={() => setCameraCommand({ kind: 'focus', id: selectedCollectible.id })} />}
      </section>
    </main>
  )
}
