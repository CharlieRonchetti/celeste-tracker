import { firebaseAuth } from '../services/firebaseConfig.ts'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

export const doCreateUserWithEmailAndPassword = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(firebaseAuth, email, password);
}

export const doSignInWithEmailAndPassword = async (email: string, password: string) => {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export const doSignOut = () => {
    return firebaseAuth.signOut();
}