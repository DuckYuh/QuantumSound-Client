import { api } from "@/lib/api";
import {
    AppPlatform,
} from "@/types/app-release";

export const appReleaseService = {
    getAll() {
        return api.get("/app-releases");
    },

    getByPlatform(platform: AppPlatform) {
        return api.get(`/app-releases/${platform}`);
    },
};