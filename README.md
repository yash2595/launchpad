# 🚀 LaunchPad — Student Internship & Career Tracker

### 🔗 Project Links
- **GitHub Repository:** `https://github.com/yash2595/launchpad`
- **Live Deployment:** `https://launchpad-tracker.vercel.app` *(or Netlify Link)*
- **Demo Screen Recording:** `https://loom.com/share/<your-video-id>` *(or YouTube link)*

---

Hey there! Welcome to **LaunchPad**. 👋

We've all been there: during placement seasons or active job hunts, you end up applying to 50+ companies across LinkedIn, Indeed, and various career portals. Tracking which test is due, when the interview is, and who rejected you using standard Excel sheets or paper diaries quickly becomes a messy, overwhelming nightmare.

That's exactly why I built **LaunchPad** — a visual, full-stack application designed specifically for students to organize, manage, and accelerate their career prep. 

LaunchPad isn't just a basic CRUD app; it's a dashboard featuring **real-time analytics**, an interactive **drag-and-drop Board**, a **Learning Log** to track your skill development, and live integrations with public APIs (like fetching jobs or simulating cloud POST requests).

---

## 🎥 Screen Recording Walkthrough & Outline
*(To help with the 3–5 minute video submission explaining the project)*

Here is the exact architectural and functional breakdown of what is explained in the demonstration video:

### 1. System Architecture
LaunchPad is structured with a decoupled, clean layered architecture:
- **Client Layer:** Built with **React 18 + Vite** for fast performance and instant hot reloads.
- **State Layer:** Utilizes **Redux Toolkit** to maintain single source of truth for auth, internships, and modal overlays, paired with local storage subscription for persistence.
- **Service Layer (API Client):** Uses **Axios** to connect to public APIs and the **Supabase JS Client** for auth and CRUD operations.
- **Backend (Database & Auth):** Powered by **Supabase (Postgres + Auth)**, using real database triggers to auto-create profiles on registration and Row-Level Security (RLS) policies for data protection.

### 2. Component Design & Responsibility
- **UI Kit (Basic Primitives):** Located in `src/components/UI`. These are custom structural blocks written from scratch (without Tailwind/Bootstrap):
  - `Button.jsx`: Handles press animations.
  - `Badge.jsx`: Maps status/priority colors.
  - `Modal.jsx` & `Toast.jsx`: Manage animated feedback overlays.
  - `Skeleton.jsx`: Standard skeleton loader for fetching states.
- **Functional Workspace Components:**
  - `StatsRow.jsx`: Standard grid utilizing Lucide Icons and weekly math formulas.
  - `KanbanBoard.jsx`: HTML5 Drag-and-Drop system to change card status.
  - `BrowseJobsModal.jsx` & `LearningPage.jsx`: Connect to public endpoints and handle inputs.

### 3. API Integration (GET & POST)
- **GET Request (DummyJSON):** Open *Browse Careers & Jobs* modal. It triggers a GET request to `https://dummyjson.com/products?limit=6`. While loading, it renders a grid of custom Shimmer Skeletons, handles network issues via error toasts, and lets the user save job items locally.
- **POST Request (JSONPlaceholder):** In *Learning Log*, creating a new skill triggers a POST request to `https://jsonplaceholder.typicode.com/posts` using Axios. The form disables into a loading spinner, parses responses, and raises a success popup on completion.

### 4. Developer Challenges Faced
- **Brave Browser Shields Blocking Requests:** Strict privacy shields block calls to `supabase.co` domains. Turning off Brave Shields or using Chrome resolved the issue.
- **Vite Env Caching:** Vite caches env variables on startup. Fully terminating the terminal and restarting `npm run dev` reloaded corrected credentials.
- **Optimistic UI Updates:** Dragging cards on the Board was sluggish when waiting for database response. Implemented optimistic updates: Redux moves the card instantly on board, while the Supabase API runs in background. If the API fails, Redux catches the error, rolls back the card, and notifies the user.

---

## 🚀 Key Features

- **📊 Unified Analytics Dashboard:** Shows your job application funnel at a glance (Total, In Progress, Interviews, Offers, Rejections). It also has live visual graphs (Bar & Line charts) that update in real-time.
- **🚨 Upcoming Deadlines Warning:** An alert strip that scans your applications and warns you if a deadline is within 7 days.
- **📋 Visual Pipeline Board:** A drag-and-drop board (similar to Notion or Trello) that lets you slide job cards across different pipeline stages (Applied → Screening → Interview → Offer → Rejected) with optimistic UI updates.
- **🧠 Skills & Learning Log:** Track your placement preparation (Frontend, Backend, DSA, DevOps) with range progress sliders. If you hit `100%`, your status dynamically upgrades to *Mastered*!

---

## ⚙️ Setup & Installation

Follow these simple steps to run the application locally on your system:

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd launchpad
npm install
```

### 2. Configure Environment Variables
Create a file named `.env` in the root of the project and paste your Supabase keys:
```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### 3. Setup the Database
Go to your **Supabase Dashboard → SQL Editor**, create a **New Query**, paste this schema script, and click **Run**:

```sql
-- Create Profiles table (tied to Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
create policy "Allow public read-only access to profiles" on public.profiles for select using (true);
create policy "Allow users to update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Allow users to insert their own profile" on public.profiles for insert with check (auth.uid() = id);

-- Trigger to create profile record automatically on Auth signup
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
create policy "Users can perform all actions on their own internships" on public.internships
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

### 4. Start the Application
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## 📸 Screenshots

### 🖥️ Dashboard View
*A clean overview of application statuses, upcoming deadlines, and dynamic charts.*
![Dashboard View](https://raw.githubusercontent.com/username/repository/main/screenshots/dashboard.png)

### 📋 Board View (Drag & Drop)
*Drag and drop your application cards to update status columns in real-time.*
![Board View](https://raw.githubusercontent.com/username/repository/main/screenshots/kanban.png)

### 🎓 Learning Log
*Track your preparation, skills, and log HTTP POST requests to public servers.*
![Learning Log](https://raw.githubusercontent.com/username/repository/main/screenshots/learning.png)

---

Developed with 💻 by a Student Developer. Feel free to clone, star, or contribute!
