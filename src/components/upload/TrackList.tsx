"use client";

import { Button } from "@/components/ui";
import TrackItem from "./TrackItem";
import { TrackFormData } from "@/types/track";
import { CreateAlbum } from "@/types/album";

interface TrackListProps {
    album: CreateAlbum;

    tracks: TrackFormData[];

    setTracks: React.Dispatch<
        React.SetStateAction<TrackFormData[]>
    >;

    onBack: () => void;

    onUpload: () => void;
}

export default function TrackList({
    album,
    tracks,
    setTracks,
    onBack,
    onUpload,
}: TrackListProps) {

    const updateTrack = (
        index: number,
        key: keyof TrackFormData,
        value: any
    ) => {
        const newTracks = [...tracks];

        newTracks[index] = {
            ...newTracks[index],
            [key]: value,
        };

        setTracks(newTracks);
    };

    const addTrack = () => {
        setTracks([
            ...tracks,
            {
                title: "",
                description: "",
                visibility: "PUBLIC",
                audio: null,
            },
        ]);
    };

    const removeTrack = (index: number) => {
        setTracks(
            tracks.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="space-y-6">

            <div>

                <h2 className="text-2xl font-bold">
                    Upload Tracks
                </h2>

                <p className="text-muted-foreground">
                    Album: {album.title}
                </p>

            </div>

            {tracks.map((track, index) => (
                <TrackItem
                    key={index}
                    index={index}
                    track={track}
                    canRemove={
                        album.type !== "SINGLE" &&
                        tracks.length > 1
                    }
                    onChange={(key, value) =>
                        updateTrack(index, key, value)
                    }
                    onRemove={() =>
                        removeTrack(index)
                    }
                />
            ))}

            {album.type !== "SINGLE" && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={addTrack}
                >
                    + Add Track
                </Button>
            )}

            <div className="flex justify-between">

                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                >
                    Back
                </Button>

                <Button
                    type="button"
                    onClick={onUpload}
                >
                    Upload
                </Button>

            </div>

        </div>
    );
}