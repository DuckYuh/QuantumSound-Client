import UploadedMusicSideList from "@/components/sidebar/UploadedMusicSideList";
import PlaylistSideList from "@/components/sidebar/PlaylistSideList";

export default function Sidebar() {
	return (
		<aside className="fixed left-0 top-[var(--spacing-navbar)] bottom-[var(--spacing-player)] z-30 hidden w-[var(--spacing-sidebar)] overflow-y-auto border-r border-border bg-background/90 p-4 backdrop-blur-xl lg:flex lg:flex-col">
			<div className="mt-2 text-xl font-semibold text-foreground">Your Library</div>

			<UploadedMusicSideList />
			<PlaylistSideList />
		</aside>
	);
}
