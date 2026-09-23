"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getAdminData } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Input } from "@/components/ui";
import AlbumTable from "@/components/admin/album/AlbumTable";
import { AdminAlbumQuery } from "@/types/album";

export default function AdminAlbumsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<
        "ALL" | "PROCESSING" | "RELEASED" | "BLOCKED"
    >("ALL");

    const [type, setType] = useState<
        "ALL" | "ALBUM" | "SINGLE" | "EP"
    >("ALL");

    const query: AdminAlbumQuery = {
        search: search.trim() || undefined,
        status: status === "ALL" ? undefined : status,
        type: type === "ALL" ? undefined : type,
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: [
            ...queryKeys.admin.albums(),
            query.search,
            query.status,
            query.type,
        ],

        queryFn: async () => {
            const response = await getAdminData.getAllAlbums(query);
            const data = response.data;
            
            return Array.isArray(data) ? data : data.items ?? [];
        },
    });

    const albums = Array.isArray(data) ? data : [];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Albums"
                description="Manage albums, singles and EPs."
            />

            <div className="rounded-xl border border-border bg-surface">
                {/* Filters */}
                <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search albums..."
                            className="pl-9"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target.value as
                                    | "ALL"
                                    | "PROCESSING"
                                    | "RELEASED"
                                    | "BLOCKED"
                            )
                        }
                        className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                    >
                        <option value="ALL">All status</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="RELEASED">Released</option>
                        <option value="BLOCKED">Blocked</option>
                    </select>

                    <select
                        value={type}
                        onChange={(event) =>
                            setType(
                                event.target.value as
                                    | "ALL"
                                    | "ALBUM"
                                    | "SINGLE"
                                    | "EP"
                            )
                        }
                        className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                    >
                        <option value="ALL">All types</option>
                        <option value="ALBUM">Album</option>
                        <option value="SINGLE">Single</option>
                        <option value="EP">EP</option>
                    </select>
                </div>

                {/* Content */}
                {isLoading && (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        Loading albums...
                    </div>
                )}

                {isError && (
                    <div className="p-8 text-center text-sm text-destructive">
                        Failed to load albums.
                    </div>
                )}

                {!isLoading && !isError && albums.length === 0 && (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        No albums found.
                    </div>
                )}

                {!isLoading && !isError && albums.length > 0 && (
                    <AlbumTable albums={albums} />
                )}
            </div>
        </div>
    );
}