import { PROBLEMS, type Problem } from '../data/problems'
import type { NewsArticle, Paper } from './research'

const STOPWORDS = new Set(
  `a an the and or but if then so of to in on at for from by with without into onto about over under
  is are was were be been being am do does did done have has had having can could should would will shall may might must
  i me my we our us you your they them their he she it its this that these those there here who whom which what when where why how
  not no yes very more most less least much many some any all each every few other such own same just only also too than
  app apps application platform website site tool tools system solution product service build building make making create creating
  idea ideas project hackathon help helps helping use uses using user users people person someone want wants need needs
  easy easier simple better best new way ways get gets getting allow allows let lets lot lots thing things like via based
  web mobile online digital smart ai ml machine learning powered driven model chatbot gpt llm
  before after during while until since again still even ever never always often sometimes usually really actually
  remind reminds reminder track tracks tracking find finds finding show shows showing give gives giving send sends
  connect connects connecting match matches matching manage manages managing keep keeps go goes going take takes
  know knows see sees look looks feel feels try tries start starts stop stops turn turns put puts set sets
  fewer less lower higher faster quickly automatically instantly personalized real-time realtime time times day days
  one two three first last next every their them through across within around tell tells telling
  everything anything something stuff fun cool awesome amazing productive productivity uber airbnb tinder marketplace`.split(/\s+/),
)

/** Words that show up in real problem statements — used to rank the user's keywords. */
const PROBLEM_VOCAB = new Set(
  PROBLEMS.flatMap((p) => p.keywords.flatMap((k) => k.split(/\s+/)))
    .concat('hungry hunger poverty cost costs access shortage risk lack waste injury death disease students patients workers'.split(' '))
    .map((w) => stem(w.toLowerCase())),
)

function stem(word: string): string {
  return word.replace(/(ies)$/, 'y').replace(/(ing|ers|er|es|s)$/, '')
}

/** Content words from free text, most informative first (longer + earlier ≈ more specific). */
export function extractKeywords(text: string, max = 7): string[] {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // hyphens too: 'ai-powered' → 'ai', 'powered'
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w))
  const seen = new Set<string>()
  const unique: Array<{ word: string; score: number; pos: number }> = []
  tokens.forEach((t, pos) => {
    const s = stem(t)
    if (seen.has(s)) return
    seen.add(s)
    let score = 0
    if (PROBLEM_VOCAB.has(s)) score += 3
    if (t.length >= 7) score += 1
    unique.push({ word: t, score, pos })
  })
  return unique
    .sort((a, b) => b.score - a.score || a.pos - b.pos)
    .slice(0, max)
    .map((u) => u.word)
}

function containsTerm(haystack: string, term: string): boolean {
  const s = stem(term.toLowerCase())
  if (s.length < 3) return false
  return haystack.includes(s)
}

export interface LibraryMatch {
  problem: Problem
  score: number
}

/** Rank curated problems by overlap with the user's idea. */
export function matchLibrary(idea: string, limit = 3): LibraryMatch[] {
  const text = idea.toLowerCase()
  const ideaKeywords = extractKeywords(idea, 15)
  return PROBLEMS.map((problem) => {
    let score = 0
    for (const kw of problem.keywords) {
      if (containsTerm(text, kw)) score += kw.includes(' ') ? 3 : 2
    }
    const body = `${problem.title} ${problem.oneLiner} ${problem.summary}`.toLowerCase()
    for (const kw of ideaKeywords) if (containsTerm(body, kw)) score += 1
    return { problem, score }
  })
    .filter((m) => m.score >= 3)
    .sort((a, b) => b.score - a.score)
    .filter((m, _i, arr) => m.score >= arr[0].score * 0.6)
    .slice(0, limit)
}

/** How many of the idea's keywords a paper actually mentions. */
export function paperRelevance(paper: Paper, keywords: string[]): number {
  const body = `${paper.title} ${paper.summary}`.toLowerCase()
  return keywords.filter((k) => containsTerm(body, k)).length
}

/** Minimum keyword hits for a paper or headline to count as evidence (stricter for detailed ideas). */
export const minMatchesFor = (keywords: string[]) => (keywords.length >= 5 ? 3 : Math.min(2, keywords.length))

export function newsIsRelevant(article: NewsArticle, keywords: string[]): boolean {
  const title = article.title.toLowerCase()
  return keywords.filter((k) => containsTerm(title, k)).length >= minMatchesFor(keywords)
}

/**
 * Too little to search on: under 3 specific words, or only a few words and none of them
 * sound like a real-world problem (e.g. "a chatbot for everything", "make studying fun").
 */
export function isTooVague(keywords: string[]): boolean {
  if (keywords.length < 3) return true
  const anyProblemWord = keywords.some((k) => PROBLEM_VOCAB.has(stem(k)))
  return !anyProblemWord && keywords.length < 4
}

const PROBLEM_SIGNAL =
  /barrier|lack|risk|burden|shortage|insecur|prevalen|challeng|difficult|harm|cost|unmet|gap|disparit|struggl|inequit|declin|loss|stress|burnout|inadequa|unable|deficien|vulnerab|problem|obstacle|hardship|exclu/

/** Does the paper describe something going wrong for people, rather than just studying a topic? */
export function hasProblemSignal(paper: Paper): boolean {
  return PROBLEM_SIGNAL.test(`${paper.title} ${paper.summary}`.toLowerCase())
}

export type Verdict = 'strong' | 'some' | 'none'

export function verdictFor(relevantPapers: number, problemPapers: number, newsCount: number, libraryMatches: number): Verdict {
  if (problemPapers >= 3 || (problemPapers >= 2 && libraryMatches > 0)) return 'strong'
  if (relevantPapers >= 1 || libraryMatches > 0 || newsCount >= 2) return 'some'
  return 'none'
}
