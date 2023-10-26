import { NextApiRequest, NextApiResponse } from "next";
import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { uploads } from "@/lib/db/schema";

const { Video } = new Mux();

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<Response> {
  const { userId } = auth();
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const upload = await Video.Uploads.create({
      new_asset_settings: { playback_policy: "public" },
      cors_origin: "*",
    });

    console.log("upload obj: ", upload);
    // save a record in Upload table to keep track of user / team
    const upload_id = await db
      .insert(uploads)
      .values({
        userId: userId,
        teamId: userId,
        uploadId: upload.id,
        uploadUrl: upload.url,
      })
      .returning({
        insertedId: uploads.id,
      });
    console.log("upload record stored in DB: ", upload_id);

    return Response.json({
      id: upload.id,
      url: upload.url,
      upload_id: upload_id,
    });
  } catch (e) {
    res.statusCode = 500;
    console.error("Request error", e); // eslint-disable-line no-console
    return Response.json({ error: e, statusCode: 500 });
  }
}
