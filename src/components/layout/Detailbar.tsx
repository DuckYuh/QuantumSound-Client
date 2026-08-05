import { Track } from "@/types/track";

type DetailbarProps = {
    track?: Track | null;
};

export default function Detailbar ({ track }: DetailbarProps) {
	if (!track) {
		return (
			<aside className="fixed right-0 top-[var(--spacing-navbar)] z-30 hidden h-[calc(100vh-var(--spacing-navbar))] w-[var(--spacing-sidebar)] overflow-y-auto border-l border-border bg-background/90 p-4 backdrop-blur-xl lg:flex lg:flex-col">
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
	
	return (
			<aside className="fixed right-0 top-[var(--spacing-navbar)] z-30 hidden h-[calc(100vh-var(--spacing-navbar))] w-[var(--spacing-sidebar)] overflow-y-auto border-l border-border bg-background/90 p-4 backdrop-blur-xl lg:flex lg:flex-col">
				<div className="overflow-hidden rounded-2xl border border-border bg-surface">
					<div className="relative aspect-square">
						<img
							src={track.album.coverImage ?? "/Logo512x512.png"}
							alt={track.title}
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
					</div>

					{/* Content */}
					<div className="p-5">
						<div className="mt-4">
							<h2 className="line-clamp-2 text-2xl font-bold">
								{track.title}
							</h2>

							<p className="mt-1 text-muted">
								{track.artist.displayName}
							</p>
						</div>
						<div className="mt-6">
							<h3 className="mb-2 text-sm font-semibold uppercase tracking-wider">
								Description
							</h3>

							<p className="text-sm text-muted leading-6">
								{track.description || "No description"}
							</p>
						</div>
					</div>
				</div>

			</aside>
		);
}