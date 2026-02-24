'use client'

import { Button } from '@/components/ui/Button'
import { Play, Package, CheckCircle, RotateCcw } from 'lucide-react'
import type { Order } from '@/types/marketplace'

interface OrderActionsProps {
  order: Order
  role: 'buyer' | 'seller'
  onMarkInProgress?: () => void
  onDeliver?: () => void
  onAcceptDelivery?: () => void
  onRequestRevision?: () => void
}

export function OrderActions({
  order,
  role,
  onMarkInProgress,
  onDeliver,
  onAcceptDelivery,
  onRequestRevision,
}: OrderActionsProps) {
  const { status, revisionCount, maxRevisions } = order
  const canRequestRevision = revisionCount < maxRevisions

  return (
    <div className="flex flex-wrap gap-3">
      {/* Seller actions */}
      {role === 'seller' && status === 'active' && onMarkInProgress && (
        <Button variant="primary" size="sm" onClick={onMarkInProgress}>
          <Play className="h-4 w-4" />
          Mark as In Progress
        </Button>
      )}

      {role === 'seller' &&
        (status === 'in_progress' || status === 'revision_requested') &&
        onDeliver && (
          <Button variant="primary" size="sm" onClick={onDeliver}>
            <Package className="h-4 w-4" />
            Deliver
          </Button>
        )}

      {/* Buyer actions */}
      {role === 'buyer' && status === 'delivered' && onAcceptDelivery && (
        <Button variant="primary" size="sm" onClick={onAcceptDelivery}>
          <CheckCircle className="h-4 w-4" />
          Accept Delivery
        </Button>
      )}

      {role === 'buyer' &&
        status === 'delivered' &&
        canRequestRevision &&
        onRequestRevision && (
          <Button variant="ghost" size="sm" onClick={onRequestRevision}>
            <RotateCcw className="h-4 w-4" />
            Request Revision ({revisionCount}/{maxRevisions})
          </Button>
        )}
    </div>
  )
}
