import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe/server'
import { createOrder } from '@/lib/firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import type Stripe from 'stripe'
import type { PricingTier } from '@/types/marketplace'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing stripe-signature header or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const stripe = getStripeServer()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('[STRIPE_WEBHOOK_SIGNATURE_ERROR]', error)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const metadata = session.metadata!

      const price = parseFloat(metadata.price)
      const serviceFee = Math.round(price * 0.1 * 100) / 100
      const totalAmount = Math.round((price + serviceFee) * 100) / 100
      const deliveryDays = parseInt(metadata.deliveryDays, 10)

      const deliveryDeadline = new Date()
      deliveryDeadline.setDate(deliveryDeadline.getDate() + deliveryDays)

      await createOrder({
        gigId: metadata.gigId,
        gigTitle: metadata.gigTitle,
        gigCoverImage: metadata.gigCoverImage,
        sellerId: metadata.sellerId,
        sellerName: metadata.sellerName,
        buyerId: metadata.buyerId,
        buyerName: metadata.buyerName,
        tier: metadata.tier as PricingTier,
        price,
        serviceFee,
        totalAmount,
        deliveryDays,
        deliveryDeadline: Timestamp.fromDate(deliveryDeadline),
        status: 'active',
        requirements: '',
        deliverables: [],
        revisionCount: 0,
        maxRevisions: parseInt(metadata.maxRevisions, 10),
        stripeSessionId: session.id,
        stripePaymentIntentId: (session.payment_intent as string) || '',
      })
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[STRIPE_WEBHOOK_HANDLER_ERROR]', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
