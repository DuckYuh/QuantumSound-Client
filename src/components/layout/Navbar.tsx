"use client";

import Image from 'next/image';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useAuth } from '@/providers/AuthProvider';

export default function Navbar() {
	const router = useRouter();
	const { user, logout } = useAuth();
	async function handleSignUpClick() {
		router.push("/register");
	}

	async function handleLoginClick() {
		router.push("/login");
	}

	async function handleLogoutClick() {
		logout();
	}
	return (
		<>
			<header className="fixed left-0 top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
				<div className="flex h-[var(--spacing-navbar)] items-center gap-4 px-4 sm:px-6 lg:px-8">
					<Image className="rounded-lg" src="/Logo.svg" alt="Logo" width={40} height={40} />

					<div className="flex min-w-0 flex-1 items-center gap-4 lg:pl-[var(--spacing-sidebar)]">
						<div className="min-w-0 flex-1">
							<p className="text-xs uppercase tracking-[0.35em] text-muted">Navbar</p>
							<p className="truncate text-sm text-muted">
								Discover, library, search, and quick actions live here.
							</p>
						</div>

						{user ? (
							<>
								<Button variant="outline" size="sm" onClick={handleLogoutClick}>
									Logout
								</Button>
							</>
						) : (
							<>
								<Button variant="text" size="sm" onClick={handleSignUpClick}>
									Sign up
								</Button>

								<Button variant="outline" size="sm" onClick={handleLoginClick}>
									Sign in
								</Button>
							</>
						)}
					</div>
					
				</div>
			</header>
		</>
	);
}
