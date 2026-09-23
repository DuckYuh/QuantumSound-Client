"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@/components/ui";
import { Genre } from "@/types/genre";

type GenreFormProps = {
    genre: Genre | null;
    loading?: boolean;
    onSubmitAction: (data: Genre) => void;
    onCloseAction: () => void;
};

export default function GenreForm({
    genre,
    loading,
    onSubmitAction,
    onCloseAction,
}: GenreFormProps) {
    const [name, setName] = useState("");

    useEffect(() => {
        setName(genre?.name ?? "");
    }, [genre]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) return;

        onSubmitAction({
            ...(genre ?? {}),
            name: trimmedName,
        } as Genre);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-surface w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                        {genre ? "Edit Genre" : "Create Genre"}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {genre
                            ? "Update this genre"
                            : "Add a new music genre"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Name
                        </label>

                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Rock"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCloseAction}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={!name.trim() || loading}
                        >
                            {loading
                                ? "Saving..."
                                : genre
                                    ? "Save Changes"
                                    : "Create"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}