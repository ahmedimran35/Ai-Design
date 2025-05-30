
"use client";

import type { User as FirebaseUser } from "firebase/auth";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from "firebase/auth";
import { auth } from "@/lib/firebase/config"; // Import Firebase auth instance
import type { Dispatch, ReactNode, SetStateAction } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: FirebaseUser | null;
  authLoading: boolean; // To indicate if Firebase is checking auth state
  login: (email?: string, password?: string) => Promise<FirebaseUser | null>;
  signup: (email?: string, password?: string) => Promise<FirebaseUser | null>;
  logout: () => Promise<void>;
  // setUser and setIsAuthenticated are now managed internally by onAuthStateChanged
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // Start as true

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setAuthLoading(false); // Firebase has determined auth state
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const login = async (email?: string, password?: string): Promise<FirebaseUser | null> => {
    if (!email || !password) {
      throw new Error("Email and password are required for login.");
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting user and isAuthenticated
      return userCredential.user;
    } catch (error) {
      console.error("Firebase login error:", error);
      throw error; // Re-throw for the form to handle
    }
  };

  const signup = async (email?: string, password?: string): Promise<FirebaseUser | null> => {
    if (!email || !password) {
      throw new Error("Email and password are required for signup.");
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting user and isAuthenticated
      return userCredential.user;
    } catch (error) {
      console.error("Firebase signup error:", error);
      throw error; // Re-throw for the form to handle
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will handle setting user to null and isAuthenticated to false
    } catch (error) {
      console.error("Firebase logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        authLoading,
        login, 
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
