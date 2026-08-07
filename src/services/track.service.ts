import { api } from "@/lib/api";
import { UpdateTrackRequest, UploadTrack } from "@/types/track";

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

    updateTrack(trackId: string, data: UpdateTrackRequest) {
        const formData = new FormData();

        if (data.title) {
            formData.append("title", data.title);
        }
        if (data.description !== undefined) {
            formData.append("description", data.description ?? "");
        }
        if (data.coverImage) {
            formData.append("coverImage", data.coverImage);
        }
        if (data.visibility) {
            formData.append("visibility", data.visibility);
        }
        if (data.status) {
            formData.append("status", data.status);
        }
        if (data.genres) {
            for (const genre of data.genres) {
                formData.append("genres", genre);
            }
        }
        if (data.tags) {
            for (const tag of data.tags) {
                formData.append("tags", tag);
            }
        }
        return api.patch(`/tracks/update/${trackId}`, formData);
    },

    deleteTrack(trackId: string) {
        return api.delete(`/tracks/delete/${trackId}`);
    },

    findAlbumTracks(albumId: string) {
        return api.get(`/tracks/albums/${albumId}`);
    },

    getTrackById(trackId: string) {
        return api.get(`/tracks/${trackId}`);
    }
}