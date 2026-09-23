"use client";

import { Pencil, Trash2, Music2 } from "lucide-react";
import { Button } from "@/components/ui";
import { Genre } from "@/types/genre";

type GenreTableProps = {
    genres: Genre[];
    loading?: boolean;
    onEditAction: (genre: Genre) => void;
    onDeleteAction: (genre: Genre) => void;
};

export default function GenreTable({
    genres,
    loading,
    onEditAction,
    onDeleteAction,
}: GenreTableProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[600px]">
                <thead>
                    <tr className="border-b border-border bg-muted/30 text-left text-sm text-muted-foreground">
                        <th className="px-5 py-4">Genre</th>
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
                    ) : genres.length === 0 ? (
                        <tr>
                            <td
                                colSpan={3}
                                className="px-5 py-10 text-center text-muted-foreground"
                            >
                                No genres found
                            </td>
                        </tr>
                    ) : (
                        genres.map((genre) => (
                            <tr
                                key={genre.id}
                                className="border-b border-border last:border-0 hover:bg-muted/20"
                            >
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium">
                                            {genre.name}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-5 py-4 text-sm text-muted-foreground">
                                    {genre.slug ?? "-"}
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEditAction(genre)}
                                        >
                                            <Pencil className="size-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDeleteAction(genre)}
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