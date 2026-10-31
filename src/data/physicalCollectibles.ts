import type { Collectible } from '../types/collectibles'

export const physicalCollectibles: readonly Collectible[] = [{
  id: 'physical-batman-beyond-458-chase',
  name: 'Batman — Batman Beyond',
  manufacturer: 'Funko',
  category: 'Funko Pop',
  edition: 'Transparent Chase',
  series: 'Batman Beyond',
  boxNumber: '458',
  productNumber: '66645',
  packaging: 'Protective case; Limited Chase Edition sticker only',
  representation: 'boxed',
  isSample: false,
  imageUrl: '/collectibles/batman-beyond-458/owner-photo.jpg',
  // Frame the original box front without retouching its labels or sticker.
  imageCrop: { left: 0.231, top: 0.086, width: 0.607, height: 0.628 },
}]
