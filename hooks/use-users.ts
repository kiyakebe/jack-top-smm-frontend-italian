"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import type { User, ApiResponse } from "@/types/api";
import { z } from "zod";

// Schemas for user management
export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  role: z.enum(["user", "admin"]).optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export function useUsers() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsAdmin(userData.role === "admin");
    }
  }, []);

  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<User[]>>("/users");
      return response.data.data || [];
    },
  });

  const createUser = useMutation({
    mutationFn: async (userData: CreateUserFormData) => {
      const response = await api.post<ApiResponse<User>>(
        "/auth/register",
        userData
      );
      return response.data.data;
    },
    onSuccess: () => {
      query.refetch();
      toast.success("User created successfully!");
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: UpdateUserFormData;
    }) => {
      const response = await api.put<ApiResponse<User>>(
        `/users/${id}`,
        userData
      );
      return response.data.data;
    },
    onSuccess: () => {
      query.refetch();
      toast.success("User updated successfully!");
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      query.refetch();
      toast.success("User deleted successfully!");
    },
  });

  const banUser = useMutation({
    mutationFn: async (userId: string) => {
      await api.post(`/users/${userId}/ban`);
    },
    onSuccess: () => {
      query.refetch();
      toast.success("User Banned successfully!");
    },
  });

  const unBanUser = useMutation({
    mutationFn: async (userId: string) => {
      await api.post(`/users/${userId}/unban`);
    },
    onSuccess: () => {
      query.refetch();
      toast.success("User Un Banned successfully!");
    },
  });

  return {
    users: query.data || [],
    isLoading: query.isLoading,
    isAdmin,
    createUser,
    updateUser,
    deleteUser,
    banUser,
    unBanUser,
  };
}
