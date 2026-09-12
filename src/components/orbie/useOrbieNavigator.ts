'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ORBIE_ENTRY,
  ORBIE_GRAPH,
  ORBIE_ORDER,
  nodeIndex,
  type NodeId,
  type StoryNode,
} from '@/data/orbie-graph'
import { useTimelineClock, type StoryClock } from '@/components/story/useStoryClock'

export type OrbieMode = 'tour' | 'chat'

export interface OrbieNavigator {
  node: StoryNode
  clock: StoryClock
  mode: OrbieMode
  /** True the second time a visitor reaches a node — drives `repeat` narration. */
  isRepeat: boolean
  /** Position within the current chapter, for the progress bar. */
  chapterIndex: number
  chapterLength: number
  canGoBack: boolean
  go(to: NodeId): void
  back(): void
  restart(): void
  openChat(): void
  closeChat(): void
}

/**
 * The graph, sitting above the clock.
 *
 * The clock still thinks in array indices and knows nothing about edges — the
 * navigator resolves a node id to an index and calls `seekScene`. Keeping the
 * split means Story Mode and Orbie run the same timing code, and the clock
 * never grew a concept it only needed for one of them.
 *
 * Browser Back is handled here rather than left to the platform. Without it,
 * a phone's back gesture mid-tour exits the site entirely — which is both the
 * most likely real-world complaint and about four lines to prevent.
 */
export function useOrbieNavigator(): OrbieNavigator {
  const [nodeId, setNodeId] = useState<NodeId>(ORBIE_ENTRY)
  const [mode, setMode] = useState<OrbieMode>('tour')
  const [history, setHistory] = useState<NodeId[]>([])
  /** Every node visited this session, so a return reads its `repeat` copy. */
  const visited = useRef<Set<NodeId>>(new Set())
  const [isRepeat, setIsRepeat] = useState(false)

  const nodeIdRef = useRef<NodeId>(ORBIE_ENTRY)
  nodeIdRef.current = nodeId

  const node = ORBIE_GRAPH[nodeId]

  /**
   * There is a genuine cycle here: the clock needs `onNodeEnd` to be
   * constructed, `onNodeEnd` needs to navigate, and navigating needs the
   * clock. It is broken with a ref rather than by relying on `navigate` being
   * assigned by the time the closure runs — that happens to work, and is the
   * kind of ordering dependency that breaks silently when someone moves a
   * line.
   */
  const navigateRef = useRef<(to: NodeId, opts?: { push?: boolean }) => void>(() => {})

  /**
   * Routing, handed to the clock.
   *
   * Supplying this takes over the clock's own advance entirely, including at
   * the end of the array — in a graph the last index means nothing, and a node
   * with no `next` is a bug the dev assertions catch rather than a finish line.
   */
  const onNodeEnd = useCallback((index: number) => {
    const finished = ORBIE_ORDER[index]
    const target = ORBIE_GRAPH[finished]?.next
    // No `next` on an auto node is a graph error, already warned about at
    // import time. Stopping here beats guessing a destination.
    if (target) navigateRef.current(target, { push: true })
  }, [])

  const clock = useTimelineClock(
    // `ORBIE_ORDER` is a module constant, so this maps once rather than
    // building a new array on every render and retriggering the clock's loop.
    useMemo(() => ORBIE_ORDER.map((id) => ORBIE_GRAPH[id]), []),
    { onNodeEnd }
  )

  const clockRef = useRef(clock)
  clockRef.current = clock

  /** The one place the node changes. Everything else routes through it. */
  const navigate = useCallback((to: NodeId, opts: { push?: boolean } = {}) => {
    const from = nodeIdRef.current
    if (to === from) return

    setIsRepeat(visited.current.has(to))
    visited.current.add(to)

    if (opts.push) setHistory((h) => [...h, from])
    setNodeId(to)
    clockRef.current.seekScene(nodeIndex(to))
  }, [])

  navigateRef.current = navigate

  const go = useCallback(
    (to: NodeId) => {
      navigate(to, { push: true })
      // A real history entry, so the phone's back gesture walks the tour
      // instead of leaving the site.
      if (typeof window !== 'undefined') {
        window.history.pushState({ orbie: to }, '', window.location.href)
      }
    },
    [navigate]
  )

  const back = useCallback(() => {
    setHistory((h) => {
      if (!h.length) return h
      const prev = h[h.length - 1]
      navigate(prev)
      return h.slice(0, -1)
    })
  }, [navigate])

  const restart = useCallback(() => {
    visited.current.clear()
    setIsRepeat(false)
    setHistory([])
    setMode('tour')
    setNodeId(ORBIE_ENTRY)
    clockRef.current.seekScene(nodeIndex(ORBIE_ENTRY))
  }, [])

  // Chat overlays the current node rather than being one. Leaving it puts the
  // visitor back exactly where they were, mid-tour.
  const openChat = useCallback(() => {
    clockRef.current.pause()
    setMode('chat')
  }, [])

  const closeChat = useCallback(() => {
    setMode('tour')
    clockRef.current.play()
  }, [])

  // Mark the entry node visited on mount, so a restart is what resets repeat
  // state rather than the first arrival accidentally counting as a return.
  useEffect(() => {
    visited.current.add(ORBIE_ENTRY)
  }, [])

  useEffect(() => {
    const onPop = () => {
      if (mode === 'chat') {
        setMode('tour')
        return
      }
      back()
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [back, mode])

  // The progress bar can't show position in a graph the way it does in a line,
  // so it shows position within the current chapter instead.
  const { chapterIndex, chapterLength } = useMemo(() => {
    const siblings = ORBIE_ORDER.filter((id) => ORBIE_GRAPH[id].chapter === node.chapter)
    return {
      chapterIndex: Math.max(0, siblings.indexOf(nodeId)),
      chapterLength: siblings.length,
    }
  }, [node.chapter, nodeId])

  return {
    node,
    clock,
    mode,
    isRepeat,
    chapterIndex,
    chapterLength,
    canGoBack: history.length > 0,
    go,
    back,
    restart,
    openChat,
    closeChat,
  }
}
