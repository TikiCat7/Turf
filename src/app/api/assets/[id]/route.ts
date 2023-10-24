import { NextApiRequest, NextApiResponse } from "next";
import Mux from "@mux/mux-node";

const { Video } = new Mux();

export async function GET(
  req: NextApiRequest,
  // id here is asset ID
  { params }: { params: { id: string } },
  res: NextApiResponse,
): Promise<Response> {
  try {
    const asset = await Video.Assets.get(params.id);
    console.log("asset data: ", JSON.stringify(asset, null, 2));
    return Response.json({
      id: asset.id,
      status: asset.status,
      errors: asset.errors,
      playback_id: asset.playback_ids![0].id,
    });
  } catch (e) {
    console.error("Request error", e); // eslint-disable-line no-console
    res.json({ error: "Error getting asset" });
    return Response.json({ error: e, statusCode: 500 });
  }
}
