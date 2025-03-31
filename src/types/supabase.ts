export type Profile = {
  id: string;
  updated_at: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type OnboardingData = {
  id: string;
  user_id: string;
  education_level: string | null;
  field_of_study: string | null;
  current_year: string | null;
  institution: string | null;
  phone_number: string | null;
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
