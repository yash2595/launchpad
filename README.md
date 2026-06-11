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
Go to the SQL Editor in your Supabase dashboard and run this script to create the tables, triggers, and security policies:

```sql
-- Create Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
create policy "Allow public read" on public.profiles for select using (true);
create policy "Allow user update" on public.profiles for update using (auth.uid() = id);
create policy "Allow user insert" on public.profiles for insert with check (auth.uid() = id);

-- Trigger to create profile automatically on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Student'));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create Internships table
create table public.internships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  company_name text not null,
  job_title text not null,
  location text,
  applied_date date,
  deadline date,
  status text not null check (status in ('Applied', 'Screening', 'Interview', 'Offer', 'Rejected')),
  priority text check (priority in ('High', 'Medium', 'Low')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.internships enable row level security;
create policy "Owner CRUD" on public.internships for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

### 4. Run the development server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.
