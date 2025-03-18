-- Drop existing RLS policy
DROP POLICY IF EXISTS "Users can only access their own interactions" ON interactions;

-- Create separate policies for SELECT, INSERT, UPDATE, DELETE
CREATE POLICY "Users can select their own interactions"
  ON interactions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own interactions"
  ON interactions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own interactions"
  ON interactions
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own interactions"
  ON interactions
  FOR DELETE
  USING (user_id = auth.uid());
