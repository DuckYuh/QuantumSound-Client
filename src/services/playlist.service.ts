import { api } from "@/lib/api";
import { CreatePlaylistRequest, AddTrackToPlaylistRequest } from "@/types/playlist";

export const playlistService = {
    createPlaylist(data: CreatePlaylistRequest) {
        return api.post("/playlists/create", data);
    },

    addTrack(data: AddTrackToPlaylistRequest) {
        return api.post("/playlists/add-track", data);
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