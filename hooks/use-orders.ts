import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import type { Order, ApiResponse } from "@/types/api";
import { CreateOrderFormValues } from "@/schemas/order";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Order[]>>("/topsmm/orders");
      return response.data.data || [];
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderFormValues) => {
      const response = await api.post<ApiResponse<Order>>(
        "/topsmm/order",
        orderData
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order created successfully!");
    },
  });
}

export function useRefillOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderIds: number[]) => {
      const response = await api.post("/topsmm/orders/refill", { orderIds });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Orders refilled successfully!");
    },
  });
}

// export function useCancelOrders() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (orderIds: number[]) => {
//       console.log({
//         orderIds: orderIds,
//       });
//       const response = await api.post("/topsmm/orders/cancel", {
//         orderIds: orderIds,
//       });
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//       toast.success("Orders cancelled successfully!");
//     },
//   });
// }

export function useCancelOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderIds: number[]) => {
      console.log({
        orderIds: orderIds,
      });
      const response = await api.post("/topsmm/orders/cancel", {
        orderIds: orderIds,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(data.data[0].cancel.error || "Orders cancelled successfully!");
    },
  });
}