"use client";

import { Button, Card, CardTitle, CardContent, CardHeader, CardDescription, CardFooter } from "@/components/ui";
import TrackItem from "./TrackItem";
import { TrackFormData } from "@/types/track";
import { CreateAlbum } from "@/types/album";
import { useState } from "react";

interface TrackListProps {
    album: CreateAlbum;

    tracks: TrackFormData[];

    setTracks: React.Dispatch<
        React.SetStateAction<TrackFormData[]>
    >;

    onBack: () => void;

    onUpload: () => void;

    upLoading: boolean;
}

export default function TrackList({
    album,
    tracks,
    setTracks,
    onBack,
    onUpload,
    upLoading
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
                genres: [],
                tags: [],
            },
        ]);
    };

    const removeTrack = (index: number) => {
        setTracks(
            tracks.filter((_, i) => i !== index)
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Tracks</CardTitle>
                <CardDescription>
                    Add and manage tracks for your album or single.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
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
                    <CardFooter className="flex justify-end space-x-2">
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
                            disabled={upLoading}
                        >
                            {upLoading ? "Uploading..." : "Upload"}
                        </Button>
                    </CardFooter>
                </div>
            </CardContent>
        </Card>
    );
}