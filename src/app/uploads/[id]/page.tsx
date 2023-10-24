import { Upload } from "@mux/mux-node";
import { headers } from "next/headers";
import { Suspense } from "react";

async function getUploadStatus(videoId: string) {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/api/upload/${videoId}`,
      { method: "GET", headers: headers(), cache: "no-cache" },
    );
    return res.json();
  } catch (e) {
    console.error("Error in getUploadStatus", e);
  }
}

export default async function Upload({ params }: { params: { id: string } }) {
  const upload = await getUploadStatus(params.id);
  console.log("upload: ", upload);
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="flex flex-col">
        <span className="flex space-x-2">
          <p>Video Upload:</p> <pre>{params.id}</pre>
        </span>
        <span className="flex space-x-2">
          <p>Video status:</p> <pre>{upload.status}</pre>
        </span>
      </div>
    </Suspense>
  );
}
