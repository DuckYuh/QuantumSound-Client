import UploadedMusic from "@/components/library/UploadedMusic";
import LikedTrack from "@/components/library/LikedTrack";
import Playlist from "@/components/library/Playlist";

export default function LibraryPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
                    Your Music Library
                </h1>

                <p className="text-lg text-muted-foreground">
                    Explore your uploaded music, playlists, and liked tracks all in one place.
                </p>
            </div>
            <div className="mt-8 space-y-4">
                <UploadedMusic />
                <Playlist />
                <LikedTrack />
            </div>
        </div>
    );
}