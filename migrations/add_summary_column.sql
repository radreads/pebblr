-- Add summary column to interactions table if it doesn't exist

-- First, check if the column already exists
DO $$
BEGIN
    -- Check if the column exists in the table
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'interactions'
        AND column_name = 'summary'
    ) THEN
        -- Add the 'summary' column if it doesn't exist
        ALTER TABLE interactions ADD COLUMN summary TEXT;
        RAISE NOTICE 'Added summary column to interactions table';
    ELSE
        RAISE NOTICE 'summary column already exists in interactions table';
    END IF;
END $$; 