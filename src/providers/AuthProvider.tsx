"use client";   

import { createContext, useContext, useEffect, useState, ReactNode, } from "react";
import { authService } from "@/services/auth.service";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, }: { children: ReactNode; }) {
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

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );

}

export function useAuth(){
    const context =
        useContext(AuthContext);

    if(!context){
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}