import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({
    className,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-border bg-card p-6 shadow-sm",
                className
            )}
            {...props}
        />
    );
}

export function CardHeader({
    className,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "mb-6 space-y-1",
                className
            )}
            {...props}
        />
    );
}

export function CardTitle({
    className,
    ...props
}: CardProps) {
    return (
        <h2
            className={cn(
                "text-xl font-semibold",
                className
            )}
            {...props}
        />
    );
}

export function CardDescription({
    className,
    ...props
}: CardProps) {
    return (
        <p
            className={cn(
                "text-sm text-muted",
                className
            )}
            {...props}
        />
    );
}

export function CardContent({ 
    className, 
    ...props 
}: CardProps) {
    return (
        <div
            className={cn(
                "space-y-6",
                className
            )}
            {...props}
        />
    );
}