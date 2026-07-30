import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMusics from "@/components/profile/ProfileMusics";
import ProfilePlaylists from "@/components/profile/ProfilePlaylist";
import { userService } from "@/services/user.service";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function Profile({ params }: Props) {
  const { username } = await params;
  const response = await userService.getProfile(username);
  const targetUser = response.data;

  return (
    <div>
      <ProfileHeader targetUser={targetUser} />
      <ProfileMusics targetUser={targetUser} />
      <ProfilePlaylists targetUser={targetUser} />
    </div>
  );
}
