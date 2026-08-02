export default function PlaylistSideList() {
    return (
        <div className="mt-6 rounded-xl border border-border bg-surface-active/80 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-muted">Playlists</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
                <p>Focus Flow</p>
                <p>Late Night Drive</p>
                <p>Fresh Releases</p>
            </div>
        </div>
    );
}