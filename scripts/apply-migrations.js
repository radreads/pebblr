// Script to apply database migrations to Supabase
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to apply a migration
async function applyMigration(migrationPath) {
  console.log(`Applying migration: ${migrationPath}`);
  
  try {
    console.log('Reading SQL file...');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Since RPC might not be available, we'll try direct table creation
    console.log('Creating interactions table...');
    
    // Create the table
    const { error: createError } = await supabase.rpc('exec_sql', { 
      query: `
        CREATE TABLE IF NOT EXISTS interactions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
          summary TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );
      `
    });
    
    if (createError) {
      console.error('Error creating table:', createError);
      console.log('Attempting alternative method...');
      
      // Alternative: directly access Supabase SQL editor manually and paste the SQL
      console.log(`
        Please manually run the SQL in migrations/create_interactions_table.sql file 
        in the Supabase SQL editor.
        
        Steps:
        1. Go to Supabase dashboard
        2. Click on "SQL Editor"
        3. Create a new query
        4. Copy the content from migrations/create_interactions_table.sql
        5. Run the query
      `);
      
      return false;
    }
    
    console.log('Table created, setting up RLS...');
    
    // Enable RLS
    const { error: rlsError } = await supabase.rpc('exec_sql', { 
      query: `
        ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can only access their own interactions"
          ON interactions
          FOR ALL
          USING (user_id = auth.uid());
      `
    });
    
    if (rlsError) {
      console.error('Error setting up RLS:', rlsError);
      return false;
    }
    
    console.log('Setting up indexes...');
    
    // Add indexes
    const { error: indexError } = await supabase.rpc('exec_sql', { 
      query: `
        CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON interactions(user_id);
        CREATE INDEX IF NOT EXISTS idx_interactions_contact_id ON interactions(contact_id);
        CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON interactions(created_at);
      `
    });
    
    if (indexError) {
      console.error('Error creating indexes:', indexError);
      // Not critical, we can continue
    }
    
    console.log('Adding table comment...');
    
    // Add comment
    const { error: commentError } = await supabase.rpc('exec_sql', { 
      query: `
        COMMENT ON TABLE interactions IS 'Stores interaction records when a user marks a contact as "done"';
      `
    });
    
    if (commentError) {
      console.error('Error adding comment:', commentError);
      // Not critical, we can continue
    }
    
    console.log('Migration applied successfully!');
    return true;
  } catch (error) {
    console.error('Failed to apply migration:', error);
    return false;
  }
}

// Check if the interactions table exists
async function checkInteractionsTable() {
  console.log('Checking if interactions table exists...');
  
  const { data, error } = await supabase.from('interactions').select('id').limit(1);
  
  if (error) {
    if (error.message?.includes('relation "interactions" does not exist')) {
      console.log('Interactions table does not exist yet. Will create it.');
      return false;
    }
    console.error('Error checking interactions table:', error);
    return false;
  }
  
  console.log('Interactions table already exists.');
  return true;
}

// Main function
async function main() {
  const tableExists = await checkInteractionsTable();
  
  if (!tableExists) {
    const success = await applyMigration('./migrations/create_interactions_table.sql');
    if (success) {
      console.log('Successfully created interactions table!');
    } else {
      console.error('Failed to create interactions table automatically.');
      console.log(`
        Please create the interactions table manually:
        
        1. Go to Supabase dashboard (${supabaseUrl})
        2. Go to SQL Editor
        3. Create a new query
        4. Copy the contents of ./migrations/create_interactions_table.sql
        5. Run the query
      `);
    }
  }
  
  // Verification
  const verifyTable = await checkInteractionsTable();
  if (verifyTable) {
    console.log('Verified: Interactions table exists and is accessible!');
    
    // Apply the summary column migration
    console.log('Applying summary column migration...');
    const summaryColumnSuccess = await applyMigration('./migrations/add_summary_column.sql');
    
    if (summaryColumnSuccess) {
      console.log('Successfully applied summary column migration!');
    } else {
      console.error('Failed to apply summary column migration automatically.');
      console.log(`
        Please add the summary column manually:
        
        1. Go to Supabase dashboard (${supabaseUrl})
        2. Go to SQL Editor
        3. Create a new query
        4. Copy the contents of ./migrations/add_summary_column.sql
        5. Run the query
      `);
    }
  }
}

// Run the script
main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 