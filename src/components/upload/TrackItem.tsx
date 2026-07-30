"use client";

import { Input, Textarea, Button } from "@/components/ui";
import { TrackFormData } from "@/types/track";

interface TrackItemProps {
    index: number;
    track: TrackFormData;
    canRemove: boolean;

    onChange: <K extends keyof TrackFormData>(
        key: K,
        value: TrackFormData[K]
    ) => void;

    onRemove: () => void;
}

export default function TrackItem({
    index,
    track,
    canRemove,
    onChange,
    onRemove,
}: TrackItemProps) {
    return (
        <div className="space-y-4 rounded-lg border p-5">

            <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                    Track {index + 1}
                </h3>

                {canRemove && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={onRemove}
                    >
                        Remove
                    </Button>
                )}
            </div>

            <Input
                value={track.title}
                onChange={(e) =>
                    onChange("title", e.target.value)
                }
                placeholder="Track title"
            />

            <Textarea
                value={track.description}
                onChange={(e) =>
                    onChange("description", e.target.value)
                }
                placeholder="Description"
            />

            <div className="space-y-2">

                <label className="text-sm font-medium">
                    Visibility
                </label>

                <select
                    className="h-10 w-full rounded-md border bg-background px-3"
                    value={track.visibility}
                    onChange={(e) =>
                        onChange(
                            "visibility",
                            e.target.value as TrackFormData["visibility"]
                        )
                    }
                >
                    <option value="PUBLIC">
                        Public
                    </option>

                    <option value="PRIVATE">
                        Private
                    </option>

                    <option value="UNLISTED">
                        Unlisted
                    </option>
                </select>

            </div>

            <Input
                type="file"
                accept="audio/*"
                onChange={(e) =>
                    onChange(
                        "audio",
                        e.target.files?.[0] ?? null
                    )
                }
            />

            {track.audio && (
                <p className="text-sm text-muted-foreground">
                    {track.audio.name}
                </p>
            )}

        </div>
    );
}