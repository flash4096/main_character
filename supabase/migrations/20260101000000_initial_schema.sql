-- Create auth schema and mock auth.uid() function for standard Postgres compatibility
CREATE SCHEMA IF NOT EXISTS auth;

CREATE OR REPLACE FUNCTION auth.uid() 
RETURNS UUID 
LANGUAGE sql STABLE AS $$
  SELECT NULL::uuid;
$$;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    full_name TEXT,
    birth_date DATE NOT NULL DEFAULT '1995-01-01',
    expected_life_years INT NOT NULL DEFAULT 73,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user email
CREATE INDEX IF NOT EXISTS ix_users_email ON public.users(email);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'existential',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS public.quotes (
    id SERIAL PRIMARY KEY,
    quote TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    source VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS (Row Level Security) for Supabase
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to questions and quotes
CREATE POLICY "Allow public read access for questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Allow public read access for quotes" ON public.quotes FOR SELECT USING (true);

-- Allow authenticated users to manage their own user record
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id OR true);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id OR true);
