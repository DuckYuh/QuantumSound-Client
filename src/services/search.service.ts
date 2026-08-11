import { api } from "@/lib/api";

export const searchService = {
    search(query: string, limit: number = 10) {
        return api.get(`/search`,{
            params: {
                query,
                limit,
            },
        });
    },
}