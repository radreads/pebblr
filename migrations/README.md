# Database Migrations

This directory contains SQL migration files for setting up and updating the database schema in Supabase.

## How to Apply Migrations

1. Log in to your Supabase dashboard
2. Go to the SQL Editor tab
3. Create a new query
4. Copy the contents of the SQL migration file you want to apply
5. Paste the SQL into the query editor
6. Run the query

## Available Migrations

- `create_interactions_table.sql`: Creates the `interactions` table for tracking contact touchpoints when a user marks a contact as "done"

## Database Schema

### Users Table

This is automatically created and managed by Supabase Auth.

### Contacts Table

Stores the contacts that users want to keep in touch with.

### Interactions Table

Stores records of interactions with contacts when they are marked as "done". Each interaction includes:

- Reference to the user
- Reference to the contact
- Optional summary text
- Timestamp when created

When an interaction is created, the contact's next reminder date is updated based on the frequency (weekly, monthly, etc.). 