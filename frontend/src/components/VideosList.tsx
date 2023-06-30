import { VideoCard } from "./VideoCard";
import { $videosFeed } from "../stores/videosStore";
import { useStore } from "@nanostores/react";

export function VideosList() {
  const videos = useStore($videosFeed);

  if (!videos) return <>Loading...</>;
  return (
    videos.map((video, i) => (
      <VideoCard
        position={i + 1}
        key={video.data._id}
        video={video}
      />
    ))
  );
}
