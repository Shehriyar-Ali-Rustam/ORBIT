import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createOrder } from '@/lib/marketplace/mutations'
import type { OrderStatus, PricingTier } from '@/types/marketplace'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-01-28.clover' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata!

    const deliveryDeadline = new Date()
    deliveryDeadline.setDate(deliveryDeadline.getDate() + Number(meta.delivery_days))

    await createOrder({
      gig_id: meta.gig_id,
      gig_title: meta.gig_title,
      gig_cover_image: meta.gig_cover_image || null,
      seller_id: meta.seller_id,
      buyer_id: meta.buyer_id,
      tier: meta.tier as PricingTier,
      price: Number(meta.price),
      service_fee: Number(meta.service_fee),
      total_amount: Number(meta.total_amount),
      delivery_days: Number(meta.delivery_days),
      delivery_deadline: deliveryDeadline.toISOString(),
      status: 'active' as OrderStatus,
      requirements: null,
      deliverables: [],
      revision_count: 0,
      max_revisions: Number(meta.max_revisions),
      stripe_session_id: session.id,
      stripe_payment_intent_id: (session.payment_intent as string) || null,
      completed_at: null,
    })
  }

  return NextResponse.json({ received: true })
}
