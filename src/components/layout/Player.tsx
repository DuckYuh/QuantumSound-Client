"use client";

import { useAudio } from "@/providers/AudioProvider";
import PlayerControls from "@/components/player/PlayerControls";
import PlayerProgress from "@/components/player/PlayerProgress";
import VolumeControl from "@/components/player/PlayerVolume";

export default function Player() {
	const { currentTrack } = useAudio();

    if (!currentTrack) return (
		<div className="fixed bottom-0 left-0 right-0 h-24 border-t border-border bg-background px-6 flex items-center justify-between z-50">

            {/* Left */}
            <div className="flex items-center gap-3 w-1/4">
                <div className="h-14 w-14 rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary)_55%,#020617)] shadow-md" />

                <div>
                    <div className="font-medium">
                        Title
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Artist Name
                    </div>
                </div>
            </div>

            {/* Center */}
            <div className="flex flex-col items-center gap-2 flex-1">
                <PlayerControls />
                <PlayerProgress />
            </div>

            {/* Right */}
            <div className="w-1/4 flex justify-end">
                <VolumeControl />
            </div>
        </div>
	);

	return (
        <div className="fixed bottom-0 left-0 right-0 h-24 border-t border-border bg-background px-6 flex items-center justify-between z-50">

            {/* Left */}
            <div className="flex items-center gap-3 w-1/4">
				{currentTrack ? (
					<>
						<div className="h-14 w-14 rounded bg-muted overflow-hidden">
							{currentTrack.coverImage ? (
								<img
									src={currentTrack.coverImage}
									alt={currentTrack.title}
									className="w-full h-full object-cover"
								/>
							) : (
								<img
                                    src={currentTrack.album.coverImage ?? "/Logo512x512.png"}
                                    alt={currentTrack.title}
                                    className="w-full h-full object-cover"
                                />
							)}
						</div>
						<div>
							<div className="font-medium">
								{currentTrack.title}
							</div>
							<div className="text-sm text-muted-foreground">
								{currentTrack.artist.displayName}
							</div>
						</div>
					</>
				) : (
					<>
						<div className="h-14 w-14 rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary)_55%,#020617)] shadow-md" />
						<div>
							<div className="font-medium">Title</div>
							<div className="text-sm text-muted-foreground">Artist Name</div>
						</div>
					</>
				)}
            </div>

            {/* Center */}
            <div className="flex flex-col items-center gap-2 flex-1">
                <PlayerControls />
                <PlayerProgress />
            </div>

            {/* Right */}
            <div className="w-1/4 flex justify-end">
                <VolumeControl />
            </div>
        </div>
    );
}
