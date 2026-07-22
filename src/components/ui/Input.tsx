import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
    [
        "flex",
        "h-10",
        "w-full",
        "rounded-md",
        "border",
        "border-input",
        "bg-background",
        "px-3",
        "py-2",
        "text-sm",
        "placeholder:text-muted-foreground",

        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",

        "disabled:cursor-not-allowed",
        "disabled:opacity-50",

        "file:border-0",
        "file:bg-transparent",
        "file:text-sm",
    ].join(" ")
);

const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(
    (
        {
            className,
            type = "text",
            ...props
        },
        ref
    ) => {
        return (
            <input
                ref={ref}
                type={type}
                className={cn(
                    inputVariants(),
                    className
                )}
                {...props}
            />
        );
    }
);


Input.displayName = "Input";


export { Input };