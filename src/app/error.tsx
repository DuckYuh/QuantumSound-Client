"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui";

export default function Error({ error, reset, }: { error: Error; reset: () => void; }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">

            <p className="text-7xl font-bold text-danger">
                !
            </p>

            <h1 className="mt-4 text-3xl font-bold">
                Something went wrong
            </h1>

            <p className="mt-3 max-w-md text-muted">
                An unexpected error occurred.
            </p>

            <Button
                className="mt-8"
                onClick={reset}
            >
                Try Again
            </Button>

        </div>
    );
}