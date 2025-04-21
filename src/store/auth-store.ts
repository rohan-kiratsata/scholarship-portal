import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthState, mapFirebaseUser } from "@/types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      error: null,

      signInWithGoogle: async () => {
        try {
          set({ loading: true, error: null });
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          set({ user: mapFirebaseUser(result.user), loading: false });
        } catch (error) {
          console.error("Error signing in with Google", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to sign in with Google",
            loading: false,
          });
        }
      },

      signOut: async () => {
        try {
          await firebaseSignOut(auth);
          set({ user: null });
        } catch (error) {
          console.error("Error signing out", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to sign out",
          });
        }
      },

      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
