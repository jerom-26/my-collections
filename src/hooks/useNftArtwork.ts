import { useEffect, useState } from 'react'
import { loadStaticArtwork } from '../services/nftMedia'

export function useNftArtwork(imageUrl?: string) {
  const [result, setResult] = useState<{
    imageUrl?: string; image: HTMLImageElement | null; failed: boolean
  }>({ image: null, failed: false })

  useEffect(() => {
    const controller = new AbortController()
    void loadStaticArtwork(imageUrl, controller.signal).then((image) => {
      if (!controller.signal.aborted) setResult({ imageUrl, image, failed: false })
    }).catch(() => {
      if (!controller.signal.aborted) setResult({ imageUrl, image: null, failed: true })
    })
    return () => controller.abort()
  }, [imageUrl])

  return result.imageUrl === imageUrl
    ? result : { image: null, failed: false }
}
