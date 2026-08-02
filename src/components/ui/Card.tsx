import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

interface MediaCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    type: string;
    cover: string;
}

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

export function CardFooter({
    className,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "mt-6 flex justify-end",
                className
            )}
            {...props}
        />
    );
}

export function MediaCard({
    type,
    cover,
    title,
    className,
    ...props
}: MediaCardProps) {
    return (
        <div className={cn(
            "rounded-2xl border border-border bg-card p-6 shadow-sm",
            className
        )} {...props}>
            <div className="w-44 shrink-0 cursor-pointer group">
                <img 
                    src={cover ?? "/Logo512x512.png"} 
                    alt={title} 
                    className="aspect-square w-full rounded-xl object-cover transition group-hover:scale-[1.03]" 
                />
                <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-sm text-muted">{type}</p>
                </div>
            </div>
        </div>
    );
}
