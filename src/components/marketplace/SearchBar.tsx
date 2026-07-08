'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { POPULAR_SEARCHES } from '@/lib/marketplace/constants'

interface SearchBarProps {
  defaultQuery?: string
  showPopular?: boolean
  className?: string
}

export function SearchBar({ defaultQuery = '', showPopular = false, className }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultQuery)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/freelancers/search?q=${encodeURIComponent(query.trim())}`)
      setFocused(false)
    }
  }

  function handleSuggestionClick(term: string) {
    setQuery(term)
    router.push(`/freelancers/search?q=${encodeURIComponent(term)}`)
    setFocused(false)
  }

  return (
    <div ref={containerRef} className={className}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center overflow-hidden rounded-full border border-border bg-background shadow-sm transition-all focus-within:border-orange focus-within:ring-2 focus-within:ring-orange/20">
          <div className="flex items-center pl-5">
            <Search className="h-5 w-5 text-text-tertiary" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search for any service..."
            className="flex-1 bg-transparent px-4 py-3.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mr-1 rounded-full p-1.5 text-text-tertiary transition-colors hover:bg-orange-dim hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="mr-1.5 rounded-full bg-orange px-6 py-2 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-orange-hover"
          >
            Search
          </button>
        </div>
      </form>

      {/* Popular searches */}
      {showPopular && (
        <AnimatePresence>
          {focused && !query && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-3 flex flex-wrap items-center justify-center gap-2"
            >
              <span className="text-xs text-text-tertiary">Popular:</span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSuggestionClick(term)}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary transition-colors hover:border-orange hover:text-text-primary"
                >
                  {term}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
