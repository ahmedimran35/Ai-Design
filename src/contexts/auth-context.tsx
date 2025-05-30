
"use client";

import type { User } from "firebase/auth";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  login: (email?: string, password?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (email?: string, password?: string) => {
    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", "true");
      if (email) {
        localStorage.setItem("userEmail", email);
        setUser({ email } as User); // Simulate user object for context
      }
    }
  };

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
        if (storedEmail) {
            setUser({ email: storedEmail } as User); // Simulate user object
        }
      }
    }
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        setIsAuthenticated, 
        user, 
        setUser, 
        login, 
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
