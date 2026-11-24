import type { Collectible } from '../types/collectibles'

const hotWheels = {
  manufacturer: 'Hot Wheels / Mattel',
  category: 'Physical diecast',
  ownership: 'Owned',
  isSample: false,
} as const

const loose = { ...hotWheels, packaging: 'Opened / loose' } as const
const blistered = { ...hotWheels, packaging: 'Blister-packed' } as const

export const wallShelfCollectibles: readonly Collectible[] = [
  {
    ...loose, id: 'physical-hot-wheels-corvette-stingray',
    name: 'Corvette Stingray', inventoryNumber: 7, releaseYear: 2026, series: 'Mystery Models',
    appearance: 'White with black and orange graphics and red wheel rings',
    imageUrl: '/collectibles/wall-shelves/07-corvette-stingray-photo.jpg',
    imageCrop: { left: 0.085, top: 0.20, width: 0.86, height: 0.68 },
  },
  {
    ...loose, id: 'physical-hot-wheels-ford-shelby-gt350r',
    name: 'Ford Shelby GT350R', inventoryNumber: 14, releaseYear: 2026, series: 'Mystery Models',
    appearance: 'Silver with black racing stripes and number 25',
    imageUrl: '/collectibles/wall-shelves/14-ford-shelby-gt350r-photo.webp',
    imageCrop: { left: 0.015, top: 0.316, width: 0.972, height: 0.365 },
  },
  {
    ...loose, id: 'physical-hot-wheels-land-rover-defender-110',
    name: 'Land Rover Defender 110', inventoryNumber: 15, series: 'Fast & Furious',
    appearance: 'Dark charcoal with black wheels',
    imageUrl: '/collectibles/wall-shelves/15-land-rover-defender-110-photo.jpg',
    imageCrop: { left: 0.118, top: 0.248, width: 0.794, height: 0.54 },
  },
  {
    ...loose, id: 'physical-hot-wheels-mattel-dream-mobile',
    name: 'Mattel Dream Mobile', inventoryNumber: 18, releaseYear: 2025, series: 'Celebrations',
    appearance: 'Ruby red with chrome trim and Mattel 80th anniversary graphics',
    imageUrl: '/collectibles/wall-shelves/18-mattel-dream-mobile-photo.jpg',
    imageCrop: { left: 0.125, top: 0.23, width: 0.775, height: 0.58 },
  },
  {
    ...loose, id: 'physical-hot-wheels-custom-71-datsun-240z',
    name: 'Custom ’71 Datsun 240Z', inventoryNumber: 27, releaseYear: 2020, series: 'MotorTrend: Roadkill',
    appearance: 'Weathered black with rust graphics, Roadkill lettering and an exposed engine',
    imageUrl: '/collectibles/wall-shelves/27-custom-71-datsun-240z-photo.webp',
  },
  {
    ...loose, id: 'physical-hot-wheels-custom-68-camaro',
    name: 'Custom ’68 Camaro', inventoryNumber: 28, releaseYear: 2024,
    appearance: 'White with red racing graphics, black wheels and number 68',
    imageUrl: '/collectibles/wall-shelves/28-custom-68-camaro-photo.jpg',
    imageCrop: { left: 0.016, top: 0.315, width: 0.97, height: 0.385 },
  },
  {
    ...loose, id: 'physical-hot-wheels-70-plymouth-aar-cuda',
    name: '’70 Plymouth AAR ’Cuda', inventoryNumber: 29, releaseYear: 2020, series: 'Fast & Furious',
    appearance: 'Black with red wheel rings',
    imageUrl: '/collectibles/wall-shelves/29-plymouth-aar-cuda-photo.jpg',
    imageCrop: { left: 0.012, top: 0.282, width: 0.976, height: 0.47 },
  },
  {
    ...loose, id: 'physical-hot-wheels-aint-fare',
    name: 'Ain’t Fare', inventoryNumber: 32, releaseYear: 2024, series: 'HW Fast Transit', edition: 'Treasure Hunt',
    appearance: 'Black with red glazing, World Tour graphics and white wheel rims',
    imageUrl: '/collectibles/wall-shelves/32-aint-fare-photo.webp',
  },
  {
    ...blistered, id: 'physical-hot-wheels-ferrari-f40-competizione',
    name: 'Ferrari F40 Competizione', inventoryNumber: 5, releaseYear: 2026, line: 'Mainline', series: 'Ferrari',
    appearance: 'Black with silver wheels',
    imageUrl: '/collectibles/wall-shelves/05-ferrari-f40-competizione-photo.webp',
  },
  {
    ...blistered, id: 'physical-hot-wheels-lamborghini-veneno',
    name: 'Lamborghini Veneno', inventoryNumber: 1, releaseYear: 2026, line: 'Themed Automotive', series: 'Silver Series: Exotics',
    appearance: 'Dark charcoal with green accents and tricolor trim',
    imageUrl: '/collectibles/wall-shelves/01-lamborghini-veneno-photo.webp',
  },
  {
    ...blistered, id: 'physical-hot-wheels-bmw-m4-gt3',
    name: 'BMW M4 GT3', inventoryNumber: 3, releaseYear: 2026, series: 'HW Starting Grid',
    appearance: 'White with red and blue stripes',
    imageUrl: '/collectibles/wall-shelves/03-bmw-m4-gt3-photo.jpg',
    imageCrop: { left: 0.162, top: 0, width: 0.698, height: 1 },
  },
  {
    ...blistered, id: 'physical-hot-wheels-nissan-skyline-bnr34',
    name: 'Nissan Skyline GT-R (BNR34)', inventoryNumber: 4, releaseYear: 2026, series: 'HW J-Imports',
    appearance: 'Metallic blue with bronze wheels',
    imageUrl: '/collectibles/wall-shelves/04-nissan-skyline-bnr34-photo.jpg',
    imageCrop: { left: 0.172, top: 0.009, width: 0.692, height: 0.984 },
  },
]
