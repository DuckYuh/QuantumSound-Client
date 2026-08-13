"use client";

import { Track } from "@/types/track";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { useState, useEffect } from "react";
import { trackService } from "@/services/track.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CommentsPanel from "@/components/bar/CommentsPanel";
import { useAuth } from "@/providers/AuthProvider";

type DetailbarProps = {
    track?: Track | null;
};

export default function Detailbar({ track }: DetailbarProps) {
	const [likeCount, setLikeCount] = useState(track?.likeCount || 0);
	const [commentCount, setCommentCount] = useState(0);
	const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const { user } = useAuth();

	useEffect(() => {
        setLikeCount(track?.likeCount ?? 0);
        setIsLiked(false);
        setCommentCount(0);

        if (!track) return;

		const fetchStatus = async () => {
			try {
				const likes = await trackService.getIsLiked(track.id);
				setIsLiked(likes.data);
				const comments = await trackService.getCommentsCount(track.id);
				setCommentCount(comments.data);
			} catch (error) {
				console.error("Failed to get like status:", error);
			}
		};

		fetchStatus();
	}, [track]);

	const handleLike = async () => {
		if (!track) return;

		try {
			if (isLiked) {
				await trackService.unlikeTrack(track.id);
				setIsLiked(false);
				setLikeCount((prev) => Math.max(0, prev - 1));
				toast.success("Track unliked!");
			} else {
				await trackService.likeTrack(track.id);
				setIsLiked(true);
				setLikeCount((prev) => prev + 1);
				toast.success("Track liked!");
			}
		} catch (error) {
			console.error("Failed to toggle like status:", error);
			toast.error("Failed to toggle like status.");
		}
	}

    if (!track) {
        return (
            <aside className="fixed right-0 top-[var(--spacing-navbar)] bottom-[var(--spacing-player)] z-30 hidden w-[var(--spacing-sidebar)] overflow-hidden border-l border-border bg-background/90 backdrop-blur-xl lg:flex lg:flex-col">
                <div className="flex h-full flex-col px-2 py-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-muted">
                        Detailbar
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-foreground">
                        Your music detail
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted">
                        Quick access to see your music details.
                    </p>
                </div>
            </aside>
        );
    }

    return (
        <aside className="fixed right-0 top-[var(--spacing-navbar)] bottom-[var(--spacing-player)] z-30 hidden w-[var(--spacing-sidebar)] overflow-y-auto border-l border-border bg-background/90 backdrop-blur-xl lg:flex lg:flex-col">
            
            {/* Cover */}
            <div className="relative aspect-square w-full shrink-0">
                <img
                    src={
                        track.album.coverImage ??
                        "/Logo512x512.png"
                    }
                    alt={track.title}
                    className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="flex flex-col p-5">
                
                {/* Title */}
                <div>
                    <h2 className="line-clamp-2 text-2xl font-bold">
                        {track.title}
                    </h2>

                    <p className="mt-1 text-muted">
                        {track.artist.displayName}
                    </p>
                </div>

                {/* Description */}
                <div className="mt-7">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                        Description
                    </h3>

                    <p className="text-sm leading-6 text-muted-foreground">
                        {track.description || "No description"}
                    </p>
                </div>

                {/* Album */}
                <div className="mt-7 border-t border-border pt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                        Album
                    </h3>

                    <p className="mt-2 text-sm font-medium">
                        {track.album.title}
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center gap-6 border-t border-border pt-5">
                    <Button
						variant="outline"
						onClick={handleLike}
                        leftIcon={<Heart className="size-4" />}
						className={cn(
							"flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
							isLiked
								? "border-primary bg-primary/10 text-primary"
								: "border-border hover:bg-surface-hover"
						)}
					>
						<span>{likeCount.toLocaleString()}</span>
					</Button>

					<Button
                        variant="outline"
                        leftIcon={<MessageCircle className="size-4" />}
                        onClick={() => setShowComments((prev) => !prev)}
                        className={cn(
                            "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                            showComments
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:bg-surface-hover"
                        )}
                    >
                        <span>{commentCount.toLocaleString()}</span>
                    </Button>

                </div>

            </div>
            {showComments && (
                <CommentsPanel
                    trackId={track.id}
                    trackOwnerId={track.artist.id}
                    currentUserId={user?.id}
                    onCloseAction={() => setShowComments(false)}
                />
            )}
        </aside>
    );
}