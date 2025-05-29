
"use client";

import type { User } from "firebase/auth";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  user: User | null; // Replace with your actual user type if not using Firebase User
  setUser: Dispatch<SetStateAction<User | null>>; // Replace with your actual user type
  // For demo purposes, we'll simulate login/logout
  login: (email?: string, password?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Replace User with your actual user type

  // Simulate login
  const login = (email?: string, password?: string) => {
    // In a real app, you'd verify credentials here
    setIsAuthenticated(true);
    // setUser({ email } as User); // Mock user object
    // For this example, actual Firebase auth is not implemented here.
    // This is a placeholder for real authentication logic.
    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", "true");
      if (email) {
        localStorage.setItem("userEmail", email);
      }
    }
  };

  // Simulate logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userEmail");
    }
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("isAuthenticated");
      const storedEmail = localStorage.getItem("userEmail");
      if (storedAuth === "true") {
        setIsAuthenticated(true);
        // if (storedEmail) {
        //   setUser({ email: storedEmail } as User); // Mock user object
        // }
      }
    }
  }, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, login, logout }}>
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
