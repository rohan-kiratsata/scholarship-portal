-- Create profiles table that extends the auth.users table
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    updated_at timestamp with time zone,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create onboarding_data table
create table public.onboarding_data (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    education_level text,
    field_of_study text,
    current_year text,
    institution text,
    phone_number text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.onboarding_data enable row level security;

-- Create policies
create policy "Users can view their own profile"
    on public.profiles for select
    using ( auth.uid() = id );

create policy "Users can update their own profile"
    on public.profiles for update
    using ( auth.uid() = id );

create policy "Users can view their own onboarding data"
    on public.onboarding_data for select
    using ( auth.uid() = user_id );

create policy "Users can insert their own onboarding data"
    on public.onboarding_data for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own onboarding data"
    on public.onboarding_data for update
    using ( auth.uid() = user_id );

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, avatar_url)
    values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user(); 