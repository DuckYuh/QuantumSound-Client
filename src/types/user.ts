export interface User {
    id: string;
    username: string;
    displayName: string;
    email: string;
    avatar: string | null | undefined;
    bio: string | null;
    country: string | null;
    role: "USER" | "ADMIN";
    status: "ACTIVE" | "BANNED";
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserDto {
    username?: string;
    displayName?: string;
    email?: string;
    bio?: string | null;
    country?: string | null;
}

export interface ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}