import { api } from "@/lib/api";
import { CreateAlbum } from "@/types/album";

export const albumService = {
    createAlbum(data: CreateAlbum) {
        return api.post("/albums/create", data);
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