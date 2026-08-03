export interface Track {
  id: string;
  title: string;
  slug: string;
  audioUrl: string;
  description?: string | null;
  coverImage?: string | null;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  status: "PROCESSING" | "READY" | "BLOCKED" | "DELETED";
  trackNumber: number | null;
  duration: number;
  genres: string[];
  tags: string[];
  albumId: string;
  artistId: string;
  createdAt: string;
  updatedAt: string;
  artist: {
        id: string;
        username: string;
        displayName: string;
        avatar?: string | null;
    };
    album: {
        id: string;
        title: string;
        slug: string;
        coverImage?: string | null;
    };
}

export interface UploadTrack {
  title: string;
  description?: string | null;
  coverImage?: File;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  albumId: string;
  genres: string[];
  tags: string[];
}

export interface TrackFormData {
  title: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  audio: File | null;
  coverImage?: File;
  genres: string[];
  tags: string[];
}