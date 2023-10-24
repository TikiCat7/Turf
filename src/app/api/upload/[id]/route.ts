import { NextApiRequest, NextApiResponse } from "next";
import Mux from "@mux/mux-node";

const { Video } = new Mux();

export async function GET(
  req: NextApiRequest,
  { params }: { params: { id: string } },
  res: NextApiResponse,
): Promise<Response> {
  try {
    const upload = await Video.Uploads.get(params.id);
    console.log("upload data: ", JSON.stringify(upload, null, 2));
    return Response.json({
      status: upload.status,
      id: upload.id,
      assetId: upload.asset_id,
    });
  } catch (e) {
    console.error("Request error", e); // eslint-disable-line no-console
    res.json({ error: "Error getting upload/asset" });
    return Response.json({ error: e, statusCode: 500 });
  }
}
