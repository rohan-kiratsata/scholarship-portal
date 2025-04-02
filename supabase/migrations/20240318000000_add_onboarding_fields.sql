-- Create onboarding_data table
CREATE TABLE IF NOT EXISTS onboarding_data (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    education_level text,
    field_of_study text,
    current_year text,
    institution text,
    phone_number text,
    caste text,
    religion text,
    annual_income text,
    state text,
    district text,
    date_of_birth date,
    gender text,
    address text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz,
    UNIQUE(user_id)
);

-- Set up RLS (Row Level Security)
ALTER TABLE onboarding_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own data
CREATE POLICY "Users can view own onboarding data" ON onboarding_data
    FOR SELECT USING (auth.uid()::uuid = user_id);

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert own onboarding data" ON onboarding_data
    FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own onboarding data" ON onboarding_data
    FOR UPDATE USING (auth.uid()::uuid = user_id);

-- Create trigger to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON onboarding_data
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at(); 