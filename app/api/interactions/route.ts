import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    console.log('Interaction API called')
    
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

    console.log('User authenticated:', session.user.id)
    
    // Get the interaction data from the request body
    const body = await request.json()
    const { contactId, summary } = body
    
    console.log('Request payload:', { contactId, summary })

    // Validate required fields
    if (!contactId) {
      console.error('Missing contactId in request')
      return NextResponse.json({ error: 'Missing required field: contactId' }, { status: 400 })
    }

    // Get the contact to update its next reminder date
    console.log('Fetching contact with ID:', contactId)
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .eq('user_id', session.user.id)
      .single()

    if (contactError) {
      console.error('Error fetching contact:', contactError)
      return NextResponse.json({ error: 'Contact not found', details: contactError }, { status: 404 })
    }

    console.log('Contact found:', contact)

    // Calculate the next reminder date based on the contact's frequency
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

    // Format the date for database storage
    const formattedNextReminderDate = nextReminderDate.toISOString().split('T')[0]
    console.log('Next reminder date calculated:', formattedNextReminderDate)

    // Create an interaction record
    console.log('Creating interaction record with data:', {
      user_id: session.user.id,
      contact_id: contactId,
      summary: summary || '',
    })
    
    try {
      // First, let's check if the interactions table exists and check its schema
      const { data: tableCheck, error: tableCheckError } = await supabase
        .from('interactions')
        .select('*')
        .limit(1)
      
      if (tableCheckError) {
        console.error('Error checking interactions table:', tableCheckError)
        
        // If the table doesn't exist, provide a clear error
        if (tableCheckError.message?.includes('relation "interactions" does not exist')) {
          return NextResponse.json({ 
            error: 'Interactions table does not exist',
            details: 'The interactions table has not been created. Please run the SQL migrations.',
            code: 'TABLE_NOT_FOUND'
          }, { status: 500 })
        }
        
        return NextResponse.json({ 
          error: 'Database configuration issue',
          details: tableCheckError,
          message: tableCheckError.message
        }, { status: 500 })
      }
      
      // If we got here, the table exists, proceed with schema check
      console.log('Table exists, checking schema...');
      
      // Check if we can determine available columns
      let availableColumns: string[] = [];
      if (tableCheck && tableCheck.length > 0) {
        availableColumns = Object.keys(tableCheck[0]);
        console.log('Available columns in interactions table:', availableColumns);
      } else {
        // Make an educated guess about available columns
        console.log('No sample data to detect columns, using default column list');
        availableColumns = ['id', 'user_id', 'contact_id', 'notes', 'created_at'];
      }
      
      // Check if 'summary' column exists, or find an appropriate alternative
      let summaryField = 'summary';
      if (!availableColumns.includes('summary')) {
        console.log('Summary column not found, looking for alternatives...');
        
        // Try common alternatives
        const possibleAlternatives = ['notes', 'description', 'content', 'text', 'message'];
        for (const alt of possibleAlternatives) {
          if (availableColumns.includes(alt)) {
            console.log(`Using '${alt}' instead of 'summary'`);
            summaryField = alt;
            break;
          }
        }
      }
      
      // Now we can proceed with insert
      try {
        // Validate data types
        if (typeof session.user.id !== 'string' || !session.user.id) {
          console.error('Invalid user_id:', session.user.id);
          return NextResponse.json({
            error: 'Invalid user_id format',
            details: 'The user ID is not in the expected format'
          }, { status: 400 });
        }
        
        if (typeof contactId !== 'string' || !contactId) {
          console.error('Invalid contact_id:', contactId);
          return NextResponse.json({
            error: 'Invalid contact_id format',
            details: 'The contact ID is not in the expected format'
          }, { status: 400 });
        }
        
        // Create the interaction data object dynamically based on schema
        const interactionData: Record<string, any> = {
          user_id: session.user.id,
          contact_id: contactId,
          created_at: new Date().toISOString()
        };
        
        // Add the summary field using the correct column name
        interactionData[summaryField] = summary || '';
        
        console.log('Final interaction data to insert:', interactionData);
        
        const { data: interaction, error: interactionError } = await supabase
          .from('interactions')
          .insert([interactionData])
          .select()
          .single();

        if (interactionError) {
          console.error('Error creating interaction:', interactionError)
          return NextResponse.json({ 
            error: 'Failed to log interaction', 
            details: interactionError,
            code: interactionError.code,
            hint: interactionError.hint,
            message: interactionError.message
          }, { status: 500 })
        }

        console.log('Interaction created successfully:', interaction)

        // Update the contact's next reminder date
        console.log('Updating contact next_reminder_date')
        const { data: updatedContact, error: updateError } = await supabase
          .from('contacts')
          .update({ next_reminder_date: formattedNextReminderDate })
          .eq('id', contactId)
          .eq('user_id', session.user.id)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating contact:', updateError)
          return NextResponse.json({ 
            error: 'Failed to update contact reminder date',
            details: updateError,
            code: updateError.code,
            hint: updateError.hint,
            message: updateError.message
          }, { status: 500 })
        }

        console.log('Contact updated successfully:', updatedContact)

        return NextResponse.json({
          interaction,
          contact: updatedContact
        })
      } catch (innerError) {
        console.error('Unexpected error during database operations:', innerError)
        return NextResponse.json({ 
          error: 'Database operation failed',
          details: innerError instanceof Error ? innerError.message : String(innerError)
        }, { status: 500 })
      }
    } catch (error) {
      console.error('Error in POST /api/interactions:', error)
      return NextResponse.json(
        { 
          error: 'Internal server error',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in POST /api/interactions:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 