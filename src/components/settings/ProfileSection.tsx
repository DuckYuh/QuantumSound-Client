"use client";

import { Input, Button, Avatar } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { userService } from '@/services/user.service';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfileSection() {
  const { user, refreshUser } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [country, setCountry] = useState(user?.country ?? "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  async function handleUpdateProfile() {
    setLoading(true);
    try {
      if (displayName || bio || country) {
        await userService.updateMe({ displayName, bio, country, });
      }
      if (avatar) {
        await userService.uploadAvatar(avatar);
      }
      await refreshUser();
      toast.success("Profile updated.");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div>Profile Section</div>
      <div className="mt-4 space-y-2">
        <label className="text-sm font-medium">
          Avatar
        </label>
        <Avatar
          name={user.displayName}
          avatar={user.avatar}
          size="lg"
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
        />
        <label className="text-sm font-medium">
          Display Name
        </label>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
      <div className="mt-4 space-y-2">
        <label className="text-sm font-medium">
          Bio  
        </label>   
        <Input
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <div className="mt-4 space-y-2">
        <label className="text-sm font-medium">
          Country
        </label>
        <Input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <div className="mt-4 space-y-2">
        <Button onClick={handleUpdateProfile}>
          Update Profile
        </Button>
      </div>
    </div>
  );
}