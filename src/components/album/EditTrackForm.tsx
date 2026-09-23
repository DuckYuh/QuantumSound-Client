"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button, Input, Textarea } from "@/components/ui";
import { queryKeys } from "@/lib/query-keys";
import { trackService } from "@/services/track.service";
import { Track } from "@/types/track";

interface EditTrackFormProps {
    track: Track | null;
    open: boolean;
    onClose: () => void;
    onEdited?: () => void;
}

export default function EditTrackForm({
    track,
    open,
    onClose,
    onEdited,
}: EditTrackFormProps) {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState(track?.title ?? "");
    const [description, setDescription] = useState(track?.description ?? "");
    const [visibility, setVisibility] = useState<Track["visibility"]>(track?.visibility ?? "PUBLIC");
    const [genres, setGenres] = useState<string[]>(track?.genres ?? []);
    const [tags, setTags] = useState<string[]>(track?.tags ?? []);
    const [genreInput, setGenreInput] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [audio, setAudio] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);

    const updateTrack = useMutation({
        mutationFn: () => {
            if (!track) {
                throw new Error("Track is required");
            }

            return trackService.updateTrack(track.id, {
                title: title.trim(),
                description: description.trim(),
                visibility,
                genres,
                tags,
                audio: audio ?? undefined,
                coverImage: coverImage ?? undefined,
            });
        },
        onSuccess: async () => {
            if (!track) return;

            await queryClient.invalidateQueries({
                queryKey: queryKeys.albumTracks(track.albumId),
            });

            toast.success("Track updated successfully.");
            onEdited?.();
        },
    });

    function addGenre() {
        const value = genreInput.trim();
        if (!value || genres.includes(value)) return;

        setGenres((current) => [...current, value]);
        setGenreInput("");
    }

    function addTag() {
        const value = tagInput.trim();
        if (!value || tags.includes(value)) return;

        setTags((current) => [...current, value]);
        setTagInput("");
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!title.trim()) {
            toast.error("Track title is required.");
            return;
        }

        try {
            await updateTrack.mutateAsync();
        } catch {
            toast.error("Failed to update track.");
        }
    }

    if (!open || !track) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
            role="presentation"
            onClick={onClose}
        >
            <div
                className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-track-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
                    <div>
                        <h2 id="edit-track-title" className="text-xl font-semibold">
                            Edit Track
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Update track details and optional media files.
                        </p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                        <span className="text-xl leading-none">×</span>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="min-h-0 overflow-y-auto">
                    <div className="space-y-4 px-5 py-5 sm:px-6">
                        <div className="space-y-2">
                            <label htmlFor="edit-track-title-input" className="text-sm font-medium">
                                Title
                            </label>
                            <Input
                                id="edit-track-title-input"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Track title"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="edit-track-description" className="text-sm font-medium">
                                Description
                            </label>
                            <Textarea
                                id="edit-track-description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder="Description"
                                className="min-h-24 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="edit-track-visibility" className="text-sm font-medium">
                                Visibility
                            </label>
                            <select
                                id="edit-track-visibility"
                                value={visibility}
                                onChange={(event) => setVisibility(event.target.value as Track["visibility"])}
                                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                            >
                                <option value="PUBLIC">Public</option>
                                <option value="PRIVATE">Private</option>
                                <option value="UNLISTED">Unlisted</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="edit-track-genres" className="text-sm font-medium">
                                Genres
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    id="edit-track-genres"
                                    value={genreInput}
                                    onChange={(event) => setGenreInput(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            addGenre();
                                        }
                                    }}
                                    placeholder="Add a genre"
                                />
                                <Button type="button" variant="outline" onClick={addGenre}>Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {genres.map((genre) => (
                                    <button
                                        key={genre}
                                        type="button"
                                        className="rounded-full border border-border px-3 py-1 text-sm hover:bg-muted"
                                        onClick={() => setGenres((current) => current.filter((item) => item !== genre))}
                                    >
                                        {genre} ×
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="edit-track-tags" className="text-sm font-medium">
                                Tags
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    id="edit-track-tags"
                                    value={tagInput}
                                    onChange={(event) => setTagInput(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            addTag();
                                        }
                                    }}
                                    placeholder="Add a tag"
                                />
                                <Button type="button" variant="outline" onClick={addTag}>Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        className="rounded-full border border-border px-3 py-1 text-sm hover:bg-muted"
                                        onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                                    >
                                        {tag} ×
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="edit-track-audio" className="text-sm font-medium">
                                    Replace audio
                                </label>
                                <Input
                                    id="edit-track-audio"
                                    type="file"
                                    accept="audio/*"
                                    onChange={(event) => setAudio(event.target.files?.[0] ?? null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="edit-track-cover" className="text-sm font-medium">
                                    Replace cover
                                </label>
                                <Input
                                    id="edit-track-cover"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => setCoverImage(event.target.files?.[0] ?? null)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                        <Button type="button" variant="outline" onClick={onClose} disabled={updateTrack.isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={updateTrack.isPending}>
                            Save changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
