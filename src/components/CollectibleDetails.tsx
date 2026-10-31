import { useEffect } from 'react'
import type { Collectible } from '../types/collectibles'
import { useCollectibleArtwork } from '../hooks/useCollectibleArtwork'

interface CollectibleDetailsProps {
  collectible: Collectible
  onClose: () => void
}

function CollectibleDetailsImage({ collectible }: { collectible: Collectible }) {
  const { image, failed } = useCollectibleArtwork(collectible.imageUrl)
  const crop = collectible.imageCrop
  const alt = `${collectible.name} ${collectible.wax ? 'NFT artwork' : 'product photo'}`
  const ratio = image && crop ? image.naturalWidth * crop.width / (image.naturalHeight * crop.height) : 1
  return <div className="details-artwork">
    {image ? crop ? <div className="details-photo-crop" style={{ aspectRatio: ratio, width: 180 * ratio }}>
      <img src={image.src} alt={alt} style={{
        width: `${100 / crop.width}%`, left: `${-100 * crop.left / crop.width}%`,
        top: `${-100 * crop.top / crop.height}%`, maxWidth: 'none', maxHeight: 'none',
      }} />
    </div> : <img src={image.src} alt={alt} />
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
  ] : [
    ['Series', collectible.series], ['Box number', collectible.boxNumber],
    ['Product number', collectible.productNumber], ['Packaging', collectible.packaging],
  ]
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
        <span className="eyebrow">{collectible.isSample ? 'Sample collectible' : nft ? 'WAX collectible' : 'Physical collectible'}</span>
        <button className="details-close" type="button" onClick={onClose} aria-label="Close collectible details">×</button>
      </div>
      <div aria-live="polite" aria-atomic="true">
        <h2 id="collectible-title">{collectible.name}</h2>
        {(nft || collectible.imageUrl) && <CollectibleDetailsImage key={collectible.id} collectible={collectible} />}
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
