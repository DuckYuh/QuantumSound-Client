"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Input, Button } from "@/components/ui";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import TagTable from "@/components/admin/tag/TagTable";
import TagForm from "@/components/admin/tag/TagForm";

import { Tag } from "@/types/tag";
import { getAdminData } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";

export default function AdminTagsPage() {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: [...queryKeys.admin.tags(), search],
        queryFn: () => getAdminData.getAllTags(),
    });

    const responseData = data?.data;
    const tags: Tag[] = Array.isArray(responseData)
        ? responseData
        : responseData?.items ?? [];

    const filteredTags = tags.filter((tag) =>
        tag.name.toLowerCase().includes(search.toLowerCase())
    );

    const createMutation = useMutation({
        mutationFn: (data: Tag) =>
            getAdminData.createTag(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.admin.tags(),
            });

            toast.success("Tag created successfully");

            setFormOpen(false);
        },

        onError: () => {
            toast.error("Failed to create tag");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            tagId,
            data,
        }: {
            tagId: string;
            data: Tag;
        }) => getAdminData.updateTag(tagId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.admin.tags(),
            });

            toast.success("Tag updated successfully");

            setFormOpen(false);
            setEditingTag(null);
        },

        onError: () => {
            toast.error("Failed to update tag");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (tagId: string) =>
            getAdminData.deleteTag(tagId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.admin.tags(),
            });

            toast.success("Tag deleted successfully");
        },

        onError: () => {
            toast.error("Failed to delete tag");
        },
    });

    const handleSubmit = (data: Tag) => {
        if (editingTag) {
            updateMutation.mutate({
                tagId: editingTag.id,
                data,
            });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (tag: Tag) => {
        setEditingTag(tag);
        setFormOpen(true);
    };

    const handleDelete = (tag: Tag) => {
        if (!confirm(`Delete tag "${tag.name}"?`)) return;

        deleteMutation.mutate(tag.id);
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Tags"
                description="Manage music tags"
                action={
                    <Button
                        onClick={() => {
                            setEditingTag(null);
                            setFormOpen(true);
                        }}
                    >
                        <Plus className="mr-2 size-4" />
                        Add Tag
                    </Button>
                }
            />

            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tags..."
                    className="pl-9"
                />
            </div>

            <TagTable
                tags={filteredTags}
                loading={isLoading}
                onSubmitAction={handleEdit}
                onDeleteAction={handleDelete}
            />

            {formOpen && (
                <TagForm
                    tag={editingTag}
                    loading={
                        createMutation.isPending ||
                        updateMutation.isPending
                    }
                    onSubmitAction={handleSubmit}
                    onCloseAction={() => {
                        setFormOpen(false);
                        setEditingTag(null);
                    }}
                />
            )}
        </div>
    );
}