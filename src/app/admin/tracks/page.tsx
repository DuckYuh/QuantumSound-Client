"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getAdminData } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Input } from "@/components/ui";
import TrackTable from "@/components/admin/track/TrackTable";
import { AdminTrackQuery } from "@/types/track";

export default function AdminTracksPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<
        "ALL" | "PROCESSING" | "RELEASED" | "BLOCKED"
    >("ALL");

    const query: AdminTrackQuery = {
        search: search.trim() || undefined,
        status: status === "ALL" ? undefined : status,
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: [
            ...queryKeys.admin.tracks(),
            query.search,
            query.status,
        ],

        queryFn: async () => {
            const response = await getAdminData.getAllTracks(query);
            const data = response.data;

            return Array.isArray(data) ? data : data.items ?? [];
        },
    });

    const tracks = Array.isArray(data) ? data : [];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Tracks"
                description="Manage uploaded tracks and their publishing status."
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
                            placeholder="Search tracks..."
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
                </div>

                {/* Content */}
                {isLoading && (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        Loading tracks...
                    </div>
                )}

                {isError && (
                    <div className="p-8 text-center text-sm text-destructive">
                        Failed to load tracks.
                    </div>
                )}

                {!isLoading && !isError && tracks.length === 0 && (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        No tracks found.
                    </div>
                )}

                {!isLoading && !isError && tracks.length > 0 && (
                    <TrackTable tracks={tracks} />
                )}
            </div>
        </div>
    );
}