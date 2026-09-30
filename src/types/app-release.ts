export type AppPlatform = "DESKTOP" | "MOBILE";

export interface AppRelease {
    id: string;
    platform: AppPlatform;
    version: string;
    fileName: string;
    fileUrl: string;
    r2Key: string;
    fileSize?: number | null;
    releaseNotes?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAppReleaseRequest {
    version: string;
    releaseNotes?: string;
    file: File;
}