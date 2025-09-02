import axios from "axios";
// import { toast } from "react-toastify";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://top-smm.vercel.app/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post("/auth/refresh-token", {
            refreshToken,
          });
          const { token } = response.data.data;
          localStorage.setItem("token", token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          console.log(refreshError);
        }
      } else {
        window.location.href = "/login";
      }
    }

    // if (error.response?.data?.message) {
    //   toast.error(error.response.data.message);
    // }

    return Promise.reject(error);
  }
);

export default api;
