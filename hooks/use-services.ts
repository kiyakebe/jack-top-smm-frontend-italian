"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import type {
  Service,
  ApiResponse,
  OriginalService,
  CreateService,
} from "@/types/api";
import { useEffect, useState } from "react";

export function useServices() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsAdmin(userData.role === "admin");
    }
  }, []);

  return useQuery({
    queryKey: ["services", isAdmin ? "admin" : "client"],
    queryFn: async () => {
      const endpoint = isAdmin ? "/services/admin" : "/services";
      const response = await api.get<ApiResponse<Service[]>>(endpoint);
      return response.data.data || [];
    },
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Partial<CreateService>) => {
      console.log(service);
      const response = await api.post<ApiResponse<Service>>(
        "/services/admin",
        service
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service created successfully!");
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: number) => {
      await api.delete(`/services/admin/${serviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted successfully!");
    },
  });
}

export function useOriginalServices() {
  return useQuery({
    queryKey: ["services", "original"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<OriginalService[]>>(
        "/services/original"
      );
      return response.data.data || [];
    },
  });
}
