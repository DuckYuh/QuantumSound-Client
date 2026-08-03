"use client";

import { useEffect, useState } from "react";
import { Input, Textarea, Button } from "@/components/ui";
import { TrackFormData } from "@/types/track";
import { genreService } from "@/services/genre.service";
import { tagService } from "@/services/tag.service";

interface Genre {
    id: string;
    name: string;
}

interface Tag {
    id: string;
    name: string;
}

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
    const [genreQuery, setGenreQuery] = useState("");
    const [tagQuery, setTagQuery] = useState("");
    const [genres, setGenres] = useState<Genre[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchGenres() {
            const res = await genreService.getAllGenres();

            if (isMounted) {
                setGenres(res.data);
            }
        }
        async function fetchTags() {
            const res = await tagService.getAllTags();
            if (isMounted) {
                setTags(res.data);
            }
        }

        fetchGenres();
        fetchTags();

        return () => {
            isMounted = false;
        };
    }, []);

    const genreResults = genreQuery.trim()
        ? genres.filter((genre) =>
              genre.name.toLowerCase().includes(genreQuery.trim().toLowerCase())
          )
        : [];

    const tagResults = tagQuery.trim()
        ? tags.filter((tag) =>
              tag.name.toLowerCase().includes(tagQuery.trim().toLowerCase())
          )
        : [];

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

            <div className="space-y-2">
                <div className="text-sm font-medium">Title</div>
                <Input
                    value={track.title}
                    onChange={(e) =>
                        onChange("title", e.target.value)
                    }
                    placeholder="Track title"
                />
            </div>

            <div className="space-y-2">
                <div className="text-sm font-medium">Description</div>
                <Textarea
                    value={track.description}
                    onChange={(e) =>
                        onChange("description", e.target.value)
                    }
                    placeholder="Description"
                />
            </div>

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

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Genres
                </label>
                <Input
                    placeholder="Search genres..."
                    value={genreQuery}
                    onChange={(e) => setGenreQuery(e.target.value)}
                />
            </div>
            {genreResults.length > 0 && (
                <div className="mt-2 rounded-md border bg-card shadow">
                    {genreResults.map((genre) => (
                        <button
                            key={genre.id}
                            type="button"
                            className="block w-full px-3 py-2 text-left hover:bg-accent"
                            onClick={() => {
                                if (track.genres.includes(genre.name))
                                    return;
                                onChange(
                                    "genres",
                                    [...track.genres, genre.name]
                                );
                                setGenreQuery("");
                            }}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            )}
            {track.genres.map((genre) => (
                <button
                    key={genre}
                    type="button"
                    className="rounded-full border px-3 py-1 text-sm"
                    onClick={() =>
                        onChange(
                            "genres",
                            track.genres.filter(g => g !== genre)
                        )
                    }
                >
                    {genre} ✕
                </button>
            ))}

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Tags
                </label>
                <Input
                    value={tagInput}
                    placeholder="Press Enter to add tag"
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        e.preventDefault();
                        const tag = tagInput.trim();
                        if (!tag) return;
                        if (track.tags.includes(tag)) {
                            setTagInput("");
                            return;
                        }
                        onChange(
                            "tags",
                            [...track.tags, tag]
                        );
                        setTagInput("");
                    }}
                />
            </div>
            {tagResults.length > 0 ? (
                <div className="mt-2 rounded-md border bg-card shadow">
                    {tagResults.map((tag) => (
                        <button
                            key={tag.id}
                            type="button"
                            className="block w-full px-3 py-2 text-left hover:bg-accent"
                            onClick={() => {
                                if (track.tags.includes(tag.name)) return;
                                onChange("tags", [...track.tags, tag.name]);
                                setTagQuery("");
                            }}
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
            ) : tagInput.trim() !== "" ? (
                <div className="mt-2 text-sm text-muted-foreground">
                    No tags found. Press Enter to add a new tag.
                </div>
            ) : null}
            {track.tags.map((tag) => (
                <button
                    key={tag}
                    type="button"
                    className="rounded-full border px-3 py-1 text-sm"
                    onClick={() =>
                        onChange(
                            "tags",
                            track.tags.filter(t => t !== tag)
                        )
                    }
                >
                    {tag} ✕
                </button>
            ))}


            <div className="space-y-2">
                <div className="text-sm font-medium">Audio File</div>
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
            </div>

            {track.audio && (
                <p className="text-sm text-muted-foreground">
                    {track.audio.name}
                </p>
            )}

        </div>
    );
}