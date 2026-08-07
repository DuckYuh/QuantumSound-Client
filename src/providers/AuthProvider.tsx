"use client";   

import { createContext, useContext, useEffect, useState, ReactNode, } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { authService } from "@/services/auth.service";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, }: { children: ReactNode; }) {
    const [queryClient] = useState(() => new QueryClient());
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function refreshUser() {
        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setUser(null);
                return;
            }

            const res = await authService.me();
            setUser(res.data);
        } catch(error) {
            console.log("Auth failed");
            localStorage.removeItem(
                "access_token"
            );
            setUser(null);
        }
    }

    useEffect(() => {
        async function init(){
            await refreshUser();
            setLoading(false);
        }

        init();
    }, []);

    function login( token:string, user:User ) {
        localStorage.setItem(
            "access_token",
            token
        );
        setUser(user);
    }

    function logout() {
        localStorage.removeItem(
            "access_token"
        );
        setUser(null);
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

    if(!context){
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}