export type Profile = {
  id: string;
  updated_at: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  stack_id: string;
};

export type OnboardingData = {
  id: string;
  user_id: string;
  education_level: string | null;
  field_of_study: string | null;
  current_year: string | null;
  institution: string | null;
  phone_number: string | null;
  caste: string | null;
  religion: string | null;
  annual_income: string | null;
  state: string | null;
  district: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  created_at: string;
  updated_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id">>;
      };
      onboarding_data: {
        Row: OnboardingData;
        Insert: Omit<OnboardingData, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<OnboardingData, "id" | "user_id">>;
      };
    };
  };
};
