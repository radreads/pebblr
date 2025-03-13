import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
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
      console.error('Session error:', sessionError)
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 })
    }

    // Get the contact data from the request body
    const contact = await request.json()

    // Ensure we have a user ID
    if (!session.user?.id) {
      console.error('No user ID in session')
      return NextResponse.json({ error: 'Invalid session - missing user ID' }, { status: 400 })
    }

    // Calculate the next reminder date based on frequency
    const nextReminderDate = new Date()
    switch (contact.frequency) {
      case 'weekly':
        nextReminderDate.setDate(nextReminderDate.getDate() + 7)
        break
      case 'monthly':
        nextReminderDate.setMonth(nextReminderDate.getMonth() + 1)
        break
      case 'quarterly':
        nextReminderDate.setMonth(nextReminderDate.getMonth() + 3)
        break
      case 'semi-annual':
        nextReminderDate.setMonth(nextReminderDate.getMonth() + 6)
        break
      case 'annual':
        nextReminderDate.setFullYear(nextReminderDate.getFullYear() + 1)
        break
      default:
        nextReminderDate.setMonth(nextReminderDate.getMonth() + 1) // Default to monthly
    }

    // Insert the new contact into Supabase
    const contactData = {
      user_id: session.user.id,
      name: contact.name,
      frequency: contact.frequency,
      birthday: contact.birthday,
      notes: contact.notes,
      next_reminder_date: nextReminderDate.toISOString().split('T')[0],
    }

    console.log('Inserting contact with data:', contactData)

    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single()

    if (error) {
      console.error('Error inserting contact:', error)
      return NextResponse.json({ 
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in POST /api/contacts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    // Get the current date from query params
    const { searchParams } = new URL(request.url)
    const currentDate = searchParams.get('currentDate') || new Date().toISOString()

    // Fetch contacts for the user where next_reminder_date is less than or equal to the current date
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', session.user.id)
      .lte('next_reminder_date', currentDate)
      .order('next_reminder_date', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Calculate days overdue for each contact
    const currentDateTime = new Date(currentDate)
    const contactsWithOverdue = contacts.map(contact => ({
      ...contact,
      daysOverdue: Math.floor((currentDateTime.getTime() - new Date(contact.next_reminder_date).getTime()) / (1000 * 60 * 60 * 24))
    }))

    return NextResponse.json(contactsWithOverdue)
  } catch (error) {
    console.error('Error in GET /api/contacts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 