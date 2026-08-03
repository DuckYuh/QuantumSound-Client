import { api } from "@/lib/api";
import { CreateAlbum } from "@/types/album";

export const albumService = {
    createAlbum(data: CreateAlbum) {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("type", data.type);

        if (data.description) {
            formData.append("description", data.description);
        }
        if (data.coverImage) {
            formData.append("coverImage", data.coverImage);
        }
        return api.post("/albums/create", formData);
    },

    getUserAlbums(username: string) {
        return api.get(`/albums/users/${username}`);
    },

    getAlbumById(albumId: string) {
        return api.get(`/albums/${albumId}`);
    },

    getAlbumBySlug(slug: string) {
        return api.get(`/albums/slug/${slug}`);
    }
}