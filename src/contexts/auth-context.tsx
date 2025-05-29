
"use client";

import type { User } from "firebase/auth";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  user: User | null; 
  setUser: Dispatch<SetStateAction<User | null>>;
  usageCount: number;
  isPaidUser: boolean;
  login: (email?: string, password?: string) => void;
  logout: () => void;
  incrementUsageCount: () => void;
  upgradeToPaid: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [isPaidUser, setIsPaidUser] = useState(false);

  const loadUserData = (email: string | null) => {
    if (email) {
      const storedUsageCount = localStorage.getItem(`usageCount_${email}`);
      const storedIsPaidUser = localStorage.getItem(`isPaidUser_${email}`);
      setUsageCount(storedUsageCount ? parseInt(storedUsageCount, 10) : 0);
      setIsPaidUser(storedIsPaidUser === "true");
    } else {
      // Reset for logged out state or if no email (though login should provide it)
      setUsageCount(0);
      setIsPaidUser(false);
    }
  };

  const login = (email?: string, password?: string) => {
    setIsAuthenticated(true);
    // setUser({ email } as User); // Mock user object
    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", "true");
      if (email) {
        localStorage.setItem("userEmail", email);
        setUser({ email } as User); // Simulate user object for context
        loadUserData(email); // Load specific user data
      }
    }
  };

  const logout = () => {
    const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
    if (email && typeof window !== "undefined") {
        // Optional: Clear specific user data upon logout if desired
        // localStorage.removeItem(`usageCount_${email}`);
        // localStorage.removeItem(`isPaidUser_${email}`);
    }
    setIsAuthenticated(false);
    setUser(null);
    setUsageCount(0); // Reset for next login or general state
    setIsPaidUser(false); // Reset for next login
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
            loadUserData(storedEmail);
        }
      }
    }
  }, []);

  const incrementUsageCount = () => {
    if (!isPaidUser) {
      setUsageCount(prevCount => {
        const newCount = prevCount + 1;
        const email = localStorage.getItem("userEmail");
        if (email && typeof window !== "undefined") {
          localStorage.setItem(`usageCount_${email}`, newCount.toString());
        }
        return newCount;
      });
    }
  };

  const upgradeToPaid = () => {
    setIsPaidUser(true);
    const email = localStorage.getItem("userEmail");
    if (email && typeof window !== "undefined") {
      localStorage.setItem(`isPaidUser_${email}`, "true");
      // Optional: Reset usage count upon upgrade or handle as per business logic
      // setUsageCount(0);
      // localStorage.setItem(`usageCount_${email}`, "0");
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        setIsAuthenticated, 
        user, 
        setUser, 
        login, 
        logout,
        usageCount,
        isPaidUser,
        incrementUsageCount,
        upgradeToPaid
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
