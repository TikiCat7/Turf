import Player from "@/components/mux-player";
import { headers } from "next/headers";

async function getAsset(videoId: string) {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/api/assets/${videoId}`,
      { method: "GET", headers: headers(), cache: "no-cache" },
    );
    return res.json();
  } catch (e) {
    console.error("Error in getUploadStatus", e);
  }
}
export default async function Assets({ params }: { params: { id: string } }) {
  const asset = await getAsset(params.id);

  return (
    <div>
      <div>Asset Playback ID: {asset.playback_id}</div>
      <Player playbackId={asset.playback_id} />
    </div>
  );
}
