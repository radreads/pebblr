import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    // Create a Supabase client with cookies
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 })
    }

    // Fetch all contacts for the user
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', session.user.id)
      .order('name', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    // Calculate days overdue for UI display purposes (but this won't be used for logic)
    const currentDateTime = new Date()
    const contactsWithOverdue = contacts.map(contact => ({
      ...contact,
      daysOverdue: Math.max(0, Math.floor((currentDateTime.getTime() - new Date(contact.next_reminder_date).getTime()) / (1000 * 60 * 60 * 24)))
    }))

    return NextResponse.json(contactsWithOverdue)
  } catch (error) {
    console.error('Error in GET /api/contacts/all:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 