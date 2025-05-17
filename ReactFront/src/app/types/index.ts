export interface Post {
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
    likes: number;
    comments?: Comment[] | null;
    sentiment?: string;
    username: string;
}

export interface Comment {
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
    postId: string;
    username: string;
    sentiment: string;
}
