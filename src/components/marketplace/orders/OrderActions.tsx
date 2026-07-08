'use client'

import { useState } from 'react'
import { CheckCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { updateOrderStatus } from '@/lib/marketplace/mutations'
import type { Order } from '@/types/marketplace'

interface OrderActionsProps {
  order: Order
  onUpdate: (order: Order) => void
}

export function OrderActions({ order, onUpdate }: OrderActionsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [revisionNote, setRevisionNote] = useState('')
  const [showRevisionForm, setShowRevisionForm] = useState(false)

  async function handleAction(action: 'complete' | 'revision') {
    setLoading(action)
    try {
      const status = action === 'complete' ? 'completed' as const : 'revision_requested' as const
      await updateOrderStatus(order.id, status)
      onUpdate({
        ...order,
        status,
        ...(action === 'complete' ? { completed_at: new Date().toISOString() } : {}),
        ...(action === 'revision' ? { revision_count: order.revision_count + 1 } : {}),
      })
      setShowRevisionForm(false)
    } catch (err) {
      console.error('Action failed:', err)
    }
    setLoading(null)
  }

  if (order.status !== 'delivered') return null

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">
        The seller has delivered the work. Please review and take action.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          size="sm"
          loading={loading === 'complete'}
          onClick={() => handleAction('complete')}
        >
          <CheckCircle className="mr-1.5 h-4 w-4" /> Accept & Complete
        </Button>

        {order.revision_count < order.max_revisions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRevisionForm(!showRevisionForm)}
          >
            <RotateCcw className="mr-1.5 h-4 w-4" /> Request Revision
          </Button>
        )}
      </div>

      {showRevisionForm && (
        <div className="space-y-2 rounded-lg border border-border bg-background p-3">
          <textarea
            value={revisionNote}
            onChange={(e) => setRevisionNote(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:border-orange focus:outline-none"
            placeholder="Describe what needs to be revised..."
          />
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              loading={loading === 'revision'}
              onClick={() => handleAction('revision')}
            >
              Submit Revision Request
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowRevisionForm(false)}>
              Cancel
            </Button>
          </div>
          <p className="text-xs text-text-tertiary">
            Revisions used: {order.revision_count}/{order.max_revisions}
          </p>
        </div>
      )}
    </div>
  )
}
