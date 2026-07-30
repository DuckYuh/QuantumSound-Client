import { Button } from "./Button";

type EmptyProps = {
    title: string;
    description?: string;
    action?: React.ReactNode;
};

export function Empty({
    title,
    description,
    action,
}: EmptyProps) {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center">

            <h2 className="text-lg font-semibold">
                {title}
            </h2>

            {description && (
                <p className="mt-2 max-w-md text-sm text-muted">
                    {description}
                </p>
            )}

            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}

        </div>
    );
}