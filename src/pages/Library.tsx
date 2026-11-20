import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { INDUSTRIES, industryById } from '../data/taxonomy'
import { PROBLEMS } from '../data/problems'
import { useStore } from '../lib/store'
import { ProblemRow, TrackFilter } from '../components/ui'

export default function Library() {
  const { industry } = useParams()
  const { tracks } = useStore()
  const [q, setQ] = useState('')
  const current = industry ? industryById(industry) : undefined

  const problems = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return PROBLEMS.filter(
      (p) =>
        (!current || p.industry === current.id) &&
        (tracks.length === 0 || p.tracks.some((t) => tracks.includes(t))) &&
        (!needle || `${p.title} ${p.oneLiner} ${p.keywords.join(' ')}`.toLowerCase().includes(needle)),
    )
  }, [current, tracks, q])

  const tab = (active: boolean) =>
    `whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition ${active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`

  return (
    <div className="space-y-6">
      <div>
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-800">← Home</Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{current ? current.name : 'All problems'}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Real problems pulled from research and news. Open one to see the summary, key stats, and sources.
        </p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex gap-1">
          <Link to="/library" className={tab(!current)}>All</Link>
          {INDUSTRIES.map((i) => (
            <Link key={i.id} to={`/library/${i.id}`} className={tab(current?.id === i.id)}>{i.name}</Link>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <TrackFilter />
        <label className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 focus-within:border-gray-400">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by keyword (e.g. students, sensors, debt)"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </label>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-500">{problems.length} {problems.length === 1 ? 'problem' : 'problems'}</p>
        {problems.map((p) => <ProblemRow key={p.id} problem={p} />)}
        {problems.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            No problems match these filters. Try another track, or{' '}
            <Link to="/validate" className="font-medium text-gray-800 underline">check your own idea</Link>.
          </div>
        )}
      </div>
    </div>
  )
}
