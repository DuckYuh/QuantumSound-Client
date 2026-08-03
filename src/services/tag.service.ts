import { api } from "@/lib/api";

export const tagService = {
    getAllTags() {
        return api.get("/tags");
    },

    getByQuery(query: string) {
        return api.get(`/tags/search`,{
            params: {
                query,
            },
        });
    }
}