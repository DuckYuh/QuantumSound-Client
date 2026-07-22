export default function Detailbar () {
  return (
		<aside className="fixed right-0 top-[var(--spacing-navbar)] z-30 hidden h-[calc(100vh-var(--spacing-navbar))] w-[var(--spacing-sidebar)] overflow-y-auto border-r border-border bg-background/90 p-4 backdrop-blur-xl lg:flex lg:flex-col">
			<div className="rounded-xl border border-border bg-surface/80 p-5">
				<p className="text-xs uppercase tracking-[0.35em] text-muted">Detailbar</p>
				<h2 className="mt-2 text-xl font-semibold text-foreground">Your music detail</h2>
				<p className="mt-2 text-sm leading-6 text-muted">
					Quick access to see your music details.
				</p>
			</div>

		</aside>
	);
}