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
    <div
        className="
            relative
            flex flex-row items-center gap-4
            bg-gradient-to-b from-[#2e2e2e] to-[#181818]
            px-4 py-5

            sm:gap-5 sm:px-6 sm:py-6

            md:items-end
            md:gap-6
            md:px-6 md:pt-6 md:pb-6
        "
    >
      
      <div className="shrink-0">
        <Avatar
          avatar={targetUser.avatar}
          name={targetUser.displayName}
          size="sp"
        />
      </div>

      {isOwnProfile && (
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute top-3 right-3 md:right-6 md:top-6 shrink-0" 
          onClick={handleSettingsClick}
        >
          <Settings className="w-6 h-6" />
        </Button>
      )}
        
      <div className="flex flex-col gap-2 entry-animation md:gap-2">
        <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">
          Profile
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl xl:text-8xl font-black tracking-tighter block py-1">
          {targetUser.displayName}
        </h1>
        <span className="truncate text-sm text-muted-foreground md:hidden" >
          @{targetUser.username}
        </span>
      </div>
    </div>
  );
}
