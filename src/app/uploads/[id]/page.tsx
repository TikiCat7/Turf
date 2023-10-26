import { UserButton } from "@clerk/nextjs";
import Mux, { Upload } from "@mux/mux-node";

const { Video } = new Mux();

async function getUploadStatus(uploadId: string) {
  try {
    return await Video.Uploads.get(uploadId);
  } catch (e) {
    console.error("Error in getUploadStatus", e);
  }
}

export default async function Upload({ params }: { params: { id: string } }) {
  const upload = await getUploadStatus(params.id);
  console.log("upload: ", upload);
  return (
    <div className="flex flex-col">
      <UserButton afterSignOutUrl="/" />
      {upload ? (
        <>
          <span className="flex space-x-2">
            <p>Video Upload:</p> <pre>{params.id}</pre>
          </span>
          <span className="flex space-x-2">
            <p>Video status:</p> <pre>{upload!.status}</pre>
          </span>
        </>
      ) : (
        <p>user not found</p>
      )}
    </div>
  );
}
