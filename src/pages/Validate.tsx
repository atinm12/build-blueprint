import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, CircleDashed, ArrowRight, HelpCircle, Search } from 'lucide-react'
import { extractKeywords, hasProblemSignal, isTooVague, matchLibrary, minMatchesFor, newsIsRelevant, paperRelevance, verdictFor, type Verdict } from '../lib/match'
import { searchNews, searchPapers, ResearchError, type NewsArticle, type Paper } from '../lib/research'
import { GoogleNewsLink, NewsItem, PaperItem } from '../components/LiveEvidence'
import { ProblemRow, Section, Spinner } from '../components/ui'

interface Results {
  papers: Array<{ paper: Paper; relevance: number; isProblem: boolean }>
  news: NewsArticle[]
  newsProvider: string
  paperError: string | null
  newsError: string | null
}

const VERDICT: Record<Verdict, { title: string; body: string; icon: typeof CheckCircle2; tone: string }> = {
  strong: {
    title: 'Strong evidence this problem is real',
    body: 'Multiple studies describe the problem behind your idea as something people struggle with. Use the sources below in your pitch.',
    icon: CheckCircle2,
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  some: {
    title: 'Some evidence found',
    body: 'Researchers study this topic, but few sources describe it as a problem people actually face. Read the sources, or rephrase your idea around who struggles and why.',
    icon: CircleDashed,
    tone: 'border-amber-200 bg-amber-50 text-amber-900',
  },
  none: {
    title: 'No evidence found',
    body: 'We couldn’t find studies or news that back up this problem. That doesn’t mean it isn’t real — try describing who has the problem and what goes wrong, rather than your solution.',
    icon: AlertCircle,
    tone: 'border-gray-300 bg-gray-50 text-gray-800',
  },
}

export default function Validate() {
  const [params, setParams] = useSearchParams()
  const idea = params.get('q') ?? ''
  const [draft, setDraft] = useState(idea)
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setDraft(idea)
  }, [idea])

  const keywords = useMemo(() => extractKeywords(idea), [idea])
  const tooVague = useMemo(() => isTooVague(keywords), [keywords])
  const library = useMemo(() => (idea && !tooVague ? matchLibrary(idea) : []), [idea, tooVague])

  useEffect(() => {
    if (!idea || tooVague) {
      setResults(null)
      return
    }
    let alive = true
    setLoading(true)
    setResults(null)
    const minMatch = minMatchesFor(keywords)

    const papersP = searchPapers(keywords.slice(0, 5).join(' '), 15, 1)
      .then((ps) => ({
        ok: ps
          .map((paper) => ({ paper, relevance: paperRelevance(paper, keywords), isProblem: hasProblemSignal(paper) }))
          .filter((x) => x.relevance >= minMatch)
          .sort((a, b) => Number(b.isProblem) - Number(a.isProblem) || b.relevance - a.relevance || b.paper.citations - a.paper.citations)
          .slice(0, 6),
        err: null as string | null,
      }))
      .catch((e) => ({ ok: [], err: e instanceof ResearchError ? e.message : 'Research search failed.' }))

    const newsP = searchNews(keywords.slice(0, 4), 8)
      .then((n) => ({ ok: n.articles.filter((a) => newsIsRelevant(a, keywords)).slice(0, 5), provider: n.provider as string, err: null as string | null }))
      .catch((e) => ({ ok: [] as NewsArticle[], provider: '', err: e instanceof ResearchError ? e.message : 'News search failed.' }))

    Promise.all([papersP, newsP]).then(([p, n]) => {
      if (!alive) return
      setResults({ papers: p.ok, news: n.ok, newsProvider: n.provider, paperError: p.err, newsError: n.err })
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [idea, keywords, tooVague])

  const problemPapers = results ? results.papers.filter((p) => p.isProblem).length : 0
  const verdict = results ? verdictFor(results.papers.length, problemPapers, results.news.length, library.length) : null
  const V = verdict ? VERDICT[verdict] : null

  return (
    <div className="space-y-6">
      <div>
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-800">← Home</Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Idea Validator</h1>
        <p className="mt-1 text-sm text-gray-500">Paste your idea. We search research papers and recent news for evidence that the problem is real.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (draft.trim().length >= 8) setParams({ q: draft.trim() })
        }}
        className="rounded-lg border border-gray-200 bg-white p-4"
      >
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor="idea">Your idea</label>
        <textarea
          id="idea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="e.g. A tool that helps first-generation college students keep track of financial aid deadlines"
          className="mt-2 w-full resize-y rounded-md border border-gray-200 p-3 text-gray-900 focus:border-gray-400 focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-400">Tip: name who has the problem and what goes wrong for them.</p>
          <button
            type="submit"
            disabled={draft.trim().length < 8}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:bg-gray-300"
          >
            <Search className="h-4 w-4" /> Check evidence
          </button>
        </div>
      </form>

      {!idea && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          Results will appear here. Not sure where to start?{' '}
          <Link to="/library" className="font-medium text-gray-800 underline">Browse the problem library</Link>.
        </div>
      )}

      {idea && tooVague && (
        <div className="flex gap-3 rounded-lg border border-gray-300 bg-white p-4 text-gray-800">
          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
          <div>
            <div className="font-semibold">Too vague to check</div>
            <p className="mt-0.5 text-sm text-gray-600">
              {keywords.length
                ? <>We only found {keywords.length === 1 ? 'one specific word' : 'a few general words'} ({keywords.join(', ')}). </>
                : <>We couldn’t find any specific words to search for. </>}
              Say <strong>who</strong> has the problem and <strong>what goes wrong</strong> for them.
            </p>
            <p className="mt-3 text-sm text-gray-600">
              <span className="text-gray-400">Instead of</span> “A chatbot for everything”
              <br />
              <span className="text-gray-400">try</span>{' '}
              <button
                type="button"
                onClick={() => setParams({ q: 'First-generation college students can’t get answers about financial aid outside office hours' })}
                className="text-left font-medium text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-700"
              >
                “First-generation college students can’t get answers about financial aid outside office hours”
              </button>
            </p>
          </div>
        </div>
      )}

      {idea && !tooVague && (
        <>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-500">Searching for:</span>
            {keywords.map((k) => (
              <span key={k} className="rounded bg-white px-2 py-0.5 font-medium text-gray-700 ring-1 ring-gray-200">{k}</span>
            ))}
          </div>

          {loading && <Spinner label="Checking research papers and news…" />}

          {V && (
            <div className={`flex gap-3 rounded-lg border p-4 ${V.tone}`}>
              <V.icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <div className="font-semibold">{V.title}</div>
                <p className="mt-0.5 text-sm opacity-90">{V.body}</p>
                <p className="mt-2 text-xs opacity-75">
                  {results!.papers.length} relevant {results!.papers.length === 1 ? 'study' : 'studies'} ({problemPapers} describe a problem) · {results!.news.length} news{' '}
                  {results!.news.length === 1 ? 'article' : 'articles'} · {library.length} similar {library.length === 1 ? 'problem' : 'problems'} in the library
                </p>
              </div>
            </div>
          )}

          {library.length > 0 && (
            <Section title="Similar problems in the library">
              <p className="mb-3 text-sm text-gray-500">These have curated stats and sources you can use in a pitch.</p>
              <div className="space-y-3">
                {library.map((m) => <ProblemRow key={m.problem.id} problem={m.problem} />)}
              </div>
            </Section>
          )}

          {results && (
            <div className="grid gap-5 lg:grid-cols-2">
              <Section title="Matching studies" aside={<span className="text-xs text-gray-400">via OpenAlex</span>}>
                {results.paperError ? (
                  <p className="text-sm text-gray-500">{results.paperError}</p>
                ) : results.papers.length ? (
                  <ul>{results.papers.map(({ paper, relevance, isProblem }) => <PaperItem key={paper.id} paper={paper} highlight={relevance} describesProblem={isProblem} />)}</ul>
                ) : (
                  <p className="text-sm text-gray-500">No studies closely matched your idea’s keywords.</p>
                )}
              </Section>
              <Section title="Recent news" aside={results.newsProvider && <span className="text-xs text-gray-400">via {results.newsProvider}</span>}>
                {results.newsError ? (
                  <p className="text-sm text-gray-500">{results.newsError}</p>
                ) : results.news.length ? (
                  <ul>{results.news.map((a) => <NewsItem key={a.url} article={a} />)}</ul>
                ) : (
                  <p className="text-sm text-gray-500">No recent news coverage matched.</p>
                )}
                <GoogleNewsLink terms={keywords.slice(0, 4)} />
              </Section>
            </div>
          )}

          {verdict === 'none' && (
            <Link to="/library" className="inline-flex items-center gap-1 text-sm font-medium text-gray-800 hover:underline">
              Browse validated problems instead <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </>
      )}
    </div>
  )
}
