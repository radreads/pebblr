# Contact Reminder App Technical Specification

## Project Overview
A minimalist web application that helps users maintain regular contact with people in their network by setting reminder frequencies and displaying contacts that are due for interaction in an inbox-style interface.

## Target Audience
Motivated individuals who value maintaining relationships in both professional and personal contexts, with some degree of tech-savviness.

## Tech Stack
- **Frontend Framework**: Next.js with React
- **Styling**: Tailwind CSS and Shadcn UI
- **Backend/Database**: Supabase
- **Authentication**: Supabase Auth
- **Hosting**: Vercel
- **Initial Prototyping**: V0 by Vercel

## Core Features

### 1. User Authentication
- Email/password authentication through Supabase Auth (simplest implementation)
- Secure user sessions and data isolation

### 2. Contact Management
- **Add Contact**:
  - Name (required)
  - Reminder frequency (monthly, quarterly, semi-annual, annual)
  - Birthday (optional)
  - Initial notes (optional)
  
- **Update Contact**:
  - Edit any field
  - Delete contact

### 3. Reminder System
- Automatic calculation of next reminder date based on frequency
- When a contact is marked as "DONE", next reminder date is calculated from current date
- Contacts appear in inbox when their reminder date is reached

### 4. Inbox Interface
- Display contacts that are due for interaction
- Sort by days overdue (descending by default)
- Group by frequency option
- Sort by last absolute contact date option
- Each contact card displays:
  - Name
  - Frequency (visual indicator/capsule)
  - Days overdue
  
### 5. Notification System
- Email digest (customizable frequency)
- Browser tab notification (number of contacts in inbox)

### 6. Contact Interaction
- "DONE" button for each contact in inbox
- Playful animation/transition when marking as done
- Optional quick note field when marking as done
- Contact immediately disappears from inbox after marking as done

### 7. Overdue Handling
- Visual differentiation for severely overdue contacts in the inbox

### 8. Monetization
- Free tier: Up to 10 contacts
- One-time payment of $20 for unlimited contacts

## Database Schema

### Users Table
```
users (
  id: uuid (primary key)
  email: string
  created_at: timestamp
  updated_at: timestamp
)
```

### Contacts Table
```
contacts (
  id: uuid (primary key)
  user_id: uuid (foreign key)
  name: string
  frequency: enum (weekly, monthly, quarterly, semi-annual, annual)
  birthday: date (nullable)
  notes: text (nullable)
  next_reminder_date: date
  created_at: timestamp
  updated_at: timestamp
)
```

### Interactions Table
```
interactions (
  id: uuid (primary key)
  contact_id: uuid (foreign key)
  interaction_date: timestamp
  notes: text (nullable)
  created_at: timestamp
)
```

### User Settings Table
```
user_settings (
  user_id: uuid (primary key, foreign key)
  email_digest_frequency: enum (daily, weekly, never)
  paid_tier: boolean
  created_at: timestamp
  updated_at: timestamp
)
```

## UI/UX Design Guidelines

### General Style
- Minimalist aesthetic with playful accents
- Clean, uncluttered interfaces
- Standard accessibility compliance

### Key Screens

#### 1. Authentication
- Simple sign-up/login form
- Minimal fields

#### 2. Dashboard/Inbox
- Prominently displays contacts due for interaction
- Clear visual hierarchy
- Sorting/filtering options
- Counter showing number of contacts in inbox

#### 3. Add/Edit Contact Form
- Simple form with minimal required fields
- Clear frequency selection options

#### 4. Settings Page
- Email notification preferences
- Account management
- Payment portal (when exceeding free tier)

### User Flows

#### Onboarding
1. Sign up with email
2. Minimal introduction to app functionality through UI design
3. Prompt to add first contact

#### Adding a Contact
1. Click "Add Contact" button
2. Fill in name and frequency (required)
3. Optionally add birthday and notes
4. Save contact

#### Interacting with a Contact
1. View contact in inbox
2. Click "DONE" button
3. Optional: Add quick note about interaction
4. Contact disappears with animation
5. System calculates next reminder date

## Analytics Requirements
- Track number of contacts added
- Track number of contacts marked as done

## Future Features (Not in Initial Scope)
- Voice notes for interactions
- Note-taking system
- Calendar integrations

## Development Phases

### Phase 1: V0 Prototype
- Create UI mockups using V0 by Vercel
- Test user flows and interface design
- Gather initial feedback

### Phase 2: MVP Development
- Set up Next.js project with Tailwind and Shadcn UI
- Implement Supabase authentication
- Create database schema
- Develop core functionality (contact management, inbox, reminders)
- Implement basic email notifications

### Phase 3: Refinement and Launch
- Add payment integration for premium tier
- Implement browser tab notifications
- Polish UI animations
- Ensure accessibility standards
- Deploy to Vercel

## Technical Considerations
- Mobile-first responsive design
- Browser compatibility focus
- Performance optimization for quick interactions
- Secure data handling
