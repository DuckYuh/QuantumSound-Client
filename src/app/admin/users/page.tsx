"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { getAdminData } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import UserTable from "@/components/admin/user/UserTable";
import { Input } from "@/components/ui";

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");
    const [role, setRole] = useState<"ALL" | "USER" | "ADMIN">("ALL");
    const [status, setStatus] = useState<"ALL" | "ACTIVE" | "BANNED" | "DELETED">(
        "ALL"
    );

    const { data, isLoading, isError } = useQuery({
        queryKey: queryKeys.admin.users(),
        queryFn: async () => {
            const response = await getAdminData.getAllUser();
            return response.data;
        },
    });

    const users = useMemo(() => {
        if (!Array.isArray(data)) return [];

        return data.filter((user) => {
            const searchValue = search.trim().toLowerCase();

            const matchesSearch =
                !searchValue ||
                user.username.toLowerCase().includes(searchValue) ||
                user.displayName.toLowerCase().includes(searchValue) ||
                user.email.toLowerCase().includes(searchValue);

            const matchesRole =
                role === "ALL" || user.role === role;

            const matchesStatus =
                status === "ALL" || user.status === status;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [data, search, role, status]);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Users"
                description="Manage QuantumSound users and their permissions."
            />

            <div className="rounded-xl border border-border bg-surface">
                <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search users..."
                            className="pl-9"
                        />
                    </div>

                    <select
                        value={role}
                        onChange={(event) =>
                            setRole(
                                event.target.value as
                                    | "ALL"
                                    | "USER"
                                    | "ADMIN"
                            )
                        }
                        className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                    >
                        <option value="ALL">All roles</option>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target.value as
                                    | "ALL"
                                    | "ACTIVE"
                                    | "BANNED"
                                    | "DELETED"
                            )
                        }
                        className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                    >
                        <option value="ALL">All status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="BANNED">Banned</option>
                        <option value="DELETED">Deleted</option>
                    </select>
                </div>

                {isLoading && (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        Loading users...
                    </div>
                )}

                {isError && (
                    <div className="p-8 text-center text-sm text-destructive">
                        Failed to load users.
                    </div>
                )}

                {!isLoading && !isError && users.length === 0 && (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        No users found.
                    </div>
                )}

                {!isLoading && !isError && users.length > 0 && (
                    <UserTable users={users} />
                )}
            </div>
        </div>
    );
}