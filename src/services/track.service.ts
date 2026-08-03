import { api } from "@/lib/api";
import { UploadTrack } from "@/types/track";

export const trackService = {
    uploadTrack(data: UploadTrack, file: File) {
        const formData = new FormData();

        formData.append("audio", file);

        formData.append("title", data.title);
        formData.append("description", data.description ?? "");
        formData.append("albumId", data.albumId);
        formData.append("visibility", data.visibility);
        for (const genre of data.genres) {
            formData.append("genres", genre);
        }

        for (const tag of data.tags) {
            formData.append("tags", tag);
        }

        if (data.coverImage) {
            formData.append("coverImage", data.coverImage);
        }

        return api.post("/tracks/upload", formData);
    },

    findAlbumTracks(albumId: string) {
        return api.get(`/tracks/albums/${albumId}`);
    },

    getTrackById(trackId: string) {
        return api.get(`/tracks/${trackId}`);
    }
}