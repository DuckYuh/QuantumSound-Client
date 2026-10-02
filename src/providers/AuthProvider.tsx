"use client";

import { createContext, useContext, useEffect, useState, ReactNode, } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from "axios";
import { authService } from "@/services/auth.service";
import { User } from "@/types/user";
import { api } from "@/lib/api";
import { authTokens } from "@/lib/auth-tokens";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User, refreshToken: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, }: { children: ReactNode; }) {
    const [queryClient] = useState(() => new QueryClient());
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function restoreAccessToken(): Promise<boolean> {
        const refreshToken = await authTokens.getRefreshToken();

        if (!refreshToken) {
            return false;
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refresh_token: refreshToken },
            { withCredentials: true },
        );

        const { access_token, refresh_token } = response.data;

        if (!access_token || !refresh_token) {
            throw new Error("Invalid refresh response");
        }

        await authTokens.setRefreshToken(refresh_token);
        await authTokens.setAccessToken(access_token);

        return true;
    }

    async function refreshUser() {
        try {
            let token = await authTokens.getAccessToken();

            if (!token) {
                const restored = await restoreAccessToken();

                if (!restored) {
                    setUser(null);
                    return;
                }

                token = await authTokens.getAccessToken();
            }

            if (!token) {
                throw new Error("Access token was not persisted after refresh");
            }

            const res = await authService.me();
            setUser(res.data);
        } catch (error) {
            // Không xóa token chỉ vì lỗi mạng/server.
            // Axios interceptor sẽ tự refresh nếu nhận 401.
            console.error("Failed to restore authenticated session:", error);
            setUser(null);
        }
    }

    useEffect(() => {
        async function init() {
            await refreshUser();
            setLoading(false);
        }

        init();
    }, []);

    async function login(
        token: string,
        user: User,
        refreshToken: string,
    ) {
        // Lưu refresh token trước để tránh login thành công
        // nhưng chưa có token dùng để refresh phiên.
        await authTokens.setRefreshToken(refreshToken);
        await authTokens.setAccessToken(token);

        setUser(user);

        // The login payload may not contain the latest profile fields, such as
        // the avatar URL. Fetch the canonical user after the tokens are ready.
        try {
            const response = await authService.me();
            setUser(response.data);
        } catch (error) {
            // Keep the user returned by login if the profile request fails.
            console.error("Failed to refresh user after login:", error);
        }
    }

    async function logout() {
        let refreshToken: string | null = null;

        try {
            refreshToken = await authTokens.getRefreshToken();
        } catch (error) {
            console.error("Failed to read refresh token", error);
        }

        // Xóa token và cập nhật UI ngay khi có thể.
        setUser(null);

        try {
            await authTokens.clear();
        } catch (error) {
            console.error("Failed to clear auth tokens", error);
        }

        // Thu hồi session ở backend.
        if (refreshToken) {
            try {
                await api.post("/auth/logout", {
                    refresh_token: refreshToken,
                });
            } catch {
                // Token local đã bị xóa; nếu mạng lỗi,
                // session backend sẽ hết hạn theo TTL.
                console.error("Failed to revoke refresh session");
            }
        }
    }

    function updateUser(data: Partial<User>) {
        setUser(prev =>
            prev ? { ...prev, ...data } : prev
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshUser,
                updateUser,
            }}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </AuthContext.Provider>
    );

}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}