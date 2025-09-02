"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import type { User, ApiResponse, LoginResponse } from "@/types/api";

// Update the AuthContextType interface to include register function
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add the register function to the AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing auth state:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.status === "success" && response.data.data) {
        const { accessToken, refreshToken, user } = response.data.data;

        // Store tokens and user data in localStorage
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        setToken(accessToken);
        setUser(user);
        toast.success("Login successful!");

        if (user?.role == "admin") {
          router.push("/admin");
        } else if (user?.role == "user") {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post<ApiResponse<User>>("/auth/register", {
        name,
        email,
        password,
      });

      if (response.data.status === "success") {
        toast.success("Registration successful! Please log in.");
        router.push("/login");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Clear all auth-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    router.push("/login");
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading }}
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
