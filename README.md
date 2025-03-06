# Pebblr App

A minimalist web application that helps users maintain regular contact with people in their network through customizable reminder frequencies.

## Overview

Pebblr helps you nurture your professional and personal relationships by providing a simple inbox-style interface that shows which contacts are due for interaction based on your preferred cadence (monthly, quarterly, semi-annual, or annual).

## Tech Stack

- **Frontend**: Next.js with React
- **Styling**: Tailwind CSS and Shadcn UI
- **Backend/Database**: Supabase
- **Authentication**: Supabase Auth
- **Hosting**: Vercel

## Features

- **Contact Management**: Easily add, edit, and delete contacts with customizable reminder frequencies
- **Smart Reminder System**: Automatic calculation of next reminder dates based on your interactions
- **Inbox Interface**: At-a-glance view of contacts due for interaction
- **Interaction Tracking**: Simple "DONE" button with optional notes for each interaction
- **Notification System**: Email digests and browser tab notifications
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/contact-reminder-app.git
   cd contact-reminder-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials.

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app                   # Next.js app router
  /api                 # API routes
  /(routes)            # App routes
/components            # Reusable components
  /ui                  # Shadcn UI components
/lib                   # Utility functions
/public                # Static assets
/styles                # Global styles
```

## Database Schema

The application uses four main tables:
- `users`: User authentication and profile data
- `contacts`: Contact information and reminder frequencies
- `interactions`: History of interactions with contacts
- `user_settings`: User preferences for notifications and subscription status

## Deployment

The application is configured for deployment on Vercel:

```
vercel
```
## License

This project is licensed under the MIT License - see the LICENSE file for details.