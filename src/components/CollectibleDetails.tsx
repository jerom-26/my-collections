import { useEffect } from 'react'
import type { Collectible } from '../types/collectibles'
import { useNftArtwork } from '../hooks/useNftArtwork'

interface CollectibleDetailsProps {
  collectible: Collectible
  onClose: () => void
}

function NftDetailsImage({ collectible }: { collectible: Collectible }) {
  const { image, failed } = useNftArtwork(collectible.imageUrl)
  return <div className="details-artwork">
    {image ? <img src={image.src} alt={`${collectible.name} NFT artwork`} />
      : <span role="status">{failed ? 'Artwork unavailable' : 'Loading artwork…'}</span>}
  </div>
}

export default function CollectibleDetails({ collectible, onClose }: CollectibleDetailsProps) {
  const nft = collectible.wax
  const metadata = nft ? [
    ['Model', nft.model], ['Make', nft.make],
    ['Collection', nft.collectionName ?? nft.collection], ['Series', nft.series],
    ['Set', nft.set], ['Rarity', nft.rarity], ['Asset ID', nft.assetId],
    ['Template', nft.templateId],
    ['Mint', nft.mint ? `#${nft.mint}${nft.maxSupply && nft.maxSupply !== '0' ? ` / ${nft.maxSupply}` : ''}` : undefined],
    ['Year released', nft.year], ['Designer', nft.designer], ['Owner', nft.owner],
  ] : []
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
        <span className="eyebrow">{collectible.isSample ? 'Sample collectible' : nft ? 'WAX collectible' : 'Collectible'}</span>
        <button className="details-close" type="button" onClick={onClose} aria-label="Close collectible details">×</button>
      </div>
      <div aria-live="polite" aria-atomic="true">
        <h2 id="collectible-title">{collectible.name}</h2>
        {nft && <NftDetailsImage key={collectible.id} collectible={collectible} />}
        <dl>
          {collectible.manufacturer && <div><dt>Manufacturer</dt><dd>{collectible.manufacturer}</dd></div>}
          <div><dt>Category</dt><dd>{collectible.category.replaceAll('-', ' ')}</dd></div>
          {!nft && collectible.edition && <div><dt>Edition</dt><dd>{collectible.edition}</dd></div>}
          {collectible.color && <div><dt>Color</dt><dd className="details-color"><span className="color-swatch" style={{ backgroundColor: collectible.color }} aria-hidden="true" />{collectible.color}</dd></div>}
          {metadata.filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
        {nft && <a className="details-record-link" href={`https://wax.atomichub.io/explorer/asset/wax-mainnet/${nft.assetId}`} target="_blank" rel="noopener noreferrer">View on AtomicHub ↗</a>}
      </div>
      <p className="details-note">{collectible.isSample ? 'A placeholder for the collection to come.' : nft ? 'Artwork and metadata from public WAX records. Displaying a static artwork preview.' : 'Part of your personal collection.'}</p>
      <p className="details-hint">Keep exploring. Select another collectible to see its story.</p>
    </aside>
  )
}
