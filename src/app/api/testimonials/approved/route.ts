import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'

export const revalidate = 60

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('client_testimonials')
      .select('id, name, role, project_type, rating, comment, decided_at')
      .eq('status', 'approved')
      .order('decided_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('[approved testimonials] supabase error:', error)
      return NextResponse.json({ testimonials: [] })
    }

    return NextResponse.json({ testimonials: data || [] })
  } catch (err) {
    console.error('[approved testimonials] error:', err)
    return NextResponse.json({ testimonials: [] })
  }
}
