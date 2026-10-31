import { useEffect, useState } from 'react'
import type { Collectible } from '../types/collectibles'
import { fetchWaxCollectibles } from '../services/wax'

export function useWaxCollectibles() {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<{
    attempt: number; collectibles: readonly Collectible[]; error: string | null; loading: boolean
  }>({ attempt: 0, collectibles: [], error: null, loading: true })

  useEffect(() => {
    const controller = new AbortController()
    void fetchWaxCollectibles(controller.signal).then((collectibles) => {
      if (!controller.signal.aborted) setState({ attempt, collectibles, loading: false, error: null })
    }).catch(() => {
      if (!controller.signal.aborted) setState({
        attempt, collectibles: [], loading: false,
        error: 'WAX collectibles could not be loaded. The rest of the room is ready to explore.',
      })
    })
    return () => controller.abort()
  }, [attempt])

  return {
    ...state, loading: state.loading || state.attempt !== attempt,
    error: state.attempt === attempt ? state.error : null,
    retry: () => setAttempt((value) => value + 1),
  }
}
