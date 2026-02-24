import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe/server'
import type { PricingTier } from '@/types/marketplace'

interface CheckoutRequestBody {
  gigId: string
  gigTitle: string
  gigCoverImage: string
  sellerId: string
  sellerName: string
  buyerId: string
  buyerName: string
  tier: PricingTier
  price: number
  deliveryDays: number
  maxRevisions: number
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutRequestBody = await req.json()

    const {
      gigId,
      gigTitle,
      gigCoverImage,
      sellerId,
      sellerName,
      buyerId,
      buyerName,
      tier,
      price,
      deliveryDays,
      maxRevisions,
    } = body

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || ''

    const stripe = getStripeServer()
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: gigTitle,
              description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} tier`,
              images: gigCoverImage ? [gigCoverImage] : [],
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/dashboard/orders?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/gig/${gigId}`,
      metadata: {
        gigId,
        gigTitle,
        gigCoverImage,
        sellerId,
        sellerName,
        buyerId,
        buyerName,
        tier,
        price: price.toString(),
        deliveryDays: deliveryDays.toString(),
        maxRevisions: maxRevisions.toString(),
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    )
  }
}
