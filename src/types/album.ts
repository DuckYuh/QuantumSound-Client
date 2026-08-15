export interface Album {
  id: string;
  title: string;
  slug: string;
  type: "ALBUM" | "SINGLE" | "EP";
  description?: string | null;
  coverImage?: string | null;
  status: "PROCESSING" | "RELEASED" | "BLOCKED";
  artistId: string;
  createdAt: string;
  updatedAt: string;
  artist: {
    id: string;
    username: string;
    displayName: string;
  };
  tracks: {
    id: string;
    title: string;
    slug: string;
  }[];
}

export interface CreateAlbum {
  title: string;
  type: "ALBUM" | "SINGLE" | "EP";
  description?: string | null;
  coverImage?: File;
}

export interface UpdateAlbumRequest {
  title?: string;
  type?: "ALBUM" | "SINGLE" | "EP";
  description?: string | null;
  coverImage?: File;
  status?: "PROCESSING" | "RELEASED" | "BLOCKED";
}

export interface ReOrderAlbumTracksRequest {
  trackIds: string[];
}