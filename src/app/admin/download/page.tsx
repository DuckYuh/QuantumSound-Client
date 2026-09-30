"use client";

import { useState } from "react";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    Download,
    Monitor,
    Smartphone,
    Upload,
    Trash2,
} from "lucide-react";

import { Button, Input, Textarea } from "@/components/ui";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

import { appReleaseService } from "@/services/apprelease.service";
import { getAdminData } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";

import {
    AppPlatform,
    AppRelease,
} from "@/types/app-release";

import { toast } from "sonner";

function formatFileSize(size?: number | null) {
    if (!size) return "";

    const mb = size / (1024 * 1024);

    if (mb < 1024) {
        return `${mb.toFixed(1)} MB`;
    }

    return `${(mb / 1024).toFixed(2)} GB`;
}

export default function AdminDownloadsPage() {
    const queryClient = useQueryClient();

    const [editingPlatform, setEditingPlatform] =
        useState<AppPlatform | null>(null);

    const [version, setVersion] = useState("");
    const [releaseNotes, setReleaseNotes] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: queryKeys.appReleases.all(),
        queryFn: () => appReleaseService.getAll(),
    });

    const responseData = data?.data;

    const releases: AppRelease[] = Array.isArray(responseData)
        ? responseData
        : [];

    const desktopRelease = releases.find(
        (release) => release.platform === "DESKTOP"
    );

    const mobileRelease = releases.find(
        (release) => release.platform === "MOBILE"
    );

    const uploadMutation = useMutation({
        mutationFn: ({
            platform,
            version,
            releaseNotes,
            file,
        }: {
            platform: AppPlatform;
            version: string;
            releaseNotes: string;
            file: File;
        }) =>
            getAdminData.upsert(platform, {
                version,
                releaseNotes,
                file,
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.appReleases.all(),
            });

            toast.success("Release uploaded successfully");

            resetForm();
        },

        onError: () => {
            toast.error("Failed to upload release");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (platform: AppPlatform) =>
            getAdminData.delete(platform),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.appReleases.all(),
            });

            toast.success("Release deleted successfully");
        },

        onError: () => {
            toast.error("Failed to delete release");
        },
    });

    function resetForm() {
        setEditingPlatform(null);
        setVersion("");
        setReleaseNotes("");
        setFile(null);
    }

    function openUpload(platform: AppPlatform) {
        setEditingPlatform(platform);

        const release =
            platform === "DESKTOP"
                ? desktopRelease
                : mobileRelease;

        setVersion(release?.version ?? "");
        setReleaseNotes(release?.releaseNotes ?? "");
        setFile(null);
    }

    function handleSubmit() {
        if (!editingPlatform) return;

        if (!version.trim()) {
            toast.error("Version is required");
            return;
        }

        if (!file) {
            toast.error("Please select an installation file");
            return;
        }

        uploadMutation.mutate({
            platform: editingPlatform,
            version: version.trim(),
            releaseNotes,
            file,
        });
    }

    function handleDelete(platform: AppPlatform) {
        const name =
            platform === "DESKTOP"
                ? "Desktop"
                : "Mobile";

        if (
            !confirm(
                `Delete the current ${name} release?`
            )
        ) {
            return;
        }

        deleteMutation.mutate(platform);
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Downloads"
                description="Manage the current QuantumSound installation files"
            />

            <div className="grid gap-6 md:grid-cols-2">
                <ReleaseCard
                    platform="DESKTOP"
                    release={desktopRelease}
                    loading={isLoading}
                    onUploadAction={() =>
                        openUpload("DESKTOP")
                    }
                    onDeleteAction={() =>
                        handleDelete("DESKTOP")
                    }
                />

                <ReleaseCard
                    platform="MOBILE"
                    release={mobileRelease}
                    loading={isLoading}
                    onUploadAction={() =>
                        openUpload("MOBILE")
                    }
                    onDeleteAction={() =>
                        handleDelete("MOBILE")
                    }
                />
            </div>

            {editingPlatform && (
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold">
                            {editingPlatform === "DESKTOP"
                                ? "Desktop"
                                : "Mobile"}{" "}
                            Release
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Uploading a new release will replace
                            the current one.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Version
                            </label>

                            <Input
                                value={version}
                                onChange={(e) =>
                                    setVersion(
                                        e.target.value
                                    )
                                }
                                placeholder="1.0.0"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Release notes
                            </label>

                            <Textarea
                                value={releaseNotes}
                                onChange={(e) =>
                                    setReleaseNotes(
                                        e.target.value
                                    )
                                }
                                placeholder="What's new in this release?"
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Installation file
                            </label>

                            <Input
                                type="file"
                                accept={
                                    editingPlatform === "DESKTOP"
                                        ? ".exe,.msi,.dmg,.appimage"
                                        : ".apk"
                                }
                                onChange={(e) =>
                                    setFile(
                                        e.target.files?.[0] ??
                                            null
                                    )
                                }
                            />

                            {file && (
                                <p className="text-sm text-muted-foreground">
                                    {file.name} •{" "}
                                    {formatFileSize(
                                        file.size
                                    )}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="outline"
                                onClick={resetForm}
                                disabled={
                                    uploadMutation.isPending
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={handleSubmit}
                                disabled={
                                    uploadMutation.isPending
                                }
                            >
                                <Upload className="mr-2 size-4" />

                                {uploadMutation.isPending
                                    ? "Uploading..."
                                    : "Upload Release"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ReleaseCard({
    platform,
    release,
    loading,
    onUploadAction,
    onDeleteAction,
}: {
    platform: AppPlatform;
    release?: AppRelease;
    loading: boolean;
    onUploadAction: () => void;
    onDeleteAction: () => void;
}) {
    const isDesktop = platform === "DESKTOP";

    return (
        <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                    {isDesktop ? (
                        <Monitor className="size-6" />
                    ) : (
                        <Smartphone className="size-6" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">
                        {isDesktop
                            ? "Desktop"
                            : "Mobile"}
                    </h2>

                    {loading ? (
                        <div className="mt-3 h-16 animate-pulse rounded-md bg-muted" />
                    ) : release ? (
                        <>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Version {release.version}
                            </p>

                            <p className="mt-1 truncate text-sm text-muted-foreground">
                                {release.fileName}
                            </p>

                            {release.fileSize && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {formatFileSize(
                                        release.fileSize
                                    )}
                                </p>
                            )}

                            <div className="mt-5 flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    onClick={
                                        onUploadAction
                                    }
                                >
                                    <Upload className="mr-2 size-4" />
                                    Replace
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={
                                        onDeleteAction
                                    }
                                >
                                    <Trash2 className="mr-2 size-4" />
                                    Delete
                                </Button>

                                <Button
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                >
                                    <a
                                        href={
                                            release.fileUrl
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Download className="mr-2 size-4" />
                                        Open
                                    </a>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="mt-2 text-sm text-muted-foreground">
                                No release uploaded yet.
                            </p>

                            <Button
                                size="sm"
                                className="mt-4"
                                onClick={
                                    onUploadAction
                                }
                            >
                                <Upload className="mr-2 size-4" />
                                Upload Release
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}