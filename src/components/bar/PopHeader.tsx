import { X } from "lucide-react";

type PopHeaderProps = {
    Head: string;
    onCloseAction: () => void;
};

export default function PopHeader({ Head, onCloseAction }: PopHeaderProps) {
    return (
        <div className="relative flex h-[72px] items-center justify-between border-b border-border px-4">
            <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-muted" />

            <h2 className="text-lg font-semibold">
                {Head}
            </h2>

            <button
                type="button"
                onClick={onCloseAction}
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                aria-label="Close"
            >
                <X className="size-5" />
            </button>
        </div>
    );
}