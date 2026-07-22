import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="relative min-h-screen overflow-hidden bg-background text-foreground">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.16),transparent_28%),radial-gradient(circle_at_right_top,rgba(94,217,255,0.12),transparent_22%)]" />
			<main className="relative min-h-screen pb-28 pt-20">
				<div className="mx-auto w-full max-w-[var(--container-content)] px-4 pb-8 sm:px-6 lg:px-8">
					{children}
				</div>
			</main>
		</div>
	);
}
