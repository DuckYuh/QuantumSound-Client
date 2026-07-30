import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const separatorVariants = cva(
    "bg-border shrink-0",
    {
        variants: {
            orientation: {
                horizontal: "h-px w-full",
                vertical: "h-full w-px",
            },
        },
        defaultVariants: {
            orientation: "horizontal",
        },
    }
);

export interface SeparatorProps
    extends VariantProps<typeof separatorVariants> {
    className?: string;
}

export function Separator({ 
    orientation, 
    className, 
}: SeparatorProps) {
    return (
        <div
            className={cn(
                separatorVariants({
                    orientation,
                }),
                className
            )}
        />
    );
}