import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { getStackAuthJWT } from "../auth/stack-jwt";

// Server-side Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Client-side Supabase client with Stack Auth JWT
export const createSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: "", // Initial value
        },
        async fetch(input, init) {
          const token = await getStackAuthJWT();
          init = init || {};
          init.headers = {
            ...init.headers,
            Authorization: token ? `Bearer ${token}` : "",
          };
          return fetch(input, init);
        },
      },
    }
  );
};
