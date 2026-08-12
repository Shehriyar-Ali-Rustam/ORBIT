'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Copies `value`, returning whether it actually landed.
 *
 * The async Clipboard API is the right tool but it is not always available:
 * it needs a secure context, and it can be refused outright with
 * NotAllowedError under a restrictive permissions policy or an unfocused
 * document. The deprecated execCommand path still works in most of those
 * cases, so it runs as a fallback rather than being written off as legacy.
 */
async function writeClipboard(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    // fall through to the legacy path
  }

  try {
    const ta = document.createElement('textarea')
    ta.value = value
    ta.setAttribute('readonly', '')
    // Off-screen but still selectable. `position: fixed` avoids scrolling the page.
    ta.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    ta.setSelectionRange(0, value.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

/**
 * `tel:` and `mailto:` are dead ends on a desktop with no phone or mail client
 * registered — the click fires and nothing visible happens, which reads as a
 * broken button. This copies the underlying value as well, so the action
 * always does something the visitor can see.
 *
 * The anchor keeps its href, so mobile still hands off to the dialler or mail
 * app, and long-press / right-click / open-in-new-tab all behave normally.
 */
export function useCopyAction(resetAfter = 2000) {
  const [copied, setCopied] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(
    async (key: string, value: string) => {
      const ok = await writeClipboard(value)
      // Only claim success when the value actually reached the clipboard.
      if (!ok) return
      setCopied(key)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(null), resetAfter)
    },
    [resetAfter]
  )

  return { copied, copy }
}
