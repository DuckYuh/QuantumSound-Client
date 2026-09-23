"use client";

import { useState } from "react";
import {
    Ban,
    Check,
    MoreHorizontal,
    Trash2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Dropdown } from "@/components/ui";
import { getAdminData } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { Track } from "@/types/track";

type TrackActionsProps = {
    track: Track;
};

type ConfirmAction =
    | "release"
    | "block"
    | "processing"
    | "delete"
    | null;

export default function TrackActions({
    track,
}: TrackActionsProps) {
    const queryClient = useQueryClient();

    const [confirmAction, setConfirmAction] =
        useState<ConfirmAction>(null);

    const updateStatusMutation = useMutation({
        mutationFn: (status: Track["status"]) =>
            getAdminData.updateTrackStatus(track.id, {
                status,
            }),

        onSuccess: () => {
            toast.success("Track status updated successfully");

            queryClient.invalidateQueries({
                queryKey: queryKeys.admin.tracks(),
            });

            setConfirmAction(null);
        },

        onError: () => {
            toast.error("Failed to update track status");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () =>
            getAdminData.deleteTrack(track.id),

        onSuccess: () => {
            toast.success("Track deleted successfully");

            queryClient.invalidateQueries({
                queryKey: queryKeys.admin.tracks(),
            });

            setConfirmAction(null);
        },

        onError: () => {
            toast.error("Failed to delete track");
        },
    });

    const handleConfirm = () => {
        if (confirmAction === "release") {
            updateStatusMutation.mutate("RELEASED");
        }

        if (confirmAction === "block") {
            updateStatusMutation.mutate("BLOCKED");
        }

        if (confirmAction === "processing") {
            updateStatusMutation.mutate("PROCESSING");
        }

        if (confirmAction === "delete") {
            deleteMutation.mutate();
        }
    };

    const isPending =
        updateStatusMutation.isPending ||
        deleteMutation.isPending;

    const items = [
        ...(track.status !== "RELEASED"
            ? [
                  {
                      label: "Release track",
                      icon: <Check className="size-4" />,
                      onClick: () =>
                          setConfirmAction("release"),
                  },
              ]
            : []),

        ...(track.status !== "BLOCKED"
            ? [
                  {
                      label: "Block track",
                      icon: <Ban className="size-4" />,
                      danger: true,
                      onClick: () =>
                          setConfirmAction("block"),
                  },
              ]
            : []),

        ...(track.status !== "PROCESSING"
            ? [
                  {
                      label: "Set processing",
                      onClick: () =>
                          setConfirmAction("processing"),
                  },
              ]
            : []),

        {
            label: "Delete track",
            icon: <Trash2 className="size-4" />,
            danger: true,
            onClick: () =>
                setConfirmAction("delete"),
        },
    ];

    return (
        <>
            <Dropdown
                className="bg-surface"
                trigger={
                    <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={`Actions for ${track.title}`}
                    >
                        <MoreHorizontal className="size-4" />
                    </button>
                }
                items={items}
                placement="bottom"
                portal
            />

            {confirmAction && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl">
                        <h2 className="text-lg font-semibold">
                            {confirmAction === "release" &&
                                "Release track?"}

                            {confirmAction === "block" &&
                                "Block track?"}

                            {confirmAction === "processing" &&
                                "Set track to processing?"}

                            {confirmAction === "delete" &&
                                "Delete track?"}
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {confirmAction === "release" &&
                                `Are you sure you want to release "${track.title}"?`}

                            {confirmAction === "block" &&
                                `Are you sure you want to block "${track.title}"?`}

                            {confirmAction === "processing" &&
                                `Are you sure you want to set "${track.title}" back to processing?`}

                            {confirmAction === "delete" &&
                                `This will delete "${track.title}". This action cannot be undone.`}
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() =>
                                    setConfirmAction(null)
                                }
                                className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={isPending}
                                onClick={handleConfirm}
                                className={
                                    confirmAction === "delete" ||
                                    confirmAction === "block"
                                        ? "rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                                        : "rounded-md bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                                }
                            >
                                {isPending
                                    ? "Processing..."
                                    : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}