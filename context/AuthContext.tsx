import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { AppUser } from "../types/user";

// Types
type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Haal huidige gebruiker op bij app-start
    supabase.auth.getUser().then((response: { data: { user: any } }) => {
      if (response.data.user) {
        setUser({
          id: response.data.user.id,
          email: response.data.user.email ?? "",
        });
      }
      setLoading(false);
    });

    // 2. Luister naar login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
