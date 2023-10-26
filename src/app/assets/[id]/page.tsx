import Player from "@/components/mux-player";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";

const { Video } = new Mux();

async function getAsset(videoId: string) {
  const user = await currentUser();
  console.log("user exists: ", !!user);
  try {
    return await Video.Assets.get(videoId);
  } catch (e) {
    console.error("Error in getUploadStatus", e);
  }
}
export default async function Assets({ params }: { params: { id: string } }) {
  const asset = await getAsset(params.id);

  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <div>Asset Playback ID: {asset?.playback_ids![0].id}</div>
      <Player playbackId={asset?.playback_ids![0].id ?? ""} />
    </div>
  );
}
