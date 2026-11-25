import { useEffect } from 'react'
import type { Collectible } from '../types/collectibles'
import { useCollectibleArtwork } from '../hooks/useCollectibleArtwork'

interface CollectibleDetailsProps {
  collectible: Collectible
  onClose: () => void
  onFocus: () => void
  isFocused: boolean
}

function CollectibleDetailsImage({ collectible }: { collectible: Collectible }) {
  const { image, failed } = useCollectibleArtwork(collectible.imageUrl)
  const crop = collectible.imageCrop
  const alt = `${collectible.name} ${collectible.artworkStatus === 'temporary' ? 'temporary illustration; owner photo pending' : collectible.wax ? 'NFT artwork' : 'product photo'}`
  const ratio = image && crop ? image.naturalWidth * crop.width / (image.naturalHeight * crop.height) : 1
  return <div className="details-artwork">
    {image ? crop ? <div className="details-photo-crop" style={{ aspectRatio: ratio, width: `calc(var(--details-photo-height) * ${ratio})` }}>
      <img src={image.src} alt={alt} style={{
        width: `${100 / crop.width}%`, left: `${-100 * crop.left / crop.width}%`,
        top: `${-100 * crop.top / crop.height}%`, maxWidth: 'none', maxHeight: 'none',
      }} />
    </div> : <img src={image.src} alt={alt} />
      : <span role="status">{!collectible.imageUrl || failed ? 'Artwork unavailable' : 'Loading artwork…'}</span>}
  </div>
}

export default function CollectibleDetails({ collectible, onClose, onFocus, isFocused }: CollectibleDetailsProps) {
  const nft = collectible.wax
  const metadata = nft ? [
    ['Model', nft.model], ['Make', nft.make],
    ['Collection', nft.collectionName ?? nft.collection], ['Series', nft.series],
    ['Set', nft.set], ['Rarity', nft.rarity], ['Asset ID', nft.assetId],
    ['Template', nft.templateId],
    ['Mint', nft.mint ? `#${nft.mint}${nft.maxSupply && nft.maxSupply !== '0' ? ` / ${nft.maxSupply}` : ''}` : undefined],
    ['Year released', nft.year], ['Designer', nft.designer], ['Owner', nft.owner],
  ] : [
    ['Release year', collectible.releaseYear?.toString()],
    ['Series', collectible.series], ['Edition', collectible.edition], ['Packaging', collectible.packaging],
    ['Inventory number', collectible.inventoryNumber?.toString()], ['Box number', collectible.boxNumber],
    ['Line', collectible.line], ['Franchise', collectible.franchise],
    ['Character', collectible.character], ['Comic', collectible.comic],
    ['Vehicle', collectible.vehicle], ['Piece count', collectible.pieceCount?.toString()],
    ['Age rating', collectible.ageRating],
    ['Series number', collectible.seriesNumber], ['Appearance', collectible.appearance],
    ['Product number', collectible.productNumber],
    ['Ownership', collectible.ownership],
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
        <span className="eyebrow">{collectible.isSample ? 'Sample collectible' : nft ? 'Digital collectible · WAX' : 'Physical collectible'}</span>
        <div className="details-actions">
          <button className="focus-button" type="button" aria-disabled={isFocused} onClick={() => { if (!isFocused) onFocus() }}>
            {isFocused ? 'Focused' : 'View Closer'}
          </button>
          <button className="details-close" type="button" onClick={onClose} aria-label="Close collectible details">×</button>
        </div>
      </div>
      <div className="details-content" key={collectible.id}>
        <h2 id="collectible-title" aria-live="polite">{collectible.name}</h2>
        {!collectible.isSample && <CollectibleDetailsImage collectible={collectible} />}
        {collectible.artworkStatus === 'temporary' && <p className="details-note">Temporary illustration. Original packaging artwork and owner photo are pending.</p>}
        {collectible.artworkStatus === 'reference' && <p className="details-note">Product reference photo. The exact variant in your collection is unconfirmed.</p>}
        <dl>
          {collectible.manufacturer && <div><dt>Manufacturer</dt><dd>{collectible.manufacturer}</dd></div>}
          <div><dt>Category</dt><dd>{collectible.category.replaceAll('-', ' ')}</dd></div>
          {metadata.filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          {collectible.color && <div><dt>Color</dt><dd className="details-color"><span className="color-swatch" style={{ backgroundColor: collectible.color }} aria-hidden="true" />{collectible.color}</dd></div>}
        </dl>
        {nft && <a className="details-record-link" href={`https://wax.atomichub.io/explorer/asset/wax-mainnet/${nft.assetId}`} target="_blank" rel="noopener noreferrer">View on AtomicHub ↗</a>}
      </div>
    </aside>
  )
}
