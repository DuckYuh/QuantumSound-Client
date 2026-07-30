import ProfileSection from "../../../components/settings/ProfileSection";
import PasswordSection from "../../../components/settings/PasswordSection";

export default function Settings() {
  return (
    <div className="space-y-8">
      <div>Settings Page</div>
      <ProfileSection />
      <PasswordSection />
    </div>
  );
}
