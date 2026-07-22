import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	[
		"inline-flex",
		"items-center",
		"justify-center",
		"gap-2",
		"rounded-lg",
		"font-medium",
		"transition-colors",
		"duration-200",
		"focus-visible:outline-none",
		"focus-visible:ring-2",
		"focus-visible:ring-primary",
		"disabled:pointer-events-none",
		"disabled:opacity-50",
	].join(" "),
	{
		variants: {
			variant: {
				default:
					"bg-primary text-white hover:bg-primary-hover",

				outline:
					"border border-border bg-transparent hover:bg-surface",

				ghost:
					"bg-transparent hover:bg-surface",

				secondary:
					"bg-secondary text-background hover:opacity-90",

				destructive:
					"bg-danger text-white hover:opacity-90",

				text: 
					"bg-transparent text-primary hover:text-primary-hover hover:bg-transparent shadow-none",
			},

			size: {
				sm: "h-9 px-3 text-sm",

				md: "h-11 px-5",

				lg: "h-12 px-6",

				icon: "h-11 w-11 p-0",
			},
		},

		defaultVariants: {
			variant: "default",
			size: "md",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	loading?: boolean;

	leftIcon?: React.ReactNode;

	rightIcon?: React.ReactNode;
}

export function Button({
	className,
	variant,
	size,
	loading,
	leftIcon,
	rightIcon,
	children,
	disabled,
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(
				buttonVariants({
					variant,
					size,
				}),
				className
			)}
			disabled={disabled || loading}
			{...props}
		>
			{loading && (
				<span
					className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-current
                    border-t-transparent
                "
				/>
			)}

			{!loading && leftIcon}

			<span>{children}</span>

			{!loading && rightIcon}
		</button>
	);
}