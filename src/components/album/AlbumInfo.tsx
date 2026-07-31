import { albumService } from "@/services/album.service";

interface Props {
  targetAlbum: {
    id: string;
  };
}

export default async function AlbumInfo({ targetAlbum }: Props) {
  const albumResponse = await albumService.getAlbumById(targetAlbum.id);

  return (
    <div>
      <div>Album: {albumResponse.data.title}</div>
      <div>Type: {albumResponse.data.type}</div>
      <div>Artist: {albumResponse.data.artist.username}</div>
    </div>
  );
}