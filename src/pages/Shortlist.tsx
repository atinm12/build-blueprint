import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Check, Copy, Download, Link2, ThumbsDown, ThumbsUp, Trophy, X } from 'lucide-react'
import { toPng } from 'html-to-image'
import { problemById, type Problem } from '../data/problems'
import { industryById } from '../data/taxonomy'
import { useStore, type ShortlistItem } from '../lib/store'
import { Section } from '../components/ui'

const score = (i: ShortlistItem) => Object.values(i.votes).reduce<number>((a, b) => a + b, 0)

function formatDuration(ms: number) {
  const min = Math.round(ms / 60000)
  if (min < 1) return 'under a minute'
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  if (h < 48) return `${h} hr ${min % 60} min`
  return `${Math.round(h / 24)} days`
}

export default function Shortlist() {
  const store = useStore()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [notice, setNotice] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // import a teammate's shared link once, then clean the URL
  const shared = params.get('s')
  const importShared = store.importShared
  const imported = useRef<string | null>(null)
  useEffect(() => {
    if (!shared || imported.current === shared) return
    imported.current = shared
    const result = importShared(shared)
    setNotice(result ? `Imported your team’s shortlist${result.added ? ` (${result.added} new)` : ''}. Votes merged.` : 'That share link looks broken.')
    navigate('/shortlist', { replace: true })
  }, [shared, importShared, navigate])

  const items = [...store.items].sort((a, b) => score(b) - score(a) || a.addedAt - b.addedAt)
  const me = store.me.trim() || 'Me'
  const picked = store.picked ? problemById(store.picked) : undefined

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(store.shareUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link and send it to your team:', store.shareUrl())
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/library" className="text-sm text-gray-500 hover:text-gray-800">← Library</Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{store.team ? `${store.team}’s shortlist` : 'Team shortlist'}</h1>
        <p className="mt-1 text-sm text-gray-500">Save problems, share the link with teammates so they can vote, then pick one and export a pitch slide.</p>
      </div>

      {notice && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
          {notice}
          <button onClick={() => setNotice(null)} aria-label="Dismiss"><X className="h-4 w-4 text-gray-400" /></button>
        </div>
      )}

      <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="text-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Team name</span>
          <input value={store.team} onChange={(e) => store.setTeam(e.target.value)} placeholder="e.g. Team Byte Me"
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 focus:border-gray-400 focus:outline-none" />
        </label>
        <label className="text-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Your name (for votes)</span>
          <input value={store.me} onChange={(e) => store.setMe(e.target.value)} placeholder="e.g. Sam"
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 focus:border-gray-400 focus:outline-none" />
        </label>
        <button onClick={copyLink} disabled={!items.length}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:bg-gray-300">
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          {copied ? 'Link copied' : 'Copy share link'}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-600">Your shortlist is empty.</p>
          <p className="mt-1 text-sm text-gray-500">Open a problem and click “Save to shortlist”.</p>
          <Link to="/library" className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700">Browse problems</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => {
            const p = problemById(item.id)
            if (!p) return null
            const mine = item.votes[me]
            const voters = Object.entries(item.votes)
            const isPicked = store.picked === p.id
            return (
              <div key={p.id} className={`rounded-lg border bg-white p-4 ${isPicked ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200'}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="flex items-center gap-1 sm:flex-col">
                    <button onClick={() => store.vote(p.id, 1)} aria-label="Vote up"
                      className={`rounded-md p-1.5 ${mine === 1 ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900">{score(item)}</span>
                    <button onClick={() => store.vote(p.id, -1)} aria-label="Vote down"
                      className={`rounded-md p-1.5 ${mine === -1 ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>#{idx + 1}</span>·<span>{industryById(p.industry)?.name}</span>
                      {isPicked && <span className="inline-flex items-center gap-1 rounded bg-gray-900 px-1.5 py-0.5 font-semibold text-white"><Trophy className="h-3 w-3" /> Team pick</span>}
                    </div>
                    <Link to={`/problem/${p.id}`} className="mt-1 block font-semibold text-gray-900 hover:underline">{p.title}</Link>
                    <p className="text-sm text-gray-600">{p.oneLiner}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      {voters.length
                        ? voters.map(([who, v]) => `${who} ${v > 0 ? '👍' : '👎'}`).join('  ·  ')
                        : 'No votes yet'}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => store.pick(isPicked ? null : p.id)}
                      className={`rounded-md border px-3 py-1.5 text-sm font-medium ${isPicked ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}>
                      {isPicked ? 'Picked' : 'Pick this one'}
                    </button>
                    <button onClick={() => store.remove(p.id)} aria-label="Remove" className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          <p className="text-xs text-gray-400">
            Votes live in this browser. Teammates open your share link, vote, and send their link back — opening it merges everyone’s votes.
          </p>
        </div>
      )}

      {picked && (
        <Section
          title="Pitch slide"
          aside={store.pickedAt && <span className="text-xs text-gray-400">Picked in {formatDuration(store.pickedAt - store.firstVisitAt)} from your first visit</span>}
        >
          <SlideExport problem={picked} team={store.team} />
        </Section>
      )}
    </div>
  )
}

function SlideExport({ problem, team }: { problem: Problem; team: string }) {
  const slideRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 1280))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const download = async () => {
    if (!slideRef.current) return
    setBusy(true)
    try {
      const url = await toPng(slideRef.current, { width: 1280, height: 720, pixelRatio: 2, style: { transform: 'none' } })
      const a = document.createElement('a')
      a.href = url
      a.download = `${problem.id}-pitch-slide.png`
      a.click()
    } finally {
      setBusy(false)
    }
  }

  const asText = () =>
    [
      `THE PROBLEM: ${problem.title}`,
      '',
      problem.summary,
      '',
      ...problem.stats.map((s) => `• ${s.value} — ${s.label} (${problem.sources[s.source].publisher})`),
      '',
      'Sources:',
      ...problem.sources.map((s) => `- ${s.title}, ${s.publisher} (${s.year}). ${s.url}`),
    ].join('\n')

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(asText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy the slide text:', asText())
    }
  }

  return (
    <div className="space-y-4">
      <div ref={frameRef} className="relative w-full overflow-hidden rounded-md border border-gray-200" style={{ aspectRatio: '16 / 9' }}>
        <div ref={slideRef} style={{ width: 1280, height: 720, transform: `scale(${scale})`, transformOrigin: 'top left' }}
          className="absolute left-0 top-0 flex flex-col bg-white p-16 font-sans text-gray-900">
          <div className="flex items-center justify-between text-xl font-semibold uppercase tracking-widest text-gray-400">
            <span>The problem</span>
            <span>{team || 'Our team'}</span>
          </div>
          <h2 className="mt-6 text-5xl font-bold leading-tight">{problem.title}</h2>
          <div className="mt-10 grid flex-1 grid-cols-2 gap-8">
            {problem.stats.slice(0, 2).map((s) => (
              <div key={s.label} className="rounded-2xl bg-gray-100 p-8">
                <div className="text-6xl font-bold">{s.value}</div>
                <div className="mt-4 text-2xl leading-snug text-gray-600">{s.label}</div>
              </div>
            ))}
            {problem.stats.length === 1 && (
              <p className="self-center text-2xl leading-relaxed text-gray-600">{problem.summary.split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.')}</p>
            )}
          </div>
          <div className="mt-8 border-t border-gray-200 pt-5 text-lg text-gray-500">
            Sources: {problem.sources.map((s) => `${s.publisher} (${s.year})`).join('; ')}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={download} disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:bg-gray-400">
          <Download className="h-4 w-4" /> {busy ? 'Rendering…' : 'Download slide (PNG)'}
        </button>
        <button onClick={copyText}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy slide text + sources'}
        </button>
      </div>
    </div>
  )
}
