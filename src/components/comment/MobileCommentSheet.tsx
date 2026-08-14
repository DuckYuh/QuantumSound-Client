"use client";

import { useState, useEffect } from "react";
import { X, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { commentService } from "@/services/comment.service";
import { trackService } from "@/services/track.service";
import { toast } from "sonner";
import { Comment } from "@/types/comment";
import { useAuth } from "@/providers/AuthProvider";
import PopHeader from "@/components/bar/PopHeader";

type MobileCommentSheetProps = {
    trackId: string;
    onCloseAction: () => void;
};

export default function MobileCommentSheet({ trackId, onCloseAction }: MobileCommentSheetProps) {
    const [content, setContent] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            await commentService.createComment(trackId, content);
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
            await fetchComments();
        } catch (error) {
            console.error("Failed to delete comment:", error);
            toast.error("Failed to delete comment.");
        }
    }

    return (
        <div className="fixed inset-0 z-[120] lg:hidden">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close comments"
                onClick={onCloseAction}
                className="absolute inset-0 bg-black/50"
            />

            {/* Sheet */}
            <section className="absolute inset-x-0 bottom-0 flex max-h-[80vh] flex-col rounded-t-2xl border-t border-border bg-background shadow-2xl" >
                {/* Header */}
                <PopHeader Head="Comments" onCloseAction={onCloseAction} />

                {/* Comments */}
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
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
                        <div className="flex flex-col gap-4">
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
                                            {(comment.user?.id === user?.id) && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm text-foreground">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input */}
                <form
                    onSubmit={handleSubmit}
                    className="shrink-0 border-t border-border bg-background p-3"
                >
                    <div className="flex items-end gap-2">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write a comment..."
                            rows={1}
                            maxLength={1000}
                            className="min-h-10 max-h-28 flex-1 resize-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                        />

                        <button
                            type="submit"
                            disabled={!content.trim()}
                            className={cn(
                                "flex size-10 shrink-0 items-center justify-center rounded-full",
                                "bg-primary text-primary-foreground",
                                "transition-opacity",
                                "disabled:cursor-not-allowed disabled:opacity-40"
                            )}
                            aria-label="Post comment"
                        >
                            <Send className="size-4" />
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}