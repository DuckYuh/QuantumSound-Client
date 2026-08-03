export interface SearchResult {
    tracks: {
        id: string;
        title: string;
        slug: string;
        artist: {
            id: string;
            username: string;
            displayName: string;
        };
        album: {
            id: string;
            title: string;
            slug: string;
            coverImage: string;
        }
    }[];
    albums: {
        id: string;
        title: string;
        coverImage: string;
        slug: string;
        artist: {
            id: string;
            username: string;
            displayName: string;
        }
    }[];
    users: {
        id: string;
        username: string;
        displayName: string;
        avatar: string;
    }[];
}