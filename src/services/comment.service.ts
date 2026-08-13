import { api } from "@/lib/api";

export const commentService = {
    createComment(trackId: string, content: string) {
        return api.post(`/comments/create/${trackId}`, { content });
    },

    deleteComment(commentId: string) {
        return api.delete(`/comments/delete/${commentId}`);
    }
};