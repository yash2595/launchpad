-- 1. Create Profiles Table (Linked to Auth users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Setup Security Policies
create policy "Allow public read" on public.profiles for select using (true);
create policy "Allow user update" on public.profiles for update using (auth.uid() = id);
create policy "Allow user insert" on public.profiles for insert with check (auth.uid() = id);

-- Setup trigger to create a profile automatically on Auth registration
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


-- 2. Create Internships Table
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

-- Enable RLS
alter table public.internships enable row level security;

-- Owner-only CRUD policy
create policy "Owner CRUD" on public.internships for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
