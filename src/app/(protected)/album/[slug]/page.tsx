import AlbumTrackList from "@/components/album/AlbumTrackList";
import AlbumInfo from "@/components/album/AlbumInfo";
import { albumService } from "@/services/album.service";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const albumResponse = await albumService.getAlbumBySlug(slug);
  
  return (
    <div className="flex flex-col gap-4">
      <AlbumInfo targetAlbum={albumResponse.data} />
      <AlbumTrackList targetAlbum={albumResponse.data} />
    </div>
  );
}