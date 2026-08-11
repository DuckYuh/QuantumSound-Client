import { SearchResults } from "@/components/search/SearchResult";

interface SearchPageProps {
    searchParams: Promise<{
        query?: string;
    }>;
}

export default async function SearchPage({searchParams, }: SearchPageProps) {
    const params = await searchParams;
    const query = params.query?.trim() ?? "";

    return (
        <main className="space-y-8">
            <h1 className="text-2xl font-bold">
                Search results for "{query}"
            </h1>

            <SearchResults query={query} />
        </main>
    );
}