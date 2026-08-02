import ProfileSection from "@/components/settings/ProfileSection";
import PasswordSection from "@/components/settings/PasswordSection";
import { Card, CardTitle } from "@/components/ui";

export default function Settings() {
  return (
    <div className="space-y-8">
      <CardTitle>
        <div>Settings Page</div>
      </CardTitle>
        <ProfileSection />
        <PasswordSection />
    </div>
  );
}
