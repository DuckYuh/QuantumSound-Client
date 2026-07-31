export default function Sidebar() {
	return (
		<aside className="fixed left-0 top-[var(--spacing-navbar)] bottom-[var(--spacing-player)] z-30 hidden w-[var(--spacing-sidebar)] overflow-y-auto border-r border-border bg-background/90 p-4 backdrop-blur-xl lg:flex lg:flex-col">
			<div className="mt-2 text-xl font-semibold text-foreground">Your Library</div>

			<div className="mt-6 rounded-xl border border-border bg-surface-active/80 p-5">
				<p className="text-xs uppercase tracking-[0.35em] text-muted">Uploaded Musics</p>
				<div className="mt-4 space-y-3 text-sm text-muted">
					<p>Focus Flow</p>
					<p>Late Night Drive</p>
					<p>Fresh Releases</p>
				</div>
			</div>

			<div className="mt-6 rounded-xl border border-border bg-surface-active/80 p-5">
				<p className="text-xs uppercase tracking-[0.35em] text-muted">Playlists</p>
				<div className="mt-4 space-y-3 text-sm text-muted">
					<p>Focus Flow</p>
					<p>Late Night Drive</p>
					<p>Fresh Releases</p>
				</div>
			</div>
		</aside>
	);
}
