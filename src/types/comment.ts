export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        displayName: string;
        avatar?: string | null;
    };
    track: {
        id: string;
        title: string;
    };
}