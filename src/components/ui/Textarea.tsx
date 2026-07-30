import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    TextareaProps
>(
    ({ className, ...props }, ref) => (
        <textarea
            ref={ref}
            className={cn(
                "min-h-28 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-primary",
                className
            )}
            {...props}
        />
    )
);

Textarea.displayName = "Textarea";