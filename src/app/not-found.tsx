import Link from "next/link";

import { Button } from "@/components/ui";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">

            <p className="text-7xl font-bold text-primary">
                404
            </p>

            <h1 className="mt-4 text-3xl font-bold">
                Page not found
            </h1>

            <p className="mt-3 max-w-md text-muted">
                The page you're looking for doesn't exist or has been moved.
            </p>

            <Link
                href="/"
                className="mt-8"
            >
                <Button>
                    Back to Home
                </Button>
            </Link>

        </div>
    );
}