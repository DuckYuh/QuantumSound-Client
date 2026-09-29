"use client";

import { useEffect, useState } from "react";
import { albumService } from "@/services/album.service";
import AlbumPageClient from "@/components/album/AlbumPageClient";
import type { Album } from "@/types/album";

export default function AlbumPage() {
  const [slug, setSlug] = useState<string>();
  const [album, setAlbum] = useState<Album>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("slug")?.trim();
    setSlug(value || undefined);
  }, []);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    albumService.getAlbumBySlug(slug)
      .then((response) => {
        if (!cancelled) setAlbum(response.data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!slug) return <div>Loading...</div>;
  if (error) return <div>Unable to load this album.</div>;
  if (!album) return <div>Loading...</div>;

  return <AlbumPageClient album={album} />;
}