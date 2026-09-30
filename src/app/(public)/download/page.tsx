"use client";

import { useQuery } from "@tanstack/react-query";
import { Download, Monitor, Smartphone } from "lucide-react";

import { Button } from "@/components/ui";
import { appReleaseService } from "@/services/apprelease.service";
import { queryKeys } from "@/lib/query-keys";
import {
    AppPlatform,
    AppRelease,
} from "@/types/app-release";

function formatFileSize(size?: number | null) {
    if (!size) return "";

    const mb = size / (1024 * 1024);

    if (mb < 1024) {
        return `${mb.toFixed(1)} MB`;
    }

    return `${(mb / 1024).toFixed(2)} GB`;
}

function ReleaseCard({
    release,
    platform,
}: {
    release?: AppRelease;
    platform: AppPlatform;
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
                    <h2 className="text-lg font-semibold">
                        {isDesktop
                            ? "QuantumSound Desktop"
                            : "QuantumSound Mobile"}
                    </h2>

                    {release ? (
                        <>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Version {release.version}
                                {release.fileSize
                                    ? ` • ${formatFileSize(
                                          release.fileSize
                                      )}`
                                    : ""}
                            </p>

                            {release.releaseNotes && (
                                <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                                    {release.releaseNotes}
                                </p>
                            )}

                            <Button
                                asChild
                                className="mt-5"
                            >
                                <a
                                    href={release.fileUrl}
                                    download
                                >
                                    <Download className="mr-2 size-4" />
                                    Download
                                </a>
                            </Button>
                        </>
                    ) : (
                        <p className="mt-2 text-sm text-muted-foreground">
                            No release available yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function DownloadPage() {
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

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                    Download QuantumSound
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Get QuantumSound for your devices.
                </p>
            </div>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2].map((item) => (
                        <div
                            key={item}
                            className="h-48 animate-pulse rounded-xl bg-muted"
                        />
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    <ReleaseCard
                        platform="DESKTOP"
                        release={desktopRelease}
                    />

                    <ReleaseCard
                        platform="MOBILE"
                        release={mobileRelease}
                    />
                </div>
            )}
        </main>
    );
}