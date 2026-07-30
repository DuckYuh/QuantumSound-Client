import { Spinner } from "./Spinner";

type LoadingProps = {
    title?: string;
    description?: string;
};

export function Loading({ 
    title = "Loading...", 
    description, 
}: LoadingProps) {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-4">
            <Spinner size="lg" />

            <div className="text-center">
                <h2 className="text-lg font-semibold">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-sm text-muted">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}