"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@/components/ui";
import { Tag } from "@/types/tag";

type TagFormProps = {
    tag: Tag | null;
    loading?: boolean;
    onSubmitAction: (data: Tag) => void;
    onCloseAction: () => void;
};

export default function TagForm({
    tag,
    loading,
    onSubmitAction,
    onCloseAction,
}: TagFormProps) {
    const [name, setName] = useState("");

    useEffect(() => {
        setName(tag?.name ?? "");
    }, [tag]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) return;

        onSubmitAction({
            ...(tag ?? {}),
            name: trimmedName,
        } as Tag);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-surface w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                        {tag ? "Edit Tag" : "Create Tag"}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {tag
                            ? "Update this tag"
                            : "Add a new music tag"}
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
                            placeholder="e.g. chill"
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
                                : tag
                                    ? "Save Changes"
                                    : "Create"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}