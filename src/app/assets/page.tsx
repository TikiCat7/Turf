import { headers } from "next/headers";
import { Asset } from "@mux/mux-node";
import Link from "next/link";

async function getAssets() {
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/assets`, {
      method: "GET",
      headers: headers(),
      cache: "default",
    });
    return res.json();
  } catch (e) {
    console.error("Error in getAssets", e);
  }
}

export default async function Assets() {
  const allAssets = await getAssets();
  return (
    <div>
      <div className="text-4xl font-bold mb-4">All Assets</div>
      <div className="flex flex-col space-y-4">
        {allAssets.assets.map((asset: Asset) => (
          <Link
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
