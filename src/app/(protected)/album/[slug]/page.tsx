import { albumService } from "@/services/album.service";
import AlbumPageClient from "@/components/album/AlbumPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const albumResponse = await albumService.getAlbumBySlug(slug);
  
  return (
    <AlbumPageClient album={albumResponse.data} />
  );
}