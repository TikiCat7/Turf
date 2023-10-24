import { NextApiRequest, NextApiResponse } from "next";
import Mux from "@mux/mux-node";

const { Video } = new Mux();

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<Response> {
  try {
    const assetList = await Video.Assets.list({ limit: 50 });
    console.log("asset data: ", JSON.stringify(assetList, null, 2));
    return Response.json({
      assets: assetList,
    });
  } catch (e) {
    console.error("Request error", e); // eslint-disable-line no-console
    res.json({ error: "Error getting asset" });
    return Response.json({ error: e, statusCode: 500 });
  }
}
