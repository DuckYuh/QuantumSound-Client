const menuItems = ["Home", "Search", "Library", "Liked Songs"];

export default function Sidebar() {
	return (
		<aside className="fixed left-0 top-[var(--spacing-navbar)] z-30 hidden h-[calc(100vh-var(--spacing-navbar))] w-[var(--spacing-sidebar)] overflow-y-auto border-r border-border bg-background/90 p-4 backdrop-blur-xl lg:flex lg:flex-col">
			<nav className="mt-5 flex flex-col gap-2">
				{menuItems.map((item, index) => (
					<a
						key={item}
						href="#"
						className={`rounded-lg px-4 py-3 text-sm transition ${
							index === 0
								? "bg-primary/15 text-primary-active ring-1 ring-inset ring-primary/20"
								: "text-muted hover:bg-surface-hover hover:text-foreground"
						}`}
					>
						{item}
					</a>
				))}
			</nav>

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
