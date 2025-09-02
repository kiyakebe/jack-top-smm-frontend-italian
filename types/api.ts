export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  isBanned: boolean;
}
export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  service: number;
  name: string;
  rate: number;
  min: number;
  max: number;
  type: string;
  dripfeed: boolean;
  refill: boolean;
  cancel: boolean;
  category?: Category;
  isFree: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  original: {
    name: string;
    rate: number;
    category: string;
  };
}

export interface CreateService {
  service: number;
  name: string;
  rate: number;
  min: number;
  max: number;
  type: string;
  dripfeed: boolean;
  refill: boolean;
  cancel: boolean;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  original: {
    name: string;
    rate: number;
    category: string;
  };
}

export interface OriginalService {
  service: number;
  name: string;
  rate: number;
  min: number;
  max: number;
  type: string;
  category: string;
  dripfeed: boolean;
  refill: boolean;
  cancel: boolean;
}

export interface Order {
  id: string;
  userId: string;
  topsmmOrderId: string;
  service: number;
  link: string;
  quantity: number;
  price: number;
  status: "pending" | "in progress" | "completed" | "partial" | "failed";
  params?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  message?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
