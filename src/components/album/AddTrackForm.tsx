'use client';

import { useEffect, useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { TrackFormData } from "@/types/track";
import { genreService } from "@/services/genre.service";
import { tagService } from "@/services/tag.service";
import { trackService } from "@/services/track.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AlbumPopupProps {
    albumId: string;
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void;
}

interface Genre {
    id: string;
    name: string;
}

interface Tag {
    id: string;
    name: string;
}

export default function AddTrackForm({ albumId, open, onClose, onSubmit }: AlbumPopupProps) {
    const [genreQuery, setGenreQuery] = useState("");
    const [tagQuery, setTagQuery] = useState("");
    const [genres, setGenres] = useState<Genre[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [tagInput, setTagInput] = useState(""); 
    const [submitting, setSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const [track, setTrack] = useState<TrackFormData>(
        {
            title: "",
            description: "",
            visibility: "PUBLIC",
            audio: null,
            genres: [],
            tags: [],
        },
    );

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!track.title.trim()) {
            toast.error("Track title is required.");
            return;
        }
        if (!track.audio) {
            toast.error("Audio file is required.");
            return;
        }
        setSubmitting(true);
        try {
            await trackService.uploadTrack({
                title: track.title,
                description: track.description,
                visibility: track.visibility,
                albumId,
                genres: track.genres,
                tags: track.tags,
            }, track.audio);
            await queryClient.invalidateQueries({
                queryKey: ["album-tracks", albumId],
            });
            toast.success("Track added successfully!");
            onSubmit?.();
        } catch (error) {
            toast.error("Failed to add track.");
        } finally {
            setSubmitting(false);
        }
    }
    
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
    
    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
            role="presentation"
            onClick={onClose}
        >
            <div
                className="w-full max-w-3xl rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-4 overflow-y-auto max-h-[60vh]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-track-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 id="add-track-title" className="text-xl font-semibold">
                            Add Track
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                            Add a new track to the album.
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close popup">
                        <span className="text-xl leading-none">×</span>
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Title</div>
                        <Input
                            value={track.title}
                            onChange={(e) =>
                                setTrack({ ...track, title: e.target.value })
                            }
                            placeholder="Track title"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm font-medium">Description</div>
                        <Textarea
                            value={track.description}
                            onChange={(e) =>
                                setTrack({ ...track, description: e.target.value })
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
                                setTrack({ ...track, visibility: e.target.value as TrackFormData["visibility"] })
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
                                        setTrack({ ...track, genres: [...track.genres, genre.name] });
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
                                setTrack({ ...track, genres: track.genres.filter(g => g !== genre) })
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
                                setTrack({ ...track, tags: [...track.tags, tag] });
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
                                        setTrack({ ...track, tags: [...track.tags, tag.name] });
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
                                setTrack({ ...track, tags: track.tags.filter(t => t !== tag) })
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
                                setTrack({ ...track, audio: e.target.files?.[0] ?? null })
                            }
                        />
                    </div>

                    {track.audio && (
                        <p className="text-sm text-muted-foreground">
                            {track.audio.name}
                        </p>
                    )}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={submitting} disabled={!track.title.trim() || !track.audio} >
                            Confirm
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}