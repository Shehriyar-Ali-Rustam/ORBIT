'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check, RotateCcw } from 'lucide-react'
import { ModelBadge } from './ModelBadge'
import { CodeBlock } from './CodeBlock'
import type { AIProvider } from '@/lib/ai/router'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  provider?: AIProvider
  isLast?: boolean
  onRegenerate?: () => void
}

export function MessageBubble({
  role,
  content,
  provider,
  isLast,
  onRegenerate,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = role === 'user'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`${isUser ? 'max-w-[80%]' : 'max-w-[85%]'}`}>
        {/* AI label + model badge */}
        {!isUser && (
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-xs text-text-secondary">Orbit AI</span>
            {provider && <ModelBadge provider={provider} />}
          </div>
        )}

        {/* Message content */}
        <div
          className={
            isUser
              ? 'rounded-xl rounded-tr-sm border border-[#FF751F]/20 bg-[#FF751F]/10 px-4 py-3'
              : 'rounded-xl rounded-tl-sm border border-border bg-surface px-4 py-3'
          }
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
              {content}
            </p>
          ) : (
            <div className="ai-markdown text-sm leading-relaxed text-text-primary">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const codeString = String(children).replace(/\n$/, '')
                    // Block code (has language or multi-line)
                    if (match || codeString.includes('\n')) {
                      return (
                        <CodeBlock language={match?.[1]}>
                          {codeString}
                        </CodeBlock>
                      )
                    }
                    // Inline code
                    return (
                      <code
                        className="rounded bg-surface-2 px-1.5 py-0.5 text-[13px] text-[#FF751F]"
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  a({ href, children }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF751F] hover:underline"
                      >
                        {children}
                      </a>
                    )
                  },
                  h1({ children }) {
                    return <h1 className="mb-3 mt-4 text-xl font-bold text-text-primary">{children}</h1>
                  },
                  h2({ children }) {
                    return <h2 className="mb-2 mt-3 text-lg font-semibold text-text-primary">{children}</h2>
                  },
                  h3({ children }) {
                    return <h3 className="mb-2 mt-3 text-base font-semibold text-text-primary">{children}</h3>
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0 text-text-primary">{children}</p>
                  },
                  ul({ children }) {
                    return <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>
                  },
                  li({ children }) {
                    return <li className="text-text-primary">{children}</li>
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="my-2 border-l-2 border-[#FF751F] pl-4 italic text-text-secondary">
                        {children}
                      </blockquote>
                    )
                  },
                  strong({ children }) {
                    return <strong className="font-bold text-text-primary">{children}</strong>
                  },
                  table({ children }) {
                    return (
                      <div className="my-2 overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                          {children}
                        </table>
                      </div>
                    )
                  },
                  th({ children }) {
                    return (
                      <th className="border border-border bg-[#FF751F]/10 px-3 py-2 text-left text-xs font-semibold text-[#FF751F]">
                        {children}
                      </th>
                    )
                  },
                  td({ children }) {
                    return (
                      <td className="border border-border px-3 py-2 text-text-primary">
                        {children}
                      </td>
                    )
                  },
                  hr() {
                    return <hr className="my-4 border-border" />
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Action buttons for AI messages */}
        {!isUser && (
          <div className="mt-1.5 flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-text-tertiary transition-colors hover:text-[#FF751F]"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-text-tertiary transition-colors hover:text-[#FF751F]"
              >
                <RotateCcw className="h-3 w-3" />
                Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
