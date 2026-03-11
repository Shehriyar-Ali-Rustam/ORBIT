import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { requireMarketplaceUser } from '@/lib/marketplace/auth'
import { getGigById } from '@/lib/marketplace/queries'
import { SERVICE_FEE_RATE } from '@/lib/marketplace/constants'
import type { PricingTier } from '@/types/marketplace'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-01-28.clover' })

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireMarketplaceUser()
    const { gig_id, tier } = await req.json() as { gig_id: string; tier: PricingTier }

    const gig = await getGigById(gig_id)
    if (!gig) return NextResponse.json({ error: 'Gig not found' }, { status: 404 })

    // H1: Prevent sellers from purchasing their own gigs
    if (gig.seller_id === userId) {
      return NextResponse.json({ error: 'You cannot purchase your own gig' }, { status: 400 })
    }

    const pricing = gig.pricing[tier]
    if (!pricing) return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })

    const serviceFee = Math.round(pricing.price * SERVICE_FEE_RATE * 100) / 100
    const total = pricing.price + serviceFee

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: gig.title,
              description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Package`,
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        gig_id: gig.id,
        gig_title: gig.title,
        gig_cover_image: gig.cover_image || '',
        seller_id: gig.seller_id,
        buyer_id: userId,
        tier,
        price: pricing.price.toString(),
        service_fee: serviceFee.toString(),
        total_amount: total.toString(),
        delivery_days: pricing.delivery_days.toString(),
        max_revisions: pricing.revisions.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/freelancers/dashboard/buyer/orders?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/freelancers/gig/${gig.slug}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}
