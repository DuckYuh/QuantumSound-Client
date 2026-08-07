import { api } from "@/lib/api";
import { CreateAlbum, UpdateAlbumRequest } from "@/types/album";

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

    updateAlbum(albumId: string, data: UpdateAlbumRequest) {
        const formData = new FormData();
        if (data.title) {
            formData.append("title", data.title);
        }
        if (data.type) {
            formData.append("type", data.type);
        }
        if (data.description !== undefined) {
            formData.append("description", data.description ?? "");
        }
        if (data.status) {
            formData.append("status", data.status);
        }
        if (data.coverImage) {
            formData.append("coverImage", data.coverImage);
        }
        return api.patch(`/albums/update/${albumId}`, formData);
    },

    deleteAlbum(albumId: string) {
        return api.delete(`/albums/delete/${albumId}`);
    },

    reOrderAlbumTracks(albumId: string, trackIds: string[]) {
        return api.patch(`/albums/reorder/${albumId}`, { trackIds });
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