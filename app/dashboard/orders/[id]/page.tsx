'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Download,
  FileText,
  Package,
} from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { OrderStatusBadge } from '@/components/dashboard/OrderStatusBadge'
import { OrderTimeline } from '@/components/orders/OrderTimeline'
import { OrderActions } from '@/components/orders/OrderActions'
import { Button } from '@/components/ui/Button'
import { getOrder, updateOrder } from '@/lib/firebase/firestore'
import toast from 'react-hot-toast'
import type { Order } from '@/types/marketplace'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function BuyerOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const orderId = params.id as string

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return
      try {
        const data = await getOrder(orderId)
        if (data) {
          setOrder(data as Order)
        }
      } catch (err) {
        console.error('Failed to fetch order:', err)
        toast.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  const handleAcceptDelivery = async () => {
    if (!order) return
    try {
      await updateOrder(order.id, { status: 'completed' })
      setOrder((prev) => (prev ? { ...prev, status: 'completed' } : prev))
      toast.success('Delivery accepted! Order completed.')
    } catch {
      toast.error('Failed to accept delivery')
    }
  }

  const handleRequestRevision = async () => {
    if (!order) return
    try {
      await updateOrder(order.id, {
        status: 'revision_requested',
        revisionCount: order.revisionCount + 1,
      })
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: 'revision_requested' as const,
              revisionCount: prev.revisionCount + 1,
            }
          : prev
      )
      toast.success('Revision requested')
    } catch {
      toast.error('Failed to request revision')
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
        </div>
      </DashboardShell>
    )
  }

  if (!order) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-text-secondary">Order not found.</p>
          <Link href="/dashboard/orders" className="mt-4">
            <Button variant="ghost" size="sm">Back to Orders</Button>
          </Link>
        </div>
      </DashboardShell>
    )
  }

  const createdDate = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  const deadlineDate = order.deliveryDeadline?.toDate
    ? order.deliveryDeadline.toDate().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <DashboardShell>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/dashboard/orders')}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-text-primary">
                Order #{order.id.slice(0, 8)}
              </h2>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              Placed on {createdDate}
            </p>
          </div>
          <OrderActions
            order={order}
            role="buyer"
            onAcceptDelivery={handleAcceptDelivery}
            onRequestRevision={handleRequestRevision}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Gig Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
              Gig Details
            </h3>
            <div className="flex gap-4">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-surface">
                {order.gigCoverImage ? (
                  <Image
                    src={order.gigCoverImage}
                    alt={order.gigTitle}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-5 w-5 text-text-tertiary" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {order.gigTitle}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  by {order.sellerName}
                </p>
                <span className="mt-1 inline-block rounded-full bg-orange-dim px-2.5 py-0.5 text-xs font-medium capitalize text-orange">
                  {order.tier}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Requirements */}
          {order.requirements && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease }}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <h3 className="mb-3 text-sm font-semibold text-text-primary">
                Requirements
              </h3>
              <p className="whitespace-pre-wrap text-sm text-text-secondary">
                {order.requirements}
              </p>
            </motion.div>
          )}

          {/* Deliverables */}
          {order.deliverables && order.deliverables.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease }}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <h3 className="mb-4 text-sm font-semibold text-text-primary">
                Deliverables
              </h3>
              <div className="space-y-2">
                {order.deliverables.map((deliverable, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-text-tertiary" />
                    <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
                      {deliverable.name}
                    </span>
                    <a
                      href={deliverable.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-orange transition-colors hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <OrderTimeline order={order} />

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease }}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-text-secondary">
                  <DollarSign className="h-4 w-4" />
                  Price
                </span>
                <span className="font-medium text-text-primary">
                  ${order.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Service Fee</span>
                <span className="font-medium text-text-primary">
                  ${order.serviceFee.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-text-primary">Total</span>
                  <span className="font-bold text-orange">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delivery Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease }}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
              Delivery
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-text-tertiary" />
                <span className="text-text-secondary">
                  {order.deliveryDays} day{order.deliveryDays !== 1 ? 's' : ''} delivery
                </span>
              </div>
              {deadlineDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-text-tertiary" />
                  <span className="text-text-secondary">
                    Deadline: {deadlineDate}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  )
}
