import { api } from "@/lib/api";
import { LoginDto, RegisterDto } from "@/types/auth";

export const authService = {
    login(data: LoginDto) {
        return api.post("/auth/login", data);
    },

    register(data: RegisterDto) {
        return api.post("/auth/register", data);
    },

    me() {
        return api.get("/auth/me");
    },
};