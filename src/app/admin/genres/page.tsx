"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Input, Button } from "@/components/ui";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import GenreTable from "@/components/admin/genre/GenreTable";
import GenreForm from "@/components/admin/genre/GenreForm";
import { getAdminData } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { Genre } from "@/types/genre";
import { toast } from "sonner";

export default function AdminGenresPage() {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: [...queryKeys.admin.genres(), search],
        queryFn: () => getAdminData.getAllGenres(),
    });

    const responseData = data?.data;
    const genres: Genre[] = Array.isArray(responseData)
        ? responseData
        : responseData?.items ?? [];

    const filteredGenres = genres.filter((genre) =>
        genre.name.toLowerCase().includes(search.toLowerCase())
    );

    const createMutation = useMutation({
        mutationFn: (data: Genre) => getAdminData.createGenre(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.admin.genres(),
            });
            toast.success("Genre created successfully");
            setFormOpen(false);
        },
        onError: () => {
            toast.error("Failed to create genre");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            genreId,
            data,
        }: {
            genreId: string;
            data: Genre;
        }) => getAdminData.updateGenre(genreId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.admin.genres(),
            });
            toast.success("Genre updated successfully");
            setFormOpen(false);
            setEditingGenre(null);
        },
        onError: () => {
            toast.error("Failed to update genre");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (genreId: string) =>
            getAdminData.deleteGenre(genreId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.admin.genres(),
            });
            toast.success("Genre deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete genre");
        },
    });

    const handleSubmit = (data: Genre) => {
        if (editingGenre) {
            updateMutation.mutate({
                genreId: editingGenre.id,
                data,
            });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (genre: Genre) => {
        setEditingGenre(genre);
        setFormOpen(true);
    };

    const handleDelete = (genre: Genre) => {
        if (!confirm(`Delete genre "${genre.name}"?`)) return;
        deleteMutation.mutate(genre.id);
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Genres"
                description="Manage music genres"
                action={
                    <Button
                        onClick={() => {
                            setEditingGenre(null);
                            setFormOpen(true);
                        }}
                    >
                        <Plus className="mr-2 size-4" />
                        Add Genre
                    </Button>
                }
            />

            <div className="flex">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search genres..."
                        className="pl-9"
                    />
                </div>
            </div>

            <GenreTable
                genres={filteredGenres}
                loading={isLoading}
                onEditAction={handleEdit}
                onDeleteAction={handleDelete}
            />

            {formOpen && (
                <GenreForm
                    genre={editingGenre}
                    loading={
                        createMutation.isPending ||
                        updateMutation.isPending
                    }
                    onSubmitAction={handleSubmit}
                    onCloseAction={() => {
                        setFormOpen(false);
                        setEditingGenre(null);
                    }}
                />
            )}
        </div>
    );
}