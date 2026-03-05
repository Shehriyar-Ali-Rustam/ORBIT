import { orbitKnowledge } from './orbit-knowledge'

/**
 * Synonym map — maps common user words to canonical keywords
 * that appear in the knowledge base.
 */
const SYNONYMS: Record<string, string[]> = {
  price: ['cost', 'rate', 'charge', 'budget', 'pricing', 'fee', 'money', 'how much', 'affordable', 'expensive', 'cheap', 'dollar', 'usd', 'payment', 'pay'],
  cost: ['price', 'rate', 'charge', 'budget', 'pricing', 'fee', 'money', 'how much'],
  website: ['site', 'web', 'webpage', 'landing page', 'web app'],
  chatbot: ['bot', 'chat bot', 'ai assistant', 'virtual assistant', 'chat agent'],
  mobile: ['app', 'ios', 'android', 'phone app', 'mobile app'],
  design: ['logo', 'brand', 'branding', 'graphic', 'creative', 'visual'],
  hire: ['outsource', 'contract', 'find developer', 'need developer', 'looking for', 'work with'],
  contact: ['reach', 'email', 'talk', 'call', 'get in touch', 'message', 'connect'],
  portfolio: ['projects', 'work', 'examples', 'case study', 'previous work', 'show me', 'built'],
  team: ['who', 'people', 'staff', 'employees', 'members'],
  founder: ['shehriyar', 'ceo', 'owner', 'who started', 'who created', 'who built'],
  support: ['help', 'maintenance', 'bug fix', 'after launch', 'warranty'],
  process: ['how it works', 'steps', 'methodology', 'workflow', 'how do you'],
  timeline: ['how long', 'duration', 'time', 'delivery', 'turnaround', 'when', 'deadline', 'fast', 'quickly'],
  freelancer: ['freelance', 'marketplace', 'gig', 'orbiter', 'seller'],
  ai: ['artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural'],
}

/**
 * Build a reverse synonym lookup for O(1) expansion.
 */
const REVERSE_SYNONYMS = new Map<string, string[]>()
for (const [canonical, synonyms] of Object.entries(SYNONYMS)) {
  for (const syn of synonyms) {
    const existing = REVERSE_SYNONYMS.get(syn) || []
    existing.push(canonical)
    REVERSE_SYNONYMS.set(syn, existing)
  }
  const existing = REVERSE_SYNONYMS.get(canonical) || []
  REVERSE_SYNONYMS.set(canonical, existing)
}

/**
 * Expand a query with synonyms to improve recall.
 */
function expandQuery(query: string): string[] {
  const words = query.toLowerCase().split(/\s+/)
  const expanded = new Set(words)

  for (const word of words) {
    const synonyms = REVERSE_SYNONYMS.get(word)
    if (synonyms) {
      for (const s of synonyms) expanded.add(s)
    }
  }

  // Check bigrams (two-word phrases like "how much", "how long")
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`
    const synonyms = REVERSE_SYNONYMS.get(bigram)
    if (synonyms) {
      for (const s of synonyms) expanded.add(s)
    }
  }

  return Array.from(expanded)
}

/**
 * Detect intent and boost matching categories.
 */
function detectCategoryBoosts(query: string): string[] {
  const q = query.toLowerCase()
  const boosted: string[] = []

  if (/price|cost|how much|budget|rate|charge|fee|afford/.test(q)) {
    boosted.push('pricing', 'services')
  }
  if (/service|offer|provide|do you|can you build/.test(q)) {
    boosted.push('services')
  }
  if (/contact|email|reach|talk|call|get in touch/.test(q)) {
    boosted.push('contact')
  }
  if (/portfolio|project|work|example|built|show|case study/.test(q)) {
    boosted.push('portfolio')
  }
  if (/about|who|story|mission|vision|team|founder/.test(q)) {
    boosted.push('about', 'team')
  }
  if (/process|how.*work|steps|method|timeline|how long/.test(q)) {
    boosted.push('process')
  }
  if (/support|maintenance|bug|after launch|help|warranty/.test(q)) {
    boosted.push('support', 'faq')
  }

  return boosted
}

/**
 * Enhanced RAG search with synonym expansion, category boosting, and fuzzy matching.
 * Returns matching knowledge entries as a single context string.
 */
export function searchKnowledge(query: string): string {
  const q = query.toLowerCase()
  const expandedTerms = expandQuery(q)
  const categoryBoosts = detectCategoryBoosts(q)

  const scored = orbitKnowledge
    .map((entry) => {
      let score = 0

      // Exact keyword match (highest weight)
      for (const kw of entry.keywords) {
        if (q.includes(kw)) score += 5
      }

      // Expanded synonym match (high weight)
      for (const kw of entry.keywords) {
        if (expandedTerms.includes(kw)) score += 3
      }

      // Category boost (medium weight)
      if (categoryBoosts.includes(entry.category)) {
        score += 4
      }

      // Word overlap with content (lower weight, fuzzy)
      const contentLower = entry.content.toLowerCase()
      for (const term of expandedTerms) {
        if (term.length > 3 && contentLower.includes(term)) score += 1
      }

      return { entry, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  if (scored.length === 0) return ''

  return scored
    .slice(0, 4)
    .map((s) => s.entry.content)
    .join('\n\n')
}
