# LaunchPad - Internship & Career Tracker

LaunchPad is a web application built with React, Redux Toolkit, and Supabase to help students track their internship applications and learning progress in one place. 

## Key Features

- **Dashboard:** Displays total applications, applications in progress, interviews scheduled, offers received, and rejected applications. It also has charts for status and weekly activity.
- **Board View:** A drag-and-drop board where you can drag job cards between different stages (Applied, Screening, Interview, Offer, Rejected).
- **Learning Log:** Track skills you are learning with a progress slider. It also integrates with a test API to simulate cloud saves.
- **Browse Jobs:** Search and import jobs from an external API (DummyJSON).
- **Authentication:** Sign up, verify email, and log in securely.

## Tech Stack
- React JS (Vite)
- Redux Toolkit
- React Router v6
- Axios
- Supabase (PostgreSQL & Auth)
- Custom CSS Modules (No Tailwind or external UI library)

## How to Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root folder and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Setup Database Tables in Supabase
Go to the SQL Editor in your Supabase dashboard and run the SQL query located in the `schema.sql` file at the root of this repository. This will create the necessary tables, security policies, and user trigger functions.

### 4. Run the development server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.
