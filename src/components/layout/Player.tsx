export default function Player() {
	return (
		<footer className="fixed bottom-0 left-0 z-40 w-full border-t border-border bg-background/90 backdrop-blur-xl">
			<div className="grid h-[var(--spacing-player)] grid-cols-1 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[1.1fr_1.6fr_1fr] lg:px-8">
				<div className="flex items-center gap-4">
					<div className="h-14 w-14 rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary)_55%,#020617)] shadow-md" />
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-muted">Player</p>
						<p className="font-medium text-foreground">Electric Tide</p>
						<p className="text-sm text-muted">Artist name</p>
					</div>
				</div>

				<div className="flex flex-col items-center justify-center gap-3">
					<div className="flex items-center gap-3 text-foreground">
						<button className="rounded-full bg-surface-hover px-3 py-2 text-sm hover:bg-surface-active">
							⏮
						</button>
						<button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-primary-hover">
							⏵
						</button>
						<button className="rounded-full bg-surface-hover px-3 py-2 text-sm hover:bg-surface-active">
							⏭
						</button>
					</div>
					<div className="h-1.5 w-full max-w-md rounded-full bg-surface-hover">
						<div className="h-full w-2/5 rounded-full bg-primary" />
					</div>
				</div>

				<div className="flex items-center justify-end gap-3 text-sm text-muted">
					<span>00:56</span>
					<div className="h-1.5 w-36 rounded-full bg-surface-hover">
						<div className="h-full w-3/4 rounded-full bg-foreground" />
					</div>
					<span>03:48</span>
				</div>
			</div>
		</footer>
	);
}
