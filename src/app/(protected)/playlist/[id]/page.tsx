import PlaylistInfo from "@/components/playlist/PlaylistInfo";
import PlaylistTrackList from "@/components/playlist/PlaylistTrackList";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PlaylistPage({ params }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <PlaylistInfo params={params} />
            <PlaylistTrackList params={params} />
        </div>
    )
}