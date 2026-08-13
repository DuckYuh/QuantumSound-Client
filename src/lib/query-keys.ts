export const queryKeys = {
  album: (id: string) => ["album", id] as const,
  albumTracks: (albumId: string) => ["album-tracks", albumId] as const,
  userAlbums: (username: string) => ["user-albums", username] as const,
  playlist: (id: string) => ["playlist", id] as const,
  playlistTracks: (id: string) => ["playlist-tracks", id] as const,
  userPlaylists: (username: string) => ["user-playlists", username] as const,
  popularTracks: (userId: string) => ["popular-tracks", userId] as const,
  search: (query: string, limit: number) => ["search", query, limit] as const,
};
