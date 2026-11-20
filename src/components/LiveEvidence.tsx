import { useEffect, useState } from 'react'
import { ExternalLink, Quote } from 'lucide-react'
import { googleNewsUrl, searchNews, searchPapers, ResearchError, type NewsArticle, type Paper } from '../lib/research'
import { Spinner } from './ui'

type Load<T> = { status: 'loading' } | { status: 'done'; data: T } | { status: 'error'; message: string }

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): Load<T> {
  const [state, setState] = useState<Load<T>>({ status: 'loading' })
  useEffect(() => {
    let alive = true
    setState({ status: 'loading' })
    fn()
      .then((data) => alive && setState({ status: 'done', data }))
      .catch((e) => alive && setState({ status: 'error', message: e instanceof ResearchError ? e.message : 'Something went wrong.' }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}

export function PaperItem({ paper, highlight }: { paper: Paper; highlight?: number }) {
  return (
    <li className="border-t border-gray-100 py-3 first:border-0 first:pt-0">
      <a href={paper.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-900 hover:underline">
        {paper.title} <ExternalLink className="inline h-3 w-3 text-gray-400" />
      </a>
      <div className="mt-0.5 text-xs text-gray-500">
        {[paper.venue, paper.year, `${paper.citations.toLocaleString()} citations`].filter(Boolean).join(' · ')}
        {paper.isOpenAccess && <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 font-medium text-gray-600">Free to read</span>}
        {highlight !== undefined && (
          <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 font-medium text-gray-600">
            matches {highlight} keyword{highlight === 1 ? '' : 's'}
          </span>
        )}
      </div>
      {paper.summary && (
        <p className="mt-1.5 flex gap-1.5 text-sm text-gray-600">
          <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" />
          {paper.summary}
        </p>
      )}
    </li>
  )
}

export function NewsItem({ article }: { article: NewsArticle }) {
  return (
    <li className="border-t border-gray-100 py-2.5 first:border-0 first:pt-0">
      <a href={article.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-900 hover:underline">
        {article.title} <ExternalLink className="inline h-3 w-3 text-gray-400" />
      </a>
      <div className="mt-0.5 text-xs text-gray-500">{[article.domain, article.date].filter(Boolean).join(' · ')}</div>
    </li>
  )
}

export function LivePapers({ query }: { query: string }) {
  const state = useAsync(() => searchPapers(query, 5, 10), [query])
  if (state.status === 'loading') return <Spinner label="Searching 250M+ research papers…" />
  if (state.status === 'error') return <p className="text-sm text-gray-500">{state.message}</p>
  if (!state.data.length) return <p className="text-sm text-gray-500">No recent papers found.</p>
  return <ul>{state.data.map((p) => <PaperItem key={p.id} paper={p} />)}</ul>
}

export function LiveNews({ terms, mustMatch }: { terms: string[]; mustMatch?: string[] }) {
  const state = useAsync(async () => {
    const result = await searchNews(terms, 10)
    // keep only headlines that name the problem itself, not just share a word with the query
    const articles = mustMatch
      ? result.articles.filter((a) => mustMatch.some((k) => a.title.toLowerCase().includes(k.toLowerCase())))
      : result.articles
    return { ...result, articles: articles.slice(0, 5) }
  }, [terms.join('|')])
  return (
    <div>
      {state.status === 'loading' && <Spinner label="Searching recent news…" />}
      {state.status === 'error' && <p className="text-sm text-gray-500">{state.message}</p>}
      {state.status === 'done' &&
        (state.data.articles.length ? (
          <>
            <ul>{state.data.articles.map((a) => <NewsItem key={a.url} article={a} />)}</ul>
            <p className="mt-2 text-xs text-gray-400">via {state.data.provider}</p>
          </>
        ) : (
          <p className="text-sm text-gray-500">No recent news coverage found.</p>
        ))}
      <GoogleNewsLink terms={terms} />
    </div>
  )
}

export function GoogleNewsLink({ terms }: { terms: string[] }) {
  return (
    <a href={googleNewsUrl(terms)} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:underline">
      Search Google News for more <ExternalLink className="h-3 w-3" />
    </a>
  )
}
