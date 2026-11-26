export const lightingThemes = {
  'soft-daylight': {
    label: 'Soft Daylight', background: '#202b35',
    ambient: 0.8, hemisphere: 1.3, key: 3.1, keyColor: '#fff3df', environment: 1,
    cabinet: 3.7, cabinetColor: '#ffdfb5', leftShelf: 2, rightShelf: 2,
    leftShelfColor: '#ffd09a', rightShelfColor: '#ffd09a',
    cabinetPost: 0.55, cabinetStrip: 0.6, shelfStrip: 0.55, shelfWash: 0.085,
    bedside: 0.7, lampGlow: 0.5,
  },
  'warm-evening': {
    label: 'Warm Evening', background: '#202b35',
    ambient: 0.45, hemisphere: 0.8, key: 2.4, keyColor: '#ffdeb0', environment: 1,
    cabinet: 7.5, cabinetColor: '#ffdfb5', leftShelf: 6, rightShelf: 5.5,
    leftShelfColor: '#ffd09a', rightShelfColor: '#ffd09a',
    cabinetPost: 1.25, cabinetStrip: 1.35, shelfStrip: 1.3, shelfWash: 0.23,
    bedside: 4, lampGlow: 1.9,
  },
  'dark-gaming': {
    label: 'Dark Gaming Room', background: '#111726',
    ambient: 0.19, hemisphere: 0.55, key: 0.65, keyColor: '#aabcf4', environment: 0.36,
    cabinet: 11, cabinetColor: '#fff2dc', leftShelf: 6.8, rightShelf: 6.3,
    leftShelfColor: '#bfceff', rightShelfColor: '#c9c4ed',
    cabinetPost: 0.85, cabinetStrip: 1.1, shelfStrip: 0.8, shelfWash: 0.33,
    bedside: 1.9, lampGlow: 0.72,
  },
} as const

export type RoomTheme = keyof typeof lightingThemes
export const roomThemeOptions = Object.keys(lightingThemes) as RoomTheme[]

export const nightPalette = {
  walls: ['#515a73', '#444c63'],
  floor: ['#6a5e62', '#706268', '#645961', '#73676b', '#675d64', '#6f646a'],
  plinth: '#33394a', trim: '#62697d', wallCap: '#464f65',
  wood: '#706478', darkWood: '#4e4555', bedding: '#4c5678', linen: '#9a92a0',
  cabinetBack: '#454c57', cabinetShelf: '#6e7581', cabinetLed: '#fff2da',
  leftShelfLed: '#b8cfff', rightShelfLed: '#cbc5fa',
  monitor: '#859bff', underDesk: '#9b91df', keyGlow: '#8d9bd5', boardHalo: '#a9afd9',
} as const
