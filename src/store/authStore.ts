import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string | null;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, name?: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      signIn: async (email: string, name?: string) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name }),
          });
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Authentication failed");
          }
          const user = await res.json();
          set({ user, loading: false });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Auth failed", loading: false });
        }
      },
      signOut: () => {
        set({ user: null, error: null });
      },
    }),
    {
      name: "autoparts-auth-storage",
    }
  )
);
