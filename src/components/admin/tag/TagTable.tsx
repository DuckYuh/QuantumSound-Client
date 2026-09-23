"use client";

import { Hash, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { Tag } from "@/types/tag";

type TagTableProps = {
    tags: Tag[];
    loading?: boolean;
    onSubmitAction: (data: Tag) => void;
    onDeleteAction: (data: Tag) => void;
};

export default function TagTable({
    tags,
    loading,
    onSubmitAction,
    onDeleteAction,
}: TagTableProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[600px]">
                <thead>
                    <tr className="border-b border-border bg-muted/30 text-left text-sm text-muted-foreground">
                        <th className="px-5 py-4">Tag</th>
                        <th className="px-5 py-4">Slug</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td
                                colSpan={3}
                                className="px-5 py-10 text-center text-muted-foreground"
                            >
                                Loading...
                            </td>
                        </tr>
                    ) : tags.length === 0 ? (
                        <tr>
                            <td
                                colSpan={3}
                                className="px-5 py-10 text-center text-muted-foreground"
                            >
                                No tags found
                            </td>
                        </tr>
                    ) : (
                        tags.map((tag) => (
                            <tr
                                key={tag.id}
                                className="border-b border-border last:border-0 hover:bg-muted/20"
                            >
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                                            <Hash className="size-4" />
                                        </div>

                                        <span className="font-medium">
                                            {tag.name}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-5 py-4 text-sm text-muted-foreground">
                                    {tag.slug ?? "-"}
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onSubmitAction(tag)}
                                        >
                                            <Pencil className="size-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDeleteAction(tag)}
                                            className="text-red-500 hover:text-red-500"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}