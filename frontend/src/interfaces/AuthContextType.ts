import { User } from '@supabase/supabase-js';

export interface AuthContextType {
    currentUser: User | null;
    userLoggedIn: boolean;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}