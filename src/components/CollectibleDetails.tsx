import { useEffect } from 'react'
import type { Collectible } from '../types/collectibles'

interface CollectibleDetailsProps {
  collectible: Collectible
  onClose: () => void
}

export default function CollectibleDetails({ collectible, onClose }: CollectibleDetailsProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <aside className="collectible-details" aria-labelledby="collectible-title">
      <div className="details-header">
        <span className="eyebrow">{collectible.isSample ? 'Sample collectible' : 'Collectible'}</span>
        <button className="details-close" type="button" onClick={onClose} aria-label="Close collectible details">×</button>
      </div>
      <div aria-live="polite" aria-atomic="true">
        <h2 id="collectible-title">{collectible.name}</h2>
        <dl>
          <div><dt>Manufacturer</dt><dd>{collectible.manufacturer}</dd></div>
          <div><dt>Category</dt><dd>{collectible.category.replaceAll('-', ' ')}</dd></div>
          <div><dt>Edition</dt><dd>{collectible.edition}</dd></div>
          <div><dt>Color</dt><dd className="details-color"><span className="color-swatch" style={{ backgroundColor: collectible.color }} aria-hidden="true" />{collectible.color}</dd></div>
        </dl>
      </div>
      <p className="details-note">{collectible.isSample ? 'A placeholder for the collection to come.' : 'Part of your personal collection.'}</p>
      <p className="details-hint">Keep exploring. Select another car to see its story.</p>
    </aside>
  )
}
