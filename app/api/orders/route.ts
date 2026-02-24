import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getUserOrders } from '@/lib/firebase/firestore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const role = searchParams.get('role') as 'buyer' | 'seller' | null

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Missing required query params: userId and role' },
        { status: 400 },
      )
    }

    if (role !== 'buyer' && role !== 'seller') {
      return NextResponse.json(
        { error: 'Role must be "buyer" or "seller"' },
        { status: 400 },
      )
    }

    const orders = await getUserOrders(userId, role)
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('[ORDERS_GET_ERROR]', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const orderId = await createOrder(body)
    return NextResponse.json({ id: orderId }, { status: 201 })
  } catch (error) {
    console.error('[ORDERS_POST_ERROR]', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
