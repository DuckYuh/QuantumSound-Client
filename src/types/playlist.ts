export interface PlaylistTrack {
  id: string;
  trackId: string;
  playlistId: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  owner: {
    id: string;
    username: string;
    displayName: string;
  }
  tracks: PlaylistTrack[]
}

export interface CreatePlaylistRequest {
  title: string;
  description?: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
}

export interface AddTrackToPlaylistRequest {
  trackId: string;
  playlistId: string;
}

export interface UpdatePlaylistRequest {
  title?: string;
  description?: string;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  coverImage?: File;
}