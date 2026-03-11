"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  plan: "free" | "pro" | "ultra";
  credits: number;
  refreshCredits: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  plan: "free",
  credits: 0,
  refreshCredits: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<"free" | "pro" | "ultra">("free");
  const [credits, setCredits] = useState(0);
  const supabase = createClient();
  const router = useRouter();

  async function fetchUserData(userId: string) {
    const { data } = await supabase
      .from("users")
      .select("plan, credits")
      .eq("id", userId)
      .single();
    setPlan((data?.plan as "free" | "pro" | "ultra") ?? "free");
    setCredits(data?.credits ?? 0);
  }

  async function refreshCredits() {
    if (!user) return;
    const { data } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single();
    setCredits(data?.credits ?? 0);
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserData(session.user.id);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserData(session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, plan, credits, refreshCredits, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
