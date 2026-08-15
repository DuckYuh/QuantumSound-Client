"use client";

import { useState } from "react";
import { albumService } from "@/services/album.service";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Button, Dropdown } from "@/components/ui";
import { Settings } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddTrackForm from "./AddTrackForm";
import AlbumEditForm from "./AlbumEditForm";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/lib/query-keys";

interface Props {
  targetAlbum: {
    id: string;
  };
  editingOrder: boolean;
  onToggleEditOrder: () => void;
}

export default function AlbumInfo({
  targetAlbum,
  editingOrder,
  onToggleEditOrder,
}: Props) {
  const { user } = useAuth();

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddTrackPopupOpen, setIsAddTrackPopupOpen] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: albumResponse,
    isLoading,
  } = useQuery({
    queryKey: queryKeys.album(targetAlbum.id),
    queryFn: async () =>
      (await albumService.getAlbumById(targetAlbum.id)).data,
  });

  const isOwner = albumResponse?.artist.id === user?.id;

  const titleLength = albumResponse?.title.length ?? 0;

  const isAddTrackDisabled =
    albumResponse?.type === "SINGLE" &&
    albumResponse.tracks.length >= 1;

  const deleteAlbum = useMutation({
    mutationFn: albumService.deleteAlbum,

    onSuccess: async () => {
      if (!albumResponse) return;

      await queryClient.invalidateQueries({
        queryKey: queryKeys.myAlbums(),
      });

      router.push(
        `/profile/${albumResponse.artist.username}`
      );
    },
  });

  function handleArtistClick() {
    if (!albumResponse) return;

    router.push(
      `/profile/${albumResponse.artist.username}`
    );
  }

  function handleEditAlbum() {
    setIsEditPopupOpen(true);
  }

  function handleAddTrack() {
    setIsAddTrackPopupOpen(true);
  }

  async function handleDeleteAlbum(albumId: string) {
    try {
      await deleteAlbum.mutateAsync(albumId);
    } catch (error) {
      console.error("Error deleting album:", error);
    }
  }

  if (isLoading || !albumResponse) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className="
                    relative
                    flex flex-col items-center
                    gap-5
                    overflow-hidden
                    bg-gradient-to-b from-[#222228] to-[#18181b]
                    px-4 py-6

                    sm:px-6 sm:py-7

                    md:flex-row
                    md:items-end
                    md:gap-7
                    md:px-8 md:py-8
                "
      >
        {/* Cover */}
        <div
          className="
                        relative
                        size-40 shrink-0
                        overflow-hidden
                        rounded-xl
                        shadow-xl

                        sm:size-44

                        md:size-52
                        lg:size-60
                    "
        >
          <img
            src={
              albumResponse.coverImage ??
              "/Logo512x512.png"
            }
            alt={albumResponse.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Album information */}
        <div
          className="
                        flex min-w-0 w-full
                        flex-col items-center
                        text-center

                        md:items-start
                        md:text-left
                    "
        >
          {/* Type */}
          <span
            className="
                            mb-2
                            text-xs font-bold uppercase
                            tracking-[0.18em]
                            text-muted-foreground

                            md:text-sm
                        "
          >
            {albumResponse.type}
          </span>

          {/* Title */}
          <h1
            className={cn(
              "max-w-full font-black leading-[0.95] tracking-tight",
              "line-clamp-2",
              "text-3xl",
              "sm:text-4xl",
              "md:text-5xl",
              "lg:text-6xl",
              "xl:text-7xl",
              titleLength < 15 && "md:text-7xl lg:text-8xl",
              titleLength >= 35 &&
              "md:text-5xl lg:text-6xl",
              titleLength >= 60 &&
              "md:text-4xl lg:text-5xl"
            )}
          >
            {albumResponse.title}
          </h1>

          {/* Artist */}
          <button
            type="button"
            onClick={handleArtistClick}
            className="
                            mt-3
                            max-w-full
                            truncate
                            text-sm font-medium
                            text-muted-foreground
                            transition-colors
                            hover:text-foreground
                            hover:underline

                            md:mt-4
                            md:text-base
                        "
          >
            {albumResponse.artist.displayName}
          </button>
        </div>

        {/* Settings */}
        {isOwner && (
          <div
            className="
                            absolute
                            right-3 top-3

                            sm:right-5 sm:top-5

                            md:right-6 md:top-6
                        "
          >
            <Dropdown
              className="z-20 bg-surface"
              trigger={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Album settings"
                >
                  <Settings className="size-5 md:size-6" />
                </Button>
              }
              items={[
                {
                  label: "Edit Album",
                  onClick: handleEditAlbum,
                },

                ...(isAddTrackDisabled
                  ? []
                  : [
                    {
                      label: "Add Track",
                      onClick: handleAddTrack,
                    },
                  ]),

                ...(isAddTrackDisabled
                  ? []
                  : [
                    {
                      label: editingOrder
                        ? "Close Reorder"
                        : "Change Order",
                      onClick:
                        onToggleEditOrder,
                    },
                  ]),

                {
                  label: "Delete Album",
                  onClick: () =>
                    handleDeleteAlbum(
                      albumResponse.id
                    ),
                },
              ]}
            />
          </div>
        )}
      </div>

      <AlbumEditForm
        albumId={albumResponse.id}
        open={isEditPopupOpen}
        onClose={() => setIsEditPopupOpen(false)}
        onEdited={() => {
          setIsEditPopupOpen(false);
          router.refresh();
        }}
      />

      <AddTrackForm
        albumId={albumResponse.id}
        open={isAddTrackPopupOpen}
        onClose={() =>
          setIsAddTrackPopupOpen(false)
        }
        onSubmit={() => {
          setIsAddTrackPopupOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}