import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { TrackId } from '../data/taxonomy'
import { problemById } from '../data/problems'

export type Vote = 1 | -1

export interface ShortlistItem {
  id: string
  votes: Record<string, Vote>
  addedAt: number
}

interface PersistedState {
  tracks: TrackId[]
  team: string
  me: string
  items: ShortlistItem[]
  picked: string | null
  /** for the PRD's "time from opening the site to picking an idea" metric */
  firstVisitAt: number
  pickedAt: number | null
}

interface StoreValue extends PersistedState {
  setTracks: (t: TrackId[]) => void
  toggleTrack: (t: TrackId) => void
  setTeam: (name: string) => void
  setMe: (name: string) => void
  isSaved: (id: string) => boolean
  toggleSaved: (id: string) => void
  remove: (id: string) => void
  vote: (id: string, v: Vote) => void
  pick: (id: string | null) => void
  shareUrl: () => string
  importShared: (encoded: string) => { added: number } | null
}

const KEY = 'bb-state-v1'

const initial = (): PersistedState => {
  const fallback: PersistedState = {
    tracks: [],
    team: '',
    me: '',
    items: [],
    picked: null,
    firstVisitAt: Date.now(),
    pickedAt: null,
  }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return fallback
    return { ...fallback, ...JSON.parse(raw) }
  } catch {
    return fallback
  }
}

// ── share-link encoding (no backend: the whole shortlist travels in the URL) ──
interface SharePayload {
  t: string
  i: Array<[string, Record<string, Vote>]>
  p: string | null
}

function toBase64Url(s: string) {
  const bytes = new TextEncoder().encode(s)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function fromBase64Url(s: string) {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'))
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(initial)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* best effort */
    }
  }, [state])

  const update = useCallback((fn: (s: PersistedState) => PersistedState) => setState(fn), [])

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      setTracks: (tracks) => update((s) => ({ ...s, tracks })),
      toggleTrack: (t) =>
        update((s) => ({ ...s, tracks: s.tracks.includes(t) ? s.tracks.filter((x) => x !== t) : [...s.tracks, t] })),
      setTeam: (team) => update((s) => ({ ...s, team })),
      setMe: (me) => update((s) => ({ ...s, me })),
      isSaved: (id) => state.items.some((i) => i.id === id),
      toggleSaved: (id) =>
        update((s) =>
          s.items.some((i) => i.id === id)
            ? { ...s, items: s.items.filter((i) => i.id !== id), picked: s.picked === id ? null : s.picked }
            : { ...s, items: [...s.items, { id, votes: {}, addedAt: Date.now() }] },
        ),
      remove: (id) =>
        update((s) => ({ ...s, items: s.items.filter((i) => i.id !== id), picked: s.picked === id ? null : s.picked })),
      vote: (id, v) =>
        update((s) => {
          const who = s.me.trim() || 'Me'
          return {
            ...s,
            items: s.items.map((i) => {
              if (i.id !== id) return i
              const votes = { ...i.votes }
              if (votes[who] === v) delete votes[who]
              else votes[who] = v
              return { ...i, votes }
            }),
          }
        }),
      pick: (id) => update((s) => ({ ...s, picked: id, pickedAt: id ? (s.pickedAt ?? Date.now()) : null })),
      shareUrl: () => {
        const payload: SharePayload = { t: state.team, i: state.items.map((i) => [i.id, i.votes]), p: state.picked }
        const base = window.location.href.split('#')[0]
        return `${base}#/shortlist?s=${toBase64Url(JSON.stringify(payload))}`
      },
      importShared: (encoded) => {
        let payload: SharePayload
        try {
          payload = JSON.parse(fromBase64Url(encoded))
          if (!Array.isArray(payload.i)) return null
        } catch {
          return null
        }
        const valid = payload.i.filter(([id]) => problemById(id))
        const added = valid.filter(([id]) => !state.items.some((x) => x.id === id)).length
        update((s) => {
          const items = s.items.map((item) => {
            const incoming = valid.find(([id]) => id === item.id)
            if (!incoming) return item
            // merge teammates' votes; votes already on this device win
            return { ...item, votes: { ...incoming[1], ...item.votes } }
          })
          for (const [id, votes] of valid) {
            if (!items.some((x) => x.id === id)) items.push({ id, votes: { ...votes }, addedAt: Date.now() })
          }
          return { ...s, items, team: s.team || payload.t || '', picked: s.picked ?? payload.p ?? null }
        })
        return { added }
      },
    }),
    [state, update],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
