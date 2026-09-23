"use client";

import { useState } from "react";
import {
    MoreHorizontal,
    ShieldCheck,
    ShieldOff,
    Trash2,
    UserCog,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Dropdown } from "@/components/ui";
import { getAdminData } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { User } from "@/types/user";

type UserActionsProps = {
    user: User;
};

type ConfirmAction = "status" | "role" | "delete" | null;

export default function UserActions({ user }: UserActionsProps) {
    const queryClient = useQueryClient();
    const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

    const updateStatusMutation = useMutation({
        mutationFn: (status: "ACTIVE" | "BANNED") =>
            getAdminData.updateUserStatus(user.id, { status }),

        onSuccess: () => {
            toast.success(
                user.status === "BANNED"
                    ? "User unbanned successfully"
                    : "User banned successfully"
            );

            queryClient.invalidateQueries({
                queryKey: queryKeys.admin.users(),
            });

            setConfirmAction(null);
        },

        onError: () => {
            toast.error("Failed to update user status");
        },
    });

    const updateRoleMutation = useMutation({
        mutationFn: (role: "USER" | "ADMIN") => getAdminData.updateUserRole(user.id, { role }),
        onSuccess: () => {
            toast.success("User role updated successfully");

            queryClient.invalidateQueries({
                queryKey: queryKeys.admin.users(),
            });

            setConfirmAction(null);
        },

        onError: () => {
            toast.error("Failed to update user role");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => getAdminData.deleteUser(user.id),

        onSuccess: () => {
            toast.success("User deleted successfully");

            queryClient.invalidateQueries({
                queryKey: queryKeys.admin.users(),
            });

            setConfirmAction(null);
        },

        onError: () => {
            toast.error("Failed to delete user");
        },
    });

    const handleConfirm = () => {
        if (confirmAction === "status") {
            updateStatusMutation.mutate(
                user.status === "BANNED" ? "ACTIVE" : "BANNED"
            );
        }

        if (confirmAction === "role") {
            updateRoleMutation.mutate(
                user.role === "ADMIN" ? "USER" : "ADMIN"
            );
        }

        if (confirmAction === "delete") {
            deleteMutation.mutate();
        }
    };

    const isPending =
        updateStatusMutation.isPending ||
        updateRoleMutation.isPending ||
        deleteMutation.isPending;

    const items = [
        ...(user.status !== "DELETED"
            ? [
                  {
                      label:
                          user.status === "BANNED"
                              ? "Unban user"
                              : "Ban user",
                      icon:
                          user.status === "BANNED" ? (
                              <ShieldCheck className="size-4" />
                          ) : (
                              <ShieldOff className="size-4" />
                          ),
                      onClick: () => setConfirmAction("status"),
                  },
                  {
                      label:
                          user.role === "ADMIN"
                              ? "Remove admin"
                              : "Make admin",
                      icon: <UserCog className="size-4" />,
                      onClick: () => setConfirmAction("role"),
                  },
              ]
            : []),

        {
            label: "Delete user",
            icon: <Trash2 className="size-4" />,
            danger: true,
            onClick: () => setConfirmAction("delete"),
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
                        aria-label={`Actions for ${user.username}`}
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
                            {confirmAction === "status" &&
                                (user.status === "BANNED"
                                    ? "Unban user?"
                                    : "Ban user?")}

                            {confirmAction === "role" &&
                                (user.role === "ADMIN"
                                    ? "Remove admin role?"
                                    : "Make admin?")}

                            {confirmAction === "delete" && "Delete user?"}
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {confirmAction === "status" &&
                                `Are you sure you want to ${
                                    user.status === "BANNED"
                                        ? "unban"
                                        : "ban"
                                } @${user.username}?`}

                            {confirmAction === "role" &&
                                `Are you sure you want to ${
                                    user.role === "ADMIN"
                                        ? "remove the admin role from"
                                        : "make"
                                } @${user.username}${
                                    user.role === "ADMIN"
                                        ? "?"
                                        : " an admin?"
                                }`}

                            {confirmAction === "delete" &&
                                `This will delete @${user.username}. This action cannot be undone.`}
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => setConfirmAction(null)}
                                className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={isPending}
                                onClick={handleConfirm}
                                className={
                                    confirmAction === "delete"
                                        ? "rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                                        : "rounded-md bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                                }
                            >
                                {isPending ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}