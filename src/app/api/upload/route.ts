import { NextApiRequest, NextApiResponse } from "next";
import Mux from "@mux/mux-node";

const { Video } = new Mux();

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<Response> {
  try {
    const upload = await Video.Uploads.create({
      new_asset_settings: { playback_policy: "public" },
      cors_origin: "*",
    });

    return Response.json({ id: upload.id, url: upload.url });
  } catch (e) {
    res.statusCode = 500;
    console.error("Request error", e); // eslint-disable-line no-console
    return Response.json({ error: e, statusCode: 500 });
  }
}
