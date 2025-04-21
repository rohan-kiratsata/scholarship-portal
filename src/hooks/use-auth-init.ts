import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { mapFirebaseUser } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { auth } from "@/lib/firebase";

export const useAuthInit = () => {
  const { setLoading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        useAuthStore.setState({
          user: mapFirebaseUser(user),
          loading: false,
        });
      } else {
        useAuthStore.setState({
          user: null,
          loading: false,
        });
      }
    });
    return () => unsub();
  }, [setLoading]);
};
