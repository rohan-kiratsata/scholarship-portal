import { User as FirebaseUser } from "firebase/auth";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: any;
  signOut: any;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const mapFirebaseUser = (user: FirebaseUser): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});
