"use client";

import { useEffect, useState } from "react";
import { X, Send, Trash2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { commentService } from "@/services/comment.service";
import { trackService } from "@/services/track.service";
import { toast } from "sonner";
import { Comment } from "@/types/comment";

type CommentsPanelProps = {
    trackId: string;
    trackOwnerId: string;
    currentUserId?: string;
    onCloseAction: () => void;
};

export default function CommentsPanel({
    trackId,
    trackOwnerId,
    currentUserId,
    onCloseAction,
}: CommentsPanelProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        try {
            setLoading(true);

            const response = await trackService.getTrackComments(trackId);

            setComments(response.data);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [trackId]);

    async function handleCommentSubmit() {
        if (!content.trim()) return;

        try {
            await commentService.createComment(
                trackId,
                content
            );
            setContent("");
            await fetchComments();
        } catch (error) {
            console.error("Failed to create comment:", error);
            toast.error("Failed to create comment.");
        }
    }

    async function handleDeleteComment(commentId: string) {
        try {
            await commentService.deleteComment(commentId);

            setComments((prev) =>
                prev.filter((comment) => comment.id !== commentId)
            );

            toast.success("Comment deleted.");
        } catch (error) {
            console.error("Failed to delete comment:", error);
            toast.error("Failed to delete comment.");
        }
    }

    return (
        <div className="absolute inset-0 z-40 flex flex-col bg-background">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="text-lg font-semibold">
                    Comments
                </h2>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCloseAction}
                    aria-label="Close comments"
                >
                    <X className="size-5" />
                </Button>
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
                {loading ? (
                    <p className="text-sm text-muted">
                        Loading comments...
                    </p>
                ) : comments.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-muted">
                            No comments yet.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="flex gap-3"
                            >
                                <img
                                    src={comment.user?.avatar ?? "/Logo512x512.png"}
                                    alt={comment.user?.displayName ?? "Unknown user"}
                                    className="size-9 shrink-0 rounded-full object-cover"
                                />

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-bold text-muted-foreground">
                                            {comment.user?.displayName ?? "Unknown user"}
                                        </p>

                                        {(comment.user?.id === currentUserId ||
                                            trackOwnerId === currentUserId) && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                                                onClick={() =>
                                                    handleDeleteComment(comment.id)
                                                }
                                                aria-label="Delete comment"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <p className="mt-1 text-sm leading-2 text-muted-foreground">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-4">
                <div className="flex items-center gap-2">
                    <Input
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                        placeholder="Write a comment..."
                    />

                    <Button
                        size="icon"
                        disabled={!content.trim()}
                        onClick={handleCommentSubmit}
                    >
                        <Send className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}