/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react'
import { firebaseAuth } from '../services/firebaseConfig.ts'
import { onAuthStateChanged, User } from 'firebase/auth';
import { AuthContextType } from '../interfaces/AuthContextType.ts'

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    userLoggedIn: false,
    loading: true,
});

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return useContext(AuthContext);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Checking auth state...");
        try {
            const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
                console.log("Firebase detected auth state change:", user);
                initializeUser(user)
            });
            return () => {
                console.log("Unsubscribing from auth listener...");
                unsubscribe();
            } 
        } catch (error) {
            console.error("Firebase Auth Error in AuthContext.tsx:", error);
        }
    }, [])

    async function initializeUser(user: User | null) {
        if (user) {
            setCurrentUser({...user});
            setUserLoggedIn(true);
            console.log("Signed in successfully")
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
            console.log("Signed out successfully")
        }
        setLoading(false);
    }

    const value = {
        currentUser,
        userLoggedIn,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}