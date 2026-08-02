"use client";

import { Input, Button, Avatar, Card, CardTitle, CardContent, Textarea, CardHeader, CardDescription, CardFooter } from '@/components/ui';
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
    <Card>
      <CardHeader>
          <CardTitle>Profile</CardTitle>

          <CardDescription>
              Update your profile information.
          </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-8 mt-2">
          <div className="flex flex-col items-center space-y-2 w-48">
            <label className="text-lg font-medium">Avatar</label>
            <Avatar
              name={user.displayName}
              avatar={user.avatar}
              size="sp"
            />
            <Input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            />
          </div>
          <div className="flex flex-col items-start space-y-3 flex-1 max-w-2xl">
            <label className="text-sm font-medium">Display Name</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full max-w-xl"
            />

            <label className="text-sm font-medium">Country</label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full max-w-xl"
            />

            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full max-w-xl h-28"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateProfile}>
          Update Profile
        </Button>
      </CardFooter>
    </Card>
  );
}