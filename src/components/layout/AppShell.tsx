import MobileShell from "./MobileShell";
import DesktopShell from "./DesktopShell";

export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="lg:hidden">
                <MobileShell>{children}</MobileShell>
            </div>

            <div className="hidden lg:block">
                <DesktopShell>{children}</DesktopShell>
            </div>
        </>
    );
}