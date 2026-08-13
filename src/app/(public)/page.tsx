import HomeHero from "@/components/home/HomeHero";
import PopularTracks from "@/components/home/PopularTracks";
import MostLikedTracks from "@/components/home/MostLikedTracks";
import NewReleases from "@/components/home/NewReleases";

export default function Home() {
  return (
    <div className="space-y-10">
      <HomeHero />
      <PopularTracks />
      <MostLikedTracks />
      <NewReleases />
    </div>
  );
}
