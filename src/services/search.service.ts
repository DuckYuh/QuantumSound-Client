import { api } from "@/lib/api";

export const searchService = {
    search(query: string) {
        return api.get(`/search`,{
            params: {
                query,
            },
        });
    },
}