export interface Album {
  id: string;
  title: string;
  slug: string;
  type: "ALBUM" | "SINGLE" | "EP";
  description?: string | null;
  coverImage?: string | null;
  status: "PROCESSING" | "READY" | "BLOCKED" | "DELETED";
  artistId: string;
  createdAt: string;
  updatedAt: string;
  artist: {
    id: string;
    username: string;
  };
}

export interface CreateAlbum {
  title: string;
  type: "ALBUM" | "SINGLE" | "EP";
  description?: string | null;
  coverImage?: File;
}