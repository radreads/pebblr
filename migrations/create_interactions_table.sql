-- Create interactions table to track contact touchpoints

-- Create table
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up permissions using Row Level Security
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own interactions
CREATE POLICY "Users can only access their own interactions"
  ON interactions
  FOR ALL
  USING (user_id = auth.uid());

-- Create index for faster queries
CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_contact_id ON interactions(contact_id);
CREATE INDEX idx_interactions_created_at ON interactions(created_at);

-- Add comment for documentation
COMMENT ON TABLE interactions IS 'Stores interaction records when a user marks a contact as "done"'; 