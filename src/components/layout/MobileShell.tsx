"use client";

import BottomNavigation from "./BottomNavigation";
import MobileMiniPlayer from "./MobileMiniPlayer";
import MobileFullPlayer from "@/components/player/MobileFullPlayer";
import MobileHeader from "./MobileHeader";
import { useState } from "react";

export default function MobileShell({ children }: { children: React.ReactNode }) {
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    return (
        <div className="min-h-screen">
            <MobileHeader />

            <main>
                {children}
            </main>

            <MobileMiniPlayer onOpenAction={() => setIsPlayerOpen(true)} />
            {isPlayerOpen && (
                <MobileFullPlayer
                    onCloseAction={() => setIsPlayerOpen(false)}
                />
            )}
            <BottomNavigation />
        </div>
    );
}