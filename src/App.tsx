import { Component, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { PCFShadowMap } from 'three'
import RoomScene from './components/room/RoomScene'
import CollectibleDetails from './components/CollectibleDetails'
import { sampleCollectibles } from './data/sampleCollectibles'
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
  const [evening, setEvening] = useState(true)
  const [resetKey, setResetKey] = useState(0)
  const [showHelp, setShowHelp] = useState(false)
  const [selectedCollectibleId, setSelectedCollectibleId] = useState<string | null>(null)
  const wax = useWaxCollectibles()
  const { records, collectiblesBySlot, issues } = useMemo(() => {
    const records = [...sampleCollectibles, ...wax.collectibles]
    const assignments = assignWallCollectibles(displayAssignments, cardSlots.map((slot) => slot.id), wax.collectibles)
    const resolved = resolveDisplayContents(records, assignments, displaySlots.map((slot) => slot.id))
    return { records, ...resolved }
  }, [wax.collectibles])
  useEffect(() => {
    if (import.meta.env.DEV && issues.length) console.warn('[Collectible displays]', ...issues)
  }, [issues])
  const selectedCollectible = records.find((record) => record.id === selectedCollectibleId)

  return (
    <main className="showroom">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m20 3 15 8.5v17L20 37 5 28.5v-17L20 3Z" /><path d="m5 11.5 15 9 15-9M20 20.5V37M12.5 7.3l15 8.7v9l-7.5 4.3-7.5-4.3v-9L27.5 7.3" /></svg></span>
          <span>Personal<span> Collectibles</span></span>
        </div>
        <span className="header-note">Little things. A world of their own.</span>
        <span className="edition"><i className="status-dot" />Room study / 01</span>
      </header>

      <section className="room-viewer" aria-label="Interactive collector’s bedroom">
        <div className="introduction">
          <div className="eyebrow">The collector’s room</div>
          <h1>A little room.<br /> A <em>whole world.</em></h1>
          <p>A quiet corner for big ideas, small cars, and the things worth keeping.</p>
          <div className="room-number"><span>001</span><span>Your personal escape</span></div>
        </div>

        <div className="scene" role="region" aria-label="Interactive 3D bedroom. Select a car or NFT card for details. Drag to orbit, scroll to zoom, right-drag to pan." aria-describedby="camera-help">
          <SceneBoundary>
            <Canvas shadows={{ type: PCFShadowMap }} dpr={[1, 1.75]} frameloop="demand" camera={{ position: [11, 9.4, 12], fov: 37, near: 0.1, far: 250 }} gl={{ antialias: true, powerPreference: 'high-performance' }} fallback={<SceneFallback />}>
              <RoomScene collectiblesBySlot={collectiblesBySlot} evening={evening} resetKey={resetKey} selectedCollectibleId={selectedCollectibleId} onSelectCollectible={setSelectedCollectibleId} />
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
          <button className="tool-button" onClick={() => setEvening((value) => !value)} aria-pressed={evening} aria-label="Warm evening lighting">
            {evening
              ? <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16.7 12.4A7.4 7.4 0 0 1 7.6 3.3a7.4 7.4 0 1 0 9.1 9.1Z" /></svg>
              : <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.3" /><path d="M10 1v2m0 14v2M1 10h2m14 0h2M3.6 3.6 5 5m10 10 1.4 1.4M3.6 16.4 5 15M15 5l1.4-1.4" /></svg>}
            {evening ? 'Warm evening' : 'Soft daylight'}
          </button>
          <button className="tool-button icon-button" onClick={() => setResetKey((value) => value + 1)} aria-label="Reset camera" title="Reset camera">
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
          <p>Click or tap a display car or NFT card for details. Close the details to keep exploring.</p>
        </aside>

        {selectedCollectible && <CollectibleDetails collectible={selectedCollectible} onClose={() => setSelectedCollectibleId(null)} />}

        <div className="scene-caption"><span>Room to be yourself.</span><p>A miniature collector’s retreat</p></div>
        <div className="viewer-hint" aria-hidden="true"><svg viewBox="0 0 18 24"><rect x="3" y="1" width="12" height="21" rx="6" /><path d="M9 5v5" /></svg><span className="desktop-hint">Drag to explore</span><i className="divider desktop-hint" /><span>Scroll / pinch to zoom</span></div>
      </section>

      <footer className="room-footer">
        <div className="footer-label">The everyday, collected.<small>Personal space / Vol. 01</small></div>
        <div className="room-details"><span><i className="detail-dot" />Diecast & small wonders</span><span><i className="detail-dot" />A place to create</span><span><i className="detail-dot" />Designed to unwind</span></div>
        <span className="footer-index">01 — 01</span>
      </footer>
    </main>
  )
}
