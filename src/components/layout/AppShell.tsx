"use client";

import { useAuth } from "@/providers/AuthProvider";
import Player from "./Player";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Detailbar from "./Detailbar";

export default function AppShell({ children, }: { children: React.ReactNode; }) {
	const { user } = useAuth();

	return (
		<>
			<Navbar />
			{user && <Sidebar />}
			<main>
				{children}
			</main>
            {user && <Detailbar/>}
			{user && <Player />}
		</>
	);
}