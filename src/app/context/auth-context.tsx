// src/app/context/auth-context.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthUser {
  id: string;
  username: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage on mount
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");

    console.log("AuthProvider useEffect - Token:", token ? "exists" : "none");
    console.log(
      "AuthProvider useEffect - UserData:",
      userData ? "exists" : "none"
    );

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("AuthProvider useEffect - Parsed user:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, token: string) => {
    console.log("AuthProvider login - Username:", username, "Token:", token);
    const userData = { id: "1", username };

    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    console.log("AuthProvider logout");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setUser(null);
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  const isAuthenticated = !!user;

  console.log(
    "AuthProvider render - isAuthenticated:",
    isAuthenticated,
    "user:",
    user
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
