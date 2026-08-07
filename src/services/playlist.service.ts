import { api } from "@/lib/api";
import { CreatePlaylistRequest, AddTrackToPlaylistRequest, UpdatePlaylistRequest } from "@/types/playlist";

export const playlistService = {
    createPlaylist(data: CreatePlaylistRequest) {
        return api.post("/playlists/create", data);
    },

    addTrack(data: AddTrackToPlaylistRequest) {
        return api.post("/playlists/add-track", data);
    },

    updatePlaylist(playlistId: string, data: UpdatePlaylistRequest) {
        const formData = new FormData();
        if (data.title?.trim()) {
            formData.append("title", data.title.trim());
        }

        if (data.description?.trim()) {
            formData.append("description", data.description.trim());
        }

        if (data.visibility) {
            formData.append("visibility", data.visibility);
        }

        if (data.coverImage instanceof File) {
            formData.append("coverImage", data.coverImage);
        }
        return api.patch(`/playlists/update/${playlistId}`, formData);
    },

    deletePlaylist(playlistId: string) {
        return api.delete(`/playlists/delete/${playlistId}`);
    },

    deleteTrackFromPlaylist(playlistId: string, trackId: string) {
        return api.delete(`/playlists/remove-track/${trackId}`, { data: { playlistId } });
    },

    getAllPlaylists() {
        return api.get("/playlists/all");
    },

    getUserPlaylists(username: string) {
        return api.get(`/playlists/user/${username}`);
    },

    getPlaylist(playlistId: string) {
        return api.get(`/playlists/${playlistId}`);
    }
}