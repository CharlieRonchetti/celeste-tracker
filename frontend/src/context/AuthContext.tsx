/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../services/supabase.ts";
import { AuthContextType } from "../interfaces/AuthContextType.ts";

// Use this hook wherever auth is needed
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Check if a user is already logged in
      const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        //setUserLoggedIn(true);
        setLoading(false);
      };
  
      fetchUser();
  
      // Listen for auth state changes
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user || null);
      });
  
      return () => listener.subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string) => {
      await supabase.auth.signUp({ email, password });
      setUserLoggedIn(true);
    }
  
    const signIn = async (email: string, password: string) => {
      await supabase.auth.signInWithPassword({ email, password });
      setUserLoggedIn(true);
    };
  
    const signOut = async () => {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setUserLoggedIn(false);

      // Ensure the browser session is cleared
      localStorage.removeItem("supabase.auth.token");
      sessionStorage.clear();
    };
  
    return (
      <AuthContext.Provider value={{ currentUser, userLoggedIn, loading, signUp, signIn, signOut }}>
        {children}
      </AuthContext.Provider>
    );
  }