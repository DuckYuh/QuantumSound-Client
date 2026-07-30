"use client";

import { ChangeEvent, FormEvent } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { Album, CreateAlbum } from "@/types/album";

interface AlbumFormProps {
    album: CreateAlbum;
    setAlbum: React.Dispatch<React.SetStateAction<CreateAlbum>>;
    onNext: () => void;
}

export default function AlbumForm({ album, setAlbum, onNext }: AlbumFormProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setAlbum((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        setAlbum((prev) => ({
            ...prev,
            coverImage: file,
        }));
    };

    const handleTypeChange = (type: Album["type"]) => {
        setAlbum((prev) => ({
            ...prev,
            type,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!album.title.trim()) {
            return;
        }

        onNext();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold">
                Album Information
            </h2>

            <Input
                name="title"
                value={album.title}
                onChange={handleChange}
                placeholder="My First Album"
                required
            />

            <Textarea
                name="description"
                value={album.description ?? ""}
                onChange={handleChange}
                placeholder="Tell listeners about this release..."
            />

            <div className="space-y-2">
                <p className="text-sm font-medium">
                    Release Type
                </p>

                <div className="flex gap-3">
                    {(["SINGLE", "EP", "ALBUM"] as Album["type"][]).map(
                        (type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => handleTypeChange(type)}
                                className={`rounded-lg border px-4 py-2 transition ${
                                    album.type === type
                                        ? "border-primary bg-primary text-white"
                                        : "border-border"
                                }`}
                            >
                                {type}
                            </button>
                        )
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Cover Image
                </label>

                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                />

                {album.coverImage && (
                    <p className="text-sm text-muted-foreground">
                        {album.coverImage.name}
                    </p>
                )}
            </div>

            <div className="flex justify-end">
                <Button type="submit">
                    Next
                </Button>
            </div>
        </form>
    );
}