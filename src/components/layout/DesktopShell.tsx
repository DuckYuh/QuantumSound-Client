"use client";

import { useState } from "react";
import { useAudio } from "@/providers/AudioProvider";
import Player from "./Player";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Detailbar from "./Detailbar";
import QueueBar from "../player/PlayerQueue";

export default function DesktopShell({ children, }: { children: React.ReactNode; }) {
	const { currentTrack, queue } = useAudio();
	const [isQueue, setIsQueue] = useState(false);

	const toggleQueue = () => {
		setIsQueue((prev) => !prev);
	}

	return (
		<>
			<Navbar />
			<Sidebar />
			<div>
				{children}
			</div>
            {isQueue ? 
				<QueueBar queue={queue} /> : <Detailbar track={currentTrack} />
			}
			<Player IsQueue={isQueue} toggleQueueAction={toggleQueue} />
		</>
	);
}