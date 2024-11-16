"use client";
import { auth, db } from "@/firebase/firebaseConfig";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type ChildrenType = {
    children: ReactNode;
};

type UserType = {
    username: string;
    email: string;
    password: string;
    emailVerified: boolean;
};

type ContextType = {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
    resendVerificationEmail: () => void;
};

const AuthContext = createContext<ContextType | null>(null);

export default function AuthContextProvider({ children }: ChildrenType) {
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                fetchUserData(uid);
            } else {
                setUser(null);
            }
        });
    }, []);

    const fetchUserData = async (uid: string) => {
        let docRef = doc(db, "users", uid);
        try {
            let userFound = await getDoc(docRef);
            let userData = userFound.data();
            if (!userData) return;

            const userWithEmailVerified = {
                ...userData,
                emailVerified: auth.currentUser?.emailVerified || false,
            };

            setUser(userWithEmailVerified as UserType);
        } catch (e) {
            console.error("Error fetching user data:", e);
        }
    };

    const resendVerificationEmail = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                await sendEmailVerification(user);
                alert("Verification email sent!");
            } catch (error) {
                console.error("Error sending verification email:", error);
                alert("Failed to send verification email.");
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, resendVerificationEmail }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
