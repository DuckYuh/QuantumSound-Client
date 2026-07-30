export interface Track {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  status: "PROCESSING" | "READY" | "BLOCKED" | "DELETED";
  trackNumber: number | null;
  duration: number;
  albumId: string;
  artistId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadTrack {
  title: string;
  description?: string | null;
  coverImage?: File;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  albumId: string;
}

export interface TrackFormData {
  title: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  audio: File | null;
  coverImage?: File;
}