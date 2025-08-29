import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { AppUser } from "../types/user";

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
    // Huidige gebruiker ophalen
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({
          id: user.id,
          email: user.email ?? "",
        });
      }
      setLoading(false);
    });

    // Auth state changes volgen
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
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
      authListener?.subscription.unsubscribe(); 
    };
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;

}
