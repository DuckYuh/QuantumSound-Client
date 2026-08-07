'use client';

import { useEffect, useState } from "react";
import { albumService } from "@/services/album.service";
import { useRouter } from "next/navigation";
import { Album } from "@/types/album";
import { useAuth } from "@/providers/AuthProvider";
import { Button, Dropdown } from "@/components/ui";
import { Settings } from 'lucide-react';
import { useQueryClient } from "@tanstack/react-query";
import AddTrackForm from "./AddTrackForm";
import AlbumEditForm from "./AlbumEditForm";
import { cn } from "@/lib/utils";

interface Props {
  targetAlbum: {
    id: string;
  };
  editingOrder: boolean;
  onToggleEditOrder: () => void;
}

export default function AlbumInfo({ targetAlbum, editingOrder, onToggleEditOrder }: Props) {
  const { user } = useAuth();
  const [albumResponse, setAlbumResponse] = useState<Album | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddTrackPopupOpen, setIsAddTrackPopupOpen] = useState(false);
  const isOwner = albumResponse?.artist.id === user?.id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const titleLength = albumResponse?.title.length || 0;

  const isAddTrackDisabled = albumResponse?.type === "SINGLE" && albumResponse?.tracks.length >= 1;

  useEffect(() => {
    const fetchAlbum = async () => {
      const response = await albumService.getAlbumById(targetAlbum.id);
      setAlbumResponse(response.data);
    };
    fetchAlbum();
  }, [targetAlbum.id]);

  async function handleArtistClick() {
    router.push(`/profile/${albumResponse?.artist.username}`);
  }

  async function handleEditAlbum() {
    setIsEditPopupOpen(true);
  }

  async function handleAddTrack() {
    setIsAddTrackPopupOpen(true);
  }

  async function handleDeleteAlbum(AlbumId: string) {
    try {
      await albumService.deleteAlbum(AlbumId);
      queryClient.invalidateQueries({
        queryKey: ["user-albums", albumResponse?.artist.username],
      });
      router.push(`/profile/${albumResponse?.artist.username}`);
    } catch (error) {
      console.error("Error deleting album:", error);
    }
  }

  if (!albumResponse) return <div>Loading...</div>;

  return (
    <>
    <div className="relative bg-gradient-to-b from-[#222228] to-[#18181b] px-6 pt-6 pb-6 flex flex-col md:flex-row items-center gap-8">
      <div className="w-44 h-auto rounded-lg aspect-square object-cover transition group-hover:scale-[1.03]">
        <img
          src={albumResponse.coverImage ?? "/Logo512x512.png"}
          alt={albumResponse.title}
          className="w-full h-full rounded-lg aspect-square object-cover transition group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col items-center md:items-start flex-1 w-full text-center md:text-left">
        <div className="absolute top-6 text-md text-color-foreground">
          {albumResponse.type}
        </div>
        <div className={cn(
            "font-black leading-tight line-clamp-2",
            titleLength < 15 && "text-8xl",
            titleLength >= 15 && titleLength < 35 && "text-7xl",
            titleLength >= 35 && "text-6xl",
            titleLength >= 60 && "text-5xl"
        )}>
          {albumResponse.title}
        </div>
        <div className="absolute bottom-6 text-md text-color-foreground hover:underline" onClick={handleArtistClick} style={{ cursor: "pointer" }}>
          {albumResponse.artist.displayName}
        </div>
      </div>
      {isOwner && (
        <div className="absolute top-6 right-6">
          <Dropdown 
            className="bg-surface"
            trigger={
              <Button variant="outline" size="sm">
                <Settings className="w-6 h-6" />
              </Button>
            }
            items={[
              {
                label: "Edit Album",
                onClick: handleEditAlbum,
              },
              ...(isAddTrackDisabled ? [] : [
                {
                  label: "Add Track",
                  onClick: handleAddTrack,
                }
              ]),
              ...(isAddTrackDisabled ? [] : [
                {
                  label: editingOrder ? "Close Reorder" : "Change Order",
                  onClick: onToggleEditOrder,
                },
              ]),
              {
                label: "Delete Album",
                onClick: () => handleDeleteAlbum(albumResponse.id),
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
      onClose={() => setIsAddTrackPopupOpen(false)}
      onSubmit={() => {
        setIsAddTrackPopupOpen(false);
        router.refresh();
      }}
    />
    </>
  );
}