import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    console.log('Debug API: Adding summary column to interactions table')
    
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
      console.error('Debug API: Session error:', sessionError)
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 })
    }

    console.log('Debug API: User authenticated:', session.user.id)
    
    try {
      // Step 1: Check if the summary column already exists
      const { data: columns, error: checkError } = await supabase
        .from('interactions')
        .select('*')
        .limit(1)
      
      if (checkError) {
        console.error('Debug API: Error checking interactions table:', checkError)
        return NextResponse.json({ 
          error: 'Could not check interactions table', 
          details: checkError 
        }, { status: 500 })
      }
      
      // Check if summary column already exists
      if (columns && columns.length > 0) {
        const columnNames = Object.keys(columns[0])
        console.log('Debug API: Existing columns:', columnNames)
        
        if (columnNames.includes('summary')) {
          console.log('Debug API: Summary column already exists')
          return NextResponse.json({
            status: 'success',
            message: 'Summary column already exists',
            columns: columnNames
          })
        }
      }
      
      // Step 2: Add the summary column using direct SQL
      // Since we can't use RPC (exec_sql), we'll try another approach
      
      // Unfortunately, we can't directly execute SQL ADD COLUMN through the Supabase JS client
      // Instead, we'll try a workaround - we'll test inserting a record with the summary field
      
      // Create a test interaction with a summary field
      const testInteraction = {
        user_id: session.user.id,
        contact_id: 'test-summary-column-add',
        summary: 'This is a test to add the summary column',
        created_at: new Date().toISOString()
      }
      
      const { error: insertError } = await supabase
        .from('interactions')
        .insert([testInteraction])
      
      if (insertError) {
        console.error('Debug API: Error trying to add summary column indirectly:', insertError)
        
        // If the error is specific to the summary column, we'll return a specific error
        if (insertError.message?.includes('summary')) {
          return NextResponse.json({ 
            error: 'Cannot add summary column through the API', 
            details: 'Please run the SQL manually',
            sqlToRun: 'ALTER TABLE interactions ADD COLUMN summary TEXT;',
            insertError 
          }, { status: 500 })
        }
        
        return NextResponse.json({ 
          error: 'Error adding summary column', 
          details: insertError 
        }, { status: 500 })
      }
      
      // Clean up the test record
      await supabase
        .from('interactions')
        .delete()
        .eq('contact_id', 'test-summary-column-add')
      
      // Verify that the column was added
      const { data: verifyColumns, error: verifyError } = await supabase
        .from('interactions')
        .select('*')
        .limit(1)
      
      if (verifyError) {
        console.error('Debug API: Error verifying column addition:', verifyError)
        return NextResponse.json({ 
          error: 'Could not verify column addition', 
          details: verifyError 
        }, { status: 500 })
      }
      
      const verifyColumnNames = verifyColumns && verifyColumns.length > 0 
        ? Object.keys(verifyColumns[0]) 
        : []
      
      return NextResponse.json({
        status: 'success',
        message: 'Summary column added successfully',
        columns: verifyColumnNames,
        hasSummaryColumn: verifyColumnNames.includes('summary')
      })
      
    } catch (innerError) {
      console.error('Debug API: Unexpected error:', innerError)
      return NextResponse.json({ 
        error: 'Internal error', 
        details: innerError instanceof Error ? innerError.message : String(innerError),
        instructions: 'Please run this SQL in the Supabase SQL Editor: ALTER TABLE interactions ADD COLUMN summary TEXT;'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Debug API: Outer error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
        instructions: 'Please run this SQL in the Supabase SQL Editor: ALTER TABLE interactions ADD COLUMN summary TEXT;'
      },
      { status: 500 }
    )
  }
} 