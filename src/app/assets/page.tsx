import { Asset } from "@mux/mux-node";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { UserButton } from "@clerk/nextjs";

const { Video } = new Mux();

async function getAssets() {
  const user = await currentUser();
  console.log("user exists: ", !!user);
  try {
    console.log("fetching videos directly cuz fuck API ROUTES");
    return await Video.Assets.list({ limit: 50 });
  } catch (e) {
    console.error("Error in getAssets", e);
    return null;
  }
}

export default async function Assets() {
  const allAssets = await getAssets();
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <div className="text-4xl font-bold mb-4">All Assets</div>
      <div className="flex flex-col space-y-4">
        {allAssets &&
          allAssets.map((asset: Asset) => (
            <Link
              key={asset.id}
              href={`assets/${asset.id}`}
              className="flex items-center space-x-2"
            >
              <img
                src={`https://image.mux.com/${
                  asset.playback_ids![0].id
                }/thumbnail.jpg?width=128&fit_mode=pad`}
                className="rounded-md"
              />
              <pre>id: {asset.id}</pre>
            </Link>
          ))}
      </div>
    </div>
  );
}
