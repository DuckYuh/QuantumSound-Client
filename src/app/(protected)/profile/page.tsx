"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMusics from "@/components/profile/ProfileMusics";
import ProfilePlaylists from "@/components/profile/ProfilePlaylist";
import PopularTracks from "@/components/profile/PopularTracks";
import type { User } from "@/types/user";

export default function ProfilePage() {
  const [username, setUsername] = useState<string>();
  const [targetUser, setTargetUser] = useState<User>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("username")?.trim();
    setUsername(value || undefined);
  }, []);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    userService.getProfile(username)
      .then((response) => {
        if (!cancelled) setTargetUser(response.data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (!username) return <div>Loading...</div>;
  if (error) return <div>Unable to load this profile.</div>;
  if (!targetUser) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-8">
      <ProfileHeader targetUser={targetUser} />
      <PopularTracks targetUser={targetUser} />
      <ProfileMusics targetUser={targetUser} />
      <ProfilePlaylists targetUser={targetUser} />
    </div>
  );
}