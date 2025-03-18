import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    console.log('Debug API: Checking interactions table')
    
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
    
    // Step 1: Check if table exists
    console.log('Debug API: Checking if interactions table exists')
    
    try {
      const { data: tableData, error: tableError } = await supabase
        .from('interactions')
        .select('id')
        .limit(1)
      
      if (tableError) {
        console.error('Debug API: Error checking table:', tableError)
        return NextResponse.json({ 
          error: 'Table check failed', 
          details: tableError,
          message: tableError.message
        }, { status: 500 })
      }
      
      console.log('Debug API: Table exists and is accessible')
      
      // Step 2: Try to fetch schema
      console.log('Debug API: Fetching table schema')
      const { data: schemaData, error: schemaError } = await supabase.rpc('exec_sql', { 
        query: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'interactions';"
      })
      
      if (schemaError) {
        console.log('Debug API: Could not fetch schema using RPC:', schemaError)
        // Alternative way to check columns
        try {
          // Try a different approach to get column info
          const { data: columns, error: columnError } = await supabase
            .from('interactions')
            .select('*')
            .limit(1)
            
          console.log('Debug API: Retrieved columns from sample data:', columns ? Object.keys(columns[0] || {}) : 'No columns found')
          
          if (columnError) {
            console.error('Debug API: Error getting columns from sample:', columnError)
          }
        } catch (columnCheckError) {
          console.error('Debug API: Error checking columns:', columnCheckError)
        }
      } else {
        console.log('Debug API: Schema found:', schemaData)
      }
      
      // Step 3: Try a test insert with minimal data
      console.log('Debug API: Attempting test insert')
      
      const testData = {
        user_id: session.user.id,
        contact_id: 'test-debug-id',
        summary: 'Test from debug API',
        created_at: new Date().toISOString()
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('interactions')
        .insert([testData])
        .select()
      
      if (insertError) {
        console.error('Debug API: Insert error:', insertError)
        return NextResponse.json({ 
          error: 'Insert test failed', 
          details: insertError,
          message: insertError.message,
          code: insertError.code
        }, { status: 500 })
      }
      
      console.log('Debug API: Test insert successful', insertData)
      
      // Clean up test data
      if (insertData && insertData.length > 0) {
        const { error: deleteError } = await supabase
          .from('interactions')
          .delete()
          .eq('id', insertData[0].id)
        
        if (deleteError) {
          console.error('Debug API: Error deleting test data:', deleteError)
        } else {
          console.log('Debug API: Test data cleaned up')
        }
      }
      
      return NextResponse.json({
        status: 'success',
        message: 'Interactions table is accessible and working correctly',
        tableExists: true,
        testInsertSuccess: true
      })
    } catch (innerError) {
      console.error('Debug API: Unexpected error:', innerError)
      return NextResponse.json({ 
        error: 'Internal error', 
        details: innerError instanceof Error ? innerError.message : String(innerError)
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Debug API: Outer error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 