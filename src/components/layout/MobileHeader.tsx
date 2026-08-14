"use client";

import { useRouter } from "next/navigation";
import { Button, Logo } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import { UserMenu } from '../bar/UserMenu';

export default function MobileHeader() {
    const { user, logout } = useAuth();
    const router = useRouter();

    async function handleSignUpClick() {
		router.push("/register");
	}

	async function handleLoginClick() {
		router.push("/login");
	}

    return (
        <header
            className="fixed inset-x-0 top-0 z-40 h-16 border-b border-border bg-background/90 backdrop-blur-xl lg:hidden" >
            <div className="flex h-full items-center justify-between px-4">
                {/* Logo / Brand */}
                <Logo />

                {/* Profile */}
                {user ? (
                    <UserMenu
                        user={user}
                        logout={logout}
                    />
                ) : (
                    <>
						<Button variant="text" size="sm" onClick={handleSignUpClick}>
							Sign up
						</Button>

						<Button variant="outline" size="sm" onClick={handleLoginClick}>
							Log in
						</Button>
					</>
                )
                }
            </div>
        </header>
    );
}