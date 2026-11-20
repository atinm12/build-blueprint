export type IndustryId =
  | 'healthcare'
  | 'education'
  | 'climate'
  | 'finance'
  | 'food'
  | 'mental-health'
  | 'accessibility'
  | 'cities'

export type TrackId =
  | 'ai'
  | 'sustainability'
  | 'fintech'
  | 'health'
  | 'edtech'
  | 'social-impact'
  | 'accessibility'
  | 'hardware'

export interface Industry {
  id: IndustryId
  name: string
  blurb: string
}

export interface Track {
  id: TrackId
  name: string
}

export const INDUSTRIES: Industry[] = [
  { id: 'healthcare', name: 'Healthcare', blurb: 'Care access, diagnosis, clinicians, patients' },
  { id: 'education', name: 'Education', blurb: 'K-12, college, literacy, learning gaps' },
  { id: 'climate', name: 'Climate & Energy', blurb: 'Emissions, heat, waste, energy use' },
  { id: 'finance', name: 'Personal Finance', blurb: 'Savings, banking access, fraud, debt' },
  { id: 'food', name: 'Food & Agriculture', blurb: 'Hunger, food waste, farming, water' },
  { id: 'mental-health', name: 'Mental Health', blurb: 'Youth wellbeing, loneliness, access to care' },
  { id: 'accessibility', name: 'Accessibility', blurb: 'Disability, assistive tech, inclusive design' },
  { id: 'cities', name: 'Housing & Cities', blurb: 'Housing costs, transit safety, air quality' },
]

export const TRACKS: Track[] = [
  { id: 'ai', name: 'AI / ML' },
  { id: 'sustainability', name: 'Sustainability' },
  { id: 'fintech', name: 'Fintech' },
  { id: 'health', name: 'Health Tech' },
  { id: 'edtech', name: 'EdTech' },
  { id: 'social-impact', name: 'Social Impact' },
  { id: 'accessibility', name: 'Accessibility' },
  { id: 'hardware', name: 'Hardware / IoT' },
]

export const industryById = (id: string) => INDUSTRIES.find((i) => i.id === id)
export const trackById = (id: string) => TRACKS.find((t) => t.id === id)
