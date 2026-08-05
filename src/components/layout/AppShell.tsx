"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useAudio } from "@/providers/AudioProvider";
import Player from "./Player";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Detailbar from "./Detailbar";

export default function AppShell({ children, }: { children: React.ReactNode; }) {
	const { user } = useAuth();
	const { currentTrack } = useAudio();

	return (
		<>
			<Navbar />
			{user && <Sidebar />}
			<div>
				{children}
			</div>
            {user && <Detailbar track={currentTrack} />}
			{user && <Player />}
		</>
	);
}