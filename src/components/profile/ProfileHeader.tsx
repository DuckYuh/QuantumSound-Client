"use client";

import { Avatar, Button } from "@/components/ui";
import { useAuth } from '@/providers/AuthProvider';
import { Settings } from 'lucide-react';
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
  targetUser: {
    username: string;
    displayName: string;
    avatar?: string;
  };
}

export default function ProfileHeader({ targetUser }: ProfileHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const isOwnProfile = user?.username === targetUser.username;

  async function handleSettingsClick() {
    router.push("/settings");
  }

  return (
    <div className="relative bg-gradient-to-b from-[#2e2e2e] to-[#181818] px-6 pt-6 pb-6 flex flex-col md:flex-row items-end gap-6">
      
      <Avatar avatar={targetUser.avatar} name={targetUser.displayName} size="sp" />

      {isOwnProfile && (
        <Button variant="outline" size="sm" className="absolute top-6 right-6 " onClick={handleSettingsClick}>
          <Settings className="w-6 h-6" />
        </Button>
      )}
        
      <div className="flex flex-col gap-2 entry-animation">
        <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">
          Profile
        </span>
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter block py-1">
          {targetUser.displayName}
        </h1>
      </div>
    </div>
  );
}
