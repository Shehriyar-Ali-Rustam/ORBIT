import { orbitKnowledge } from './orbit-knowledge'

/**
 * Simple keyword-based RAG search.
 * Returns matching knowledge entries as a single context string.
 */
export function searchKnowledge(query: string): string {
  const q = query.toLowerCase()
  const words = q.split(/\s+/)

  const scored = orbitKnowledge
    .map((entry) => {
      let score = 0
      // Keyword match (high weight)
      for (const kw of entry.keywords) {
        if (q.includes(kw)) score += 3
      }
      // Word overlap with content (lower weight)
      const contentWords = entry.content.toLowerCase().split(/\s+/)
      for (const word of words) {
        if (word.length > 3 && contentWords.includes(word)) score += 1
      }
      return { entry, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  if (scored.length === 0) return ''

  return scored
    .slice(0, 3)
    .map((s) => s.entry.content)
    .join('\n\n')
}
