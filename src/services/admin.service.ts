import { api } from "@/lib/api";
import { AdminUpdateUserRole, AdminUpdateUserStatus } from "@/types/user";
import { AdminAlbumQuery, AdminUpdateAlbumStatus } from "@/types/album";
import { AdminTrackQuery, AdminUpdateTrackStatus } from "@/types/track";
import { Genre } from "@/types/genre";
import { Tag } from "@/types/tag";

export const getAdminData = {
    getAllUser() {
        return api.get("/admin/users");
    },

    getUserById(userId: string) {
        return api.get(`/admin/users/${userId}`);
    },

    updateUserStatus(userId: string, data: AdminUpdateUserStatus) {
        return api.patch(`/admin/users/${userId}/status`, data);
    },

    updateUserRole(userId: string, data: AdminUpdateUserRole) {
        return api.patch(`/admin/users/${userId}/role`, data);
    },

    deleteUser(userId: string) {
        return api.delete(`/admin/users/${userId}`);
    },

    getAllAlbums(data?: AdminAlbumQuery) {
        return api.get("/admin/albums", { params: data });
    },

    getAlbumById(albumId: string) {
        return api.get(`/admin/albums/${albumId}`);
    },

    updateAlbumStatus(albumId: string, data: AdminUpdateAlbumStatus) {
        return api.patch(`/admin/albums/${albumId}/status`, data);
    },

    deleteAlbum(albumId: string) {
        return api.delete(`/admin/albums/${albumId}`);
    },

    getAllTracks(data?: AdminTrackQuery) {
        return api.get("/admin/tracks", { params: data });
    },

    getTrackById(trackId: string) {
        return api.get(`/admin/tracks/${trackId}`);
    },

    updateTrackStatus(trackId: string, data: AdminUpdateTrackStatus) {
        return api.patch(`/admin/tracks/${trackId}/status`, data);
    },

    deleteTrack(trackId: string) {
        return api.delete(`/admin/tracks/${trackId}`);
    },

    getAllGenres() {
        return api.get("/admin/genres");
    },

    getGenreById(genreId: string) {
        return api.get(`/admin/genres/${genreId}`);
    },

    createGenre(data: Genre) {
        return api.post("/admin/genres", data);
    },

    updateGenre(genreId: string, data: Genre) {
        return api.patch(`/admin/genres/${genreId}`, data);
    },

    deleteGenre(genreId: string) {
        return api.delete(`/admin/genres/${genreId}`);
    },

    getAllTags() {
        return api.get("/admin/tags");
    },

    getTagById(tagId: string) {
        return api.get(`/admin/tags/${tagId}`);
    },

    createTag(data: Tag) {
        return api.post("/admin/tags", data);
    },

    updateTag(tagId: string, data: Tag) {
        return api.patch(`/admin/tags/${tagId}`, data);
    },

    deleteTag(tagId: string) {
        return api.delete(`/admin/tags/${tagId}`);
    }
}