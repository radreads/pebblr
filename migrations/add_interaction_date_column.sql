-- Add interaction_date column to interactions table if it doesn't exist

-- First, check if the column already exists
DO $$
BEGIN
    -- Check if the column exists in the table
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'interactions'
        AND column_name = 'interaction_date'
    ) THEN
        -- Add the 'interaction_date' column if it doesn't exist
        ALTER TABLE interactions ADD COLUMN interaction_date DATE;
        
        -- Update existing records to set interaction_date = created_at
        UPDATE interactions 
        SET interaction_date = created_at::date 
        WHERE interaction_date IS NULL;
        
        -- Add an index for faster queries
        CREATE INDEX idx_interactions_interaction_date ON interactions(interaction_date);
        
        RAISE NOTICE 'Added interaction_date column to interactions table';
    ELSE
        RAISE NOTICE 'interaction_date column already exists in interactions table';
    END IF;
END $$; 