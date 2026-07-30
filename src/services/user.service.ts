import { api } from "@/lib/api";
import { UpdateUserDto, ChangePasswordDto } from "@/types/user";

export const userService = {
    updateMe(data: UpdateUserDto) {
        return api.patch("/users/me", data);
    },

    getProfile(username: string) {
        return api.get(`/users/${username}`);
    },

    updatePassword(data: ChangePasswordDto) {
        return api.patch("/users/me/password", data);
    },

    uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append("avatar", file);
        return api.post("/users/me/avatar", formData);
    },
}