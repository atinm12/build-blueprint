import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import { INDUSTRIES } from '../data/taxonomy'
import { PROBLEMS } from '../data/problems'
import { useStore } from '../lib/store'
import { TrackFilter } from '../components/ui'

const EXAMPLES = [
  'An app that reminds college students to use their leftover meal swipes before they expire',
  'A tool that helps tenants understand eviction notices',
  'Sensors that tell farmers exactly when to water their crops',
]

export default function Home() {
  const [idea, setIdea] = useState('')
  const navigate = useNavigate()
  const { tracks } = useStore()

  const visible = (industryId: string) =>
    PROBLEMS.filter((p) => p.industry === industryId && (tracks.length === 0 || p.tracks.some((t) => tracks.includes(t)))).length

  const submit = (text: string) => {
    if (text.trim().length < 8) return
    navigate(`/validate?q=${encodeURIComponent(text.trim())}`)
  }

  return (
    <div className="space-y-10">
      <section className="pt-4 text-center sm:pt-10">
        <h1 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Find a hackathon idea backed by real evidence
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          Browse problems drawn from research and news, or paste in your own idea to see if studies back it up.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(idea)
          }}
          className="mx-auto mt-7 max-w-2xl"
        >
          <div className="flex flex-col gap-2 rounded-xl border border-gray-300 bg-white p-2 shadow-sm focus-within:border-gray-500 sm:flex-row">
            <div className="flex flex-1 items-start gap-2 px-2 py-1.5">
              <Search className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    submit(idea)
                  }
                }}
                rows={2}
                placeholder="Paste your idea, e.g. “an app that helps students find free food on campus”"
                className="w-full resize-none bg-transparent text-left text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={idea.trim().length < 8}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Check evidence <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
        <div className="mx-auto mt-3 flex max-w-2xl flex-wrap justify-center gap-2 text-xs">
          <span className="text-gray-400">Try:</span>
          {EXAMPLES.map((ex) => (
            <button key={ex} onClick={() => submit(ex)} className="text-gray-500 underline decoration-gray-300 underline-offset-2 hover:text-gray-800">
              {ex.length > 52 ? ex.slice(0, 50) + '…' : ex}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Or browse problems by industry</h2>
            <p className="text-sm text-gray-500">Pick your hackathon’s track to only see problems that fit it.</p>
          </div>
          <Link to="/library" className="text-sm font-medium text-gray-700 hover:underline">View all {PROBLEMS.length} problems →</Link>
        </div>
        <TrackFilter />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((ind) => {
            const n = visible(ind.id)
            return (
              <Link
                key={ind.id}
                to={`/library/${ind.id}`}
                className={`group rounded-lg border bg-white p-4 transition ${n ? 'border-gray-200 hover:border-gray-400 hover:shadow-sm' : 'border-gray-100 opacity-50'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">{ind.name}</h3>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{n}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{ind.blurb}</p>
                <span className="mt-3 inline-block text-xs font-medium text-gray-400 group-hover:text-gray-700">
                  {n ? 'Browse problems →' : 'None in selected tracks'}
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
