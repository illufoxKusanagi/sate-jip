"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthUser {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, token: string, role: string) => void;
  logout: () => Promise<void>; // Updated to return Promise
  isLoading: boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const userData = localStorage.getItem("authUser");

    // console.log("AuthProvider useEffect - Token:", token ? "exists" : "none");
    // console.log(
    //   "AuthProvider useEffect - UserData:",
    //   userData ? "exists" : "none"
    // );

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("AuthProvider useEffect - Parsed user:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("auth-token");
        localStorage.removeItem("authUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, token: string, role: string) => {
    console.log("AuthProvider login - Username:", username, "Token:", token);
    const userData = { id: "1", username, role };

    localStorage.setItem("auth-token", token);
    localStorage.setItem("authUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    console.log("AuthProvider logout");

    // Call logout API to clear httpOnly cookie
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Error calling logout API:", error);
    }

    // Clear localStorage
    localStorage.removeItem("auth-token");
    localStorage.removeItem("authUser");
    setUser(null);
    toast.success("Logged out successfully!");
    router.push("/login"); // Redirect to login, not dashboard
  };

  const isAdmin = () => user?.role === "admin";
  const isUser = () => user?.role === "user";
  const hasRole = (role: string) => user?.role === role;

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
        isAdmin,
        isUser,
        hasRole,
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
