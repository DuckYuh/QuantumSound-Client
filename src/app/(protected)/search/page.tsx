import { SearchResults } from "@/components/search/SearchResult";
import SearchBar from "@/components/search/SearchBar";

interface SearchPageProps {
    searchParams: Promise<{
        query?: string;
    }>;
}

export default async function SearchPage({searchParams, }: SearchPageProps) {
    const params = await searchParams;
    const query = params.query?.trim() ?? "";

    if (query === "") {
        return (
            <div className="space-y-8">
                <div className="lg:hidden">
                    <SearchBar />
                </div>
            
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-2xl font-bold">Searching Page</h1>
                    <p className="text-muted-foreground">
                        Please provide a search query to see results.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="lg:hidden">
                <SearchBar />
            </div>

            <h1 className="text-2xl font-bold">
                Search results for "{query}"
            </h1>

            <SearchResults query={query} />
        </div>
    );
}