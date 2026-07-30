import { useRouter } from "next/navigation";

import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import { User } from "@/types/user";

type Props = {
    user: User;
    logout: () => void;
};

export function UserMenu({ user, logout }: Props) {
    const router = useRouter();

    async function handleProfileClick() {
        router.push("/profile/" + user.username);
    }

    async function handleSettingsClick() {
        router.push("/settings");
    }

    return (
        <Dropdown
            className="bg-surface"
            trigger={
                <Avatar
                    name={user.displayName}
                    avatar={user.avatar}
                />
            }
            items={[
                {
                    label: "Profile",
                    onClick: handleProfileClick
                },
                {
                    label: "Settings",
                    onClick: handleSettingsClick
                },
                {
                    label: "Logout",
                    onClick: logout,
                    danger: true,
                },
            ]}
        />
    );
}