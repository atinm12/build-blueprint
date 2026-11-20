// Live evidence lookups. Both APIs are free, keyless, and allow browser (CORS) requests.
//  - OpenAlex: 250M+ scholarly works (https://openalex.org)
//  - GDELT DOC 2.0: global news coverage (https://www.gdeltproject.org)

export interface Paper {
  id: string
  title: string
  year: number | null
  venue: string | null
  citations: number
  url: string
  summary: string
  isOpenAccess: boolean
}

export interface NewsArticle {
  title: string
  url: string
  domain: string
  date: string | null
}

export class ResearchError extends Error {
  rateLimited: boolean
  constructor(message: string, rateLimited = false) {
    super(message)
    this.rateLimited = rateLimited
  }
}

const OPENALEX_KEY = import.meta.env.VITE_OPENALEX_API_KEY as string | undefined
const CACHE_PREFIX = 'bb-cache:'
const CACHE_TTL_MS = 1000 * 60 * 60 * 24

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const { at, data } = JSON.parse(raw)
    if (Date.now() - at > CACHE_TTL_MS) return null
    return data as T
  } catch {
    return null
  }
}

function writeCache(key: string, data: unknown) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* storage full or unavailable — caching is best-effort */
  }
}

function rebuildAbstract(inv: Record<string, number[]> | null | undefined): string {
  if (!inv) return ''
  const words: string[] = []
  for (const [word, positions] of Object.entries(inv)) {
    for (const p of positions) words[p] = word
  }
  return words.filter(Boolean).join(' ')
}

/** First ~2 sentences, capped, so cards stay short and readable. */
export function shortSummary(text: string, maxLen = 300): string {
  const clean = text.replace(/\s+/g, ' ').replace(/^(abstract|background|objective)s?[:.\s]+/i, '').trim()
  if (!clean) return ''
  const sentences = clean.match(/[^.!?]+[.!?]+/g) ?? [clean]
  let out = ''
  for (const s of sentences) {
    if ((out + s).length > maxLen) break
    out += s
    if (out.length > maxLen * 0.6) break
  }
  if (!out) out = clean.slice(0, maxLen).replace(/\s\S*$/, '') + '…'
  return out.trim()
}

export async function searchPapers(query: string, limit = 8, minCitations = 0): Promise<Paper[]> {
  const cacheKey = `oa:${limit}:${minCitations}:${query.toLowerCase()}`
  const cached = readCache<Paper[]>(cacheKey)
  if (cached) return cached

  const params = new URLSearchParams({
    search: query,
    filter: `from_publication_date:2012-01-01,has_abstract:true,type:article|review|report|preprint${minCitations ? `,cited_by_count:>${minCitations - 1}` : ''}`,
    'per-page': String(limit),
    select: 'id,title,publication_year,cited_by_count,doi,primary_location,abstract_inverted_index,open_access',
  })
  if (OPENALEX_KEY) params.set('api_key', OPENALEX_KEY)

  let res: Response
  try {
    res = await fetch(`https://api.openalex.org/works?${params}`)
  } catch {
    throw new ResearchError('Could not reach the research database. Check your connection.')
  }
  if (res.status === 429 || res.status === 402) {
    throw new ResearchError('The free daily research-search budget for your network is used up. Try again tomorrow, or add a free OpenAlex API key (see README).', true)
  }
  if (!res.ok) throw new ResearchError(`Research search failed (${res.status}).`)

  const json = await res.json()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const papers: Paper[] = (json.results ?? []).map((w: any) => ({
    id: w.id,
    title: (w.title ?? 'Untitled').replace(/<[^>]+>/g, ''),
    year: w.publication_year ?? null,
    venue: w.primary_location?.source?.display_name ?? null,
    citations: w.cited_by_count ?? 0,
    url: w.doi ?? w.primary_location?.landing_page_url ?? w.id,
    summary: shortSummary(rebuildAbstract(w.abstract_inverted_index)),
    isOpenAccess: !!w.open_access?.is_oa,
  }))
  writeCache(cacheKey, papers)
  return papers
}

export interface NewsResult {
  articles: NewsArticle[]
  provider: 'GDELT' | 'Hacker News'
}

let lastGdeltCall = 0

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  try {
    return await fetch(url, { signal: ctrl.signal })
  } finally {
    clearTimeout(timer)
  }
}

/** GDELT: broad global news coverage, but strictly rate-limited (1 request / 5s per IP). */
async function searchGdelt(terms: string[], limit: number): Promise<NewsArticle[]> {
  const query = terms.map((t) => (t.includes(' ') ? `"${t}"` : t)).join(' ') + ' sourcelang:english'
  const params = new URLSearchParams({
    query,
    mode: 'artlist',
    format: 'json',
    maxrecords: String(limit * 2),
    timespan: '12months',
    sort: 'hybridrel',
  })
  // stay under GDELT's limit; skip rather than queue so the page never stalls
  if (Date.now() - lastGdeltCall < 5500) return []
  lastGdeltCall = Date.now()
  const res = await fetchWithTimeout(`https://api.gdeltproject.org/api/v2/doc/doc?${params}`, 6000)
  if (!res.ok) throw new Error(`gdelt ${res.status}`)
  const text = await res.text()
  let json: { articles?: Array<{ title: string; url: string; domain: string; seendate?: string }> }
  try {
    json = JSON.parse(text)
  } catch {
    return [] // GDELT answers malformed queries with a plain-text message
  }
  const seen = new Set<string>()
  const articles: NewsArticle[] = []
  for (const a of json.articles ?? []) {
    const key = a.title.toLowerCase().slice(0, 60)
    if (seen.has(key)) continue
    seen.add(key)
    articles.push({
      title: a.title,
      url: a.url,
      domain: a.domain,
      date: a.seendate ? `${a.seendate.slice(0, 4)}-${a.seendate.slice(4, 6)}-${a.seendate.slice(6, 8)}` : null,
    })
    if (articles.length >= limit) break
  }
  return articles
}

/** Fallback: news stories shared on Hacker News (reliable, CORS-friendly, tech-leaning). */
async function searchHackerNews(terms: string[], limit: number): Promise<NewsArticle[]> {
  // HN search requires every word to match, so widen from all terms down to the top two,
  // then the single top term if it's specific enough (long words are rarely generic)
  for (let n = terms.length; n >= Math.min(2, terms.length); n--) {
    const found = await searchHackerNewsOnce(terms.slice(0, n), limit)
    if (found.length) return found
  }
  if (terms.length > 1 && terms[0].length >= 6) return searchHackerNewsOnce([terms[0]], limit)
  return []
}

async function searchHackerNewsOnce(terms: string[], limit: number): Promise<NewsArticle[]> {
  const params = new URLSearchParams({
    query: terms.join(' '),
    tags: 'story',
    hitsPerPage: String(limit * 4),
    numericFilters: 'points>4',
    restrictSearchableAttributes: 'title',
    typoTolerance: 'false',
  })
  const res = await fetchWithTimeout(`https://hn.algolia.com/api/v1/search?${params}`, 9000)
  if (!res.ok) throw new Error(`hn ${res.status}`)
  const json = await res.json()
  const articles: NewsArticle[] = []
  for (const h of json.hits ?? []) {
    if (!h.url || /(twitter|x)\.com|news\.ycombinator|reddit\.com|youtube\.com/.test(h.url)) continue
    if (/^(launch|show|ask|tell) hn/i.test(h.title)) continue
    let domain = ''
    try {
      domain = new URL(h.url).hostname.replace(/^www\./, '')
    } catch {
      continue
    }
    articles.push({ title: h.title, url: h.url, domain, date: h.created_at?.slice(0, 10) ?? null })
    if (articles.length >= limit) break
  }
  return articles
}

const inflight = new Map<string, Promise<NewsResult>>()

export function searchNews(terms: string[], limit = 6): Promise<NewsResult> {
  const usable = terms.filter((t) => t.length >= 3).slice(0, 4)
  if (!usable.length) return Promise.resolve({ articles: [], provider: 'GDELT' })
  const cacheKey = `news:${limit}:${usable.join(' ').toLowerCase()}`
  const cached = readCache<NewsResult>(cacheKey)
  if (cached) return Promise.resolve(cached)
  const pending = inflight.get(cacheKey)
  if (pending) return pending

  const run = async (): Promise<NewsResult> => {
    // Race-free fallback: query both at once, prefer GDELT's broader coverage when it answers.
    const gdelt = searchGdelt(usable, limit).catch(() => [] as NewsArticle[])
    const hn = searchHackerNews(usable, limit).catch(() => null)
    const g = await gdelt
    if (g.length) return { articles: g, provider: 'GDELT' }
    const h = await hn
    if (h === null) throw new ResearchError('News search is unavailable right now. Try again in a minute.')
    return { articles: h, provider: 'Hacker News' }
  }
  const p = run()
    .then((result) => {
      if (result.articles.length) writeCache(cacheKey, result)
      return result
    })
    .finally(() => inflight.delete(cacheKey))
  inflight.set(cacheKey, p)
  return p
}

export const googleNewsUrl = (terms: string[]) =>
  `https://news.google.com/search?q=${encodeURIComponent(terms.join(' '))}`
