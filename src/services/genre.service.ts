import { api } from "@/lib/api";

export const genreService = {
    getAllGenres() {
        return api.get("/genres");
    },

    getByQuery(query: string) {
        return api.get(`/genres/search`,{
            params: {
                query,
            },
        });
    }
}