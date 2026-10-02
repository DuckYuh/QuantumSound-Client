
import axios, {
  type InternalAxiosRequestConfig,
} from "axios";

import { authTokens } from "@/lib/auth-tokens";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;

async function clearAuthAndRedirect() {
  try {
    await authTokens.clear();
  } catch (error) {
    console.error("Failed to clear stored auth tokens", error);
  }

  if (
    typeof window !== "undefined" &&
    window.location.pathname !== "/login"
  ) {
    window.location.href = "/login";
  }
}

// Gắn access token hiện tại vào request.
api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const token = await authTokens.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config as RetryableRequestConfig | undefined;

    if (
      typeof window === "undefined" ||
      error.response?.status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    // Không refresh vô hạn nếu chính endpoint refresh bị 401.
    if (originalRequest.url?.includes("/auth/refresh")) {
      await clearAuthAndRedirect();
      return Promise.reject(error);
    }

    // Mỗi request chỉ được retry một lần.
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Các request 401 đồng thời sẽ dùng chung một lần refresh.
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = await authTokens.getRefreshToken();

          if (!refreshToken) {
            throw new Error("Refresh token not found");
          }

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")}/auth/refresh`,
            { refresh_token: refreshToken },
            { withCredentials: true },
          );

          const {
            access_token,
            refresh_token,
          } = response.data;

          if (!access_token || !refresh_token) {
            throw new Error("Invalid refresh response");
          }

          // Lưu cả hai token trước khi retry request.
          await authTokens.setRefreshToken(refresh_token);
          await authTokens.setAccessToken(access_token);

          return access_token as string;
        })().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      // Gửi lại request ban đầu bằng access token mới.
      return api(originalRequest);
    } catch (refreshError) {
      if (axios.isAxiosError(refreshError)) {
        console.error("[Auth] Refresh failed:", {
          status: refreshError.response?.status,
          data: refreshError.response?.data,
          message: refreshError.message,
        });
      } else {
        console.error("[Auth] Refresh failed:", refreshError);
      }

      await clearAuthAndRedirect();
      return Promise.reject(refreshError);
    }
  },
);