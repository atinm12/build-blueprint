import { Link, NavLink } from 'react-router-dom'
import { Bookmark, BookmarkCheck, ExternalLink, FileText, Newspaper, BarChart3 } from 'lucide-react'
import type { ReactNode } from 'react'
import { TRACKS, trackById, type TrackId } from '../data/taxonomy'
import { useStore } from '../lib/store'
import type { Problem, Source } from '../data/problems'

export function Header() {
  const { items } = useStore()
  const nav = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-gray-900">
          <img src="./favicon.svg" alt="" className="h-6 w-6" />
          <span className="hidden sm:inline">Build Blueprint</span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/library" className={nav}>Library</NavLink>
          <NavLink to="/validate" className={nav}>Validate</NavLink>
          <NavLink to="/shortlist" className={nav}>
            Shortlist
            {items.length > 0 && (
              <span className="ml-1.5 rounded-full bg-gray-900 px-1.5 py-0.5 text-[11px] font-semibold text-white">{items.length}</span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export function TrackFilter({ compact = false }: { compact?: boolean }) {
  const { tracks, toggleTrack, setTracks } = useStore()
  return (
    <div className="flex flex-wrap items-center gap-2">
      {!compact && <span className="mr-1 text-sm font-medium text-gray-500">Hackathon track:</span>}
      <button
        onClick={() => setTracks([])}
        className={`rounded-full border px-3 py-1 text-sm transition ${tracks.length === 0 ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'}`}
      >
        All
      </button>
      {TRACKS.map((t) => {
        const on = tracks.includes(t.id)
        return (
          <button
            key={t.id}
            onClick={() => toggleTrack(t.id)}
            aria-pressed={on}
            className={`rounded-full border px-3 py-1 text-sm transition ${on ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'}`}
          >
            {t.name}
          </button>
        )
      })}
    </div>
  )
}

export function TrackTags({ tracks }: { tracks: TrackId[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tracks.map((t) => (
        <span key={t} className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {trackById(t)?.name}
        </span>
      ))}
    </div>
  )
}

export function SaveButton({ id, small = false }: { id: string; small?: boolean }) {
  const { isSaved, toggleSaved } = useStore()
  const saved = isSaved(id)
  const Icon = saved ? BookmarkCheck : Bookmark
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleSaved(id)
      }}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border font-medium transition ${small ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-2 text-sm'} ${saved ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'}`}
    >
      <Icon className={small ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      {saved ? 'Saved' : 'Save to shortlist'}
    </button>
  )
}

export function ProblemRow({ problem }: { problem: Problem }) {
  return (
    <Link
      to={`/problem/${problem.id}`}
      className="group flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-sm sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="min-w-0 space-y-1.5">
        <h3 className="font-semibold text-gray-900 group-hover:underline">{problem.title}</h3>
        <p className="text-sm text-gray-600">{problem.oneLiner}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
            <FileText className="h-3.5 w-3.5" /> {problem.sources.length} {problem.sources.length === 1 ? 'source' : 'sources'} + live research
          </span>
          <TrackTags tracks={problem.tracks} />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <SaveButton id={problem.id} small />
        <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 group-hover:bg-gray-200">Open →</span>
      </div>
    </Link>
  )
}

const SOURCE_ICON = { study: FileText, report: BarChart3, news: Newspaper }
export function SourceLink({ source }: { source: Source }) {
  const Icon = SOURCE_ICON[source.type]
  return (
    <a href={source.url} target="_blank" rel="noreferrer" className="group flex gap-3 rounded-md p-2 -mx-2 hover:bg-gray-50">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-900 group-hover:underline">
          {source.title} <ExternalLink className="inline h-3 w-3 text-gray-400" />
        </div>
        <div className="text-xs text-gray-500">
          {source.publisher} · {source.year} · <span className="capitalize">{source.type}</span>
        </div>
      </div>
    </a>
  )
}

export function Section({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

export function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-3 text-sm text-gray-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
      {label}
    </div>
  )
}
