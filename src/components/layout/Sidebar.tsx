import UploadedMusicSideList from "@/components/bar/UploadedMusicSideList";
import PlaylistSideList from "@/components/bar/PlaylistSideList";
import { useAuth } from "@/providers/AuthProvider";

export default function Sidebar() {
	const { user } = useAuth();
	if (!user) {
		return (
			<aside className="fixed left-0 top-[var(--spacing-navbar)] bottom-[var(--spacing-player)] z-30 hidden w-[var(--spacing-sidebar)] overflow-y-auto border-r border-border bg-background/90 p-4 backdrop-blur-xl lg:flex lg:flex-col">
				<div className="mt-2 text-xl font-semibold text-foreground">
					<p className="text-xs uppercase tracking-[0.35em] text-muted">
                        Detailbar
                    </p>
					<h2 className="mt-2 text-xl font-semibold text-foreground">
                        Your Library
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted">
                        Quick access to see your uploaded music and playlists.
                    </p>
				</div>
			</aside>
		);
	}
	return (
		<aside className="fixed left-0 top-[var(--spacing-navbar)] bottom-[var(--spacing-player)] z-30 hidden w-[var(--spacing-sidebar)] overflow-y-auto border-r border-border bg-background/90 p-4 backdrop-blur-xl lg:flex lg:flex-col">
			<div className="mt-2 text-xl font-semibold text-foreground">Your Library</div>

			<UploadedMusicSideList targetUser={user} />
			<PlaylistSideList targetUser={user} />
		</aside>
	);
}
