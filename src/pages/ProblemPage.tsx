import { Link, useNavigate, useParams } from 'react-router-dom'
import { ExternalLink, Lightbulb } from 'lucide-react'
import { problemById } from '../data/problems'
import { industryById } from '../data/taxonomy'
import { SaveButton, Section, SourceLink, TrackTags } from '../components/ui'
import { LiveNews, LivePapers } from '../components/LiveEvidence'

export default function ProblemPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const problem = problemById(id)

  if (!problem) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">That problem doesn’t exist.</p>
        <Link to="/library" className="mt-3 inline-block font-medium text-gray-900 underline">Back to library</Link>
      </div>
    )
  }
  const industry = industryById(problem.industry)!
  const devpost = `https://devpost.com/software/search?query=${encodeURIComponent(problem.query)}`

  return (
    <div className="space-y-5">
      <button
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(`/library/${industry.id}`))}
        className="text-sm text-gray-500 hover:text-gray-800"
      >
        ← Back to library
      </button>

      <header className="space-y-3">
        <Link to={`/library/${industry.id}`} className="text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-800">
          {industry.name}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{problem.title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TrackTags tracks={problem.tracks} />
          <SaveButton id={problem.id} />
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Section title="Plain-language summary">
            <p className="leading-relaxed text-gray-700">{problem.summary}</p>
          </Section>

          <Section title="Key stats">
            <div className="grid gap-3 sm:grid-cols-2">
              {problem.stats.map((s) => (
                <div key={s.label} className="rounded-md bg-gray-50 p-4">
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="mt-1 text-sm text-gray-600">{s.label}</div>
                  <div className="mt-2 text-xs text-gray-400">Source: {problem.sources[s.source].publisher}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Original sources">
            <div className="space-y-1">
              {problem.sources.map((s) => <SourceLink key={s.url} source={s} />)}
            </div>
          </Section>

          <Section title="More research (live)" aside={<span className="text-xs text-gray-400">via OpenAlex</span>}>
            <LivePapers query={problem.query} />
          </Section>

          <Section title="Recent news (live)">
            <LiveNews terms={problem.query.split(' ').slice(0, 2)} mustMatch={[problem.query.split(' ').slice(0, 2).join(' '), ...problem.keywords]} />
          </Section>
        </div>

        <aside className="space-y-5">
          <Section title="Already trying to solve it">
            <ul className="space-y-3">
              {problem.solutions.map((s) => (
                <li key={s.name}>
                  <div className="text-sm font-medium text-gray-900">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.what}</div>
                </li>
              ))}
            </ul>
            <a href={devpost} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:underline">
              See past hackathon projects on Devpost <ExternalLink className="h-3 w-3" />
            </a>
          </Section>

          <Section title="What you could build">
            <ul className="space-y-3">
              {problem.buildIdeas.map((idea) => (
                <li key={idea} className="flex gap-2 text-sm text-gray-700">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  {idea}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-gray-400">
              Starting points only — check the “already trying” list so your take is different.
            </p>
          </Section>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-600">Like this one? Save it so your team can vote, then export a pitch slide.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <SaveButton id={problem.id} />
              <Link to="/shortlist" className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                View shortlist →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
