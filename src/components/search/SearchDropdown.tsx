import SearchItem from "./SearchItem";
import { Card } from "@/components/ui";



export default function SearchDropdown() {
    return (
        <Card className="search-dropdown bg-surface absolute left-0 top-full z-50 mt-2 w-full">
            <SearchItem />
        </Card>
    );
}