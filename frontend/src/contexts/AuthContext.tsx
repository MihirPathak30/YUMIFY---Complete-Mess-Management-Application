import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* ===================== TYPES ===================== */

export type UserRole = "customer" | "mess_manager";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: UserRole; // ✅ optional
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
}

/* ===================== CONTEXT ===================== */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ===================== INIT (SUPABASE SOURCE OF TRUTH) ===================== */

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        setUser({
          id: data.user.id, // ✅ CRITICAL
          email: data.user.email || "",
          name: data.user.user_metadata?.full_name || "",
          role: data.user.user_metadata?.role,
        });
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ===================== ACTIONS ===================== */

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success("Login successful");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Logged out");
  };

  const setUserRole = async (role: UserRole) => {
    if (!user) return;

    const { error } = await supabase.auth.updateUser({
      data: { role },
    });

    if (error) {
      toast.error("Failed to update role");
      return;
    }

    setUser({ ...user, role });
    toast.success("Role selected successfully");
  };

  /* ===================== CONTEXT VALUE ===================== */

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setUserRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/* ===================== HOOK ===================== */

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
