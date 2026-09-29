"use client";

import { useEffect, useState } from "react";
import PlaylistInfo from "@/components/playlist/PlaylistInfo";
import PlaylistTrackList from "@/components/playlist/PlaylistTrackList";

export default function PlaylistPage() {
  const [id, setId] = useState<string>();

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("id")?.trim();
    setId(value || undefined);
  }, []);

  if (!id) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <PlaylistInfo id={id} />
      <PlaylistTrackList id={id} />
    </div>
  );
}