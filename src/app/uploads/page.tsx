"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as UpChunk from "@mux/upchunk";
import { useRef, useState } from "react";

const Uploads = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [uploadId, setUploadId] = useState(null);
  const [progress, setProgress] = useState<Number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const createUpload = async () => {
    console.log("inside create upload");
    try {
      return fetch("/api/upload", {
        method: "POST",
      })
        .then((res) => res.json())
        .then(({ id, url }) => {
          setUploadId(id);
          return url;
        });
    } catch (e) {
      console.error("Error in createUpload", e);
      setErrorMessage("Error creating upload");
    }
  };

  const startUpload = () => {
    setIsUploading(true);

    const files = inputRef.current?.files;
    if (!files) {
      setErrorMessage("An unexpected issue occurred");
      return;
    }

    const upload = UpChunk.createUpload({
      endpoint: createUpload,
      file: files[0],
    });

    upload.on("error", (err: any) => {
      setErrorMessage(err.detail.message);
    });

    upload.on("progress", (progress: any) => {
      setProgress(Math.floor(progress.detail));
    });

    upload.on("success", async () => {
      setIsPreparing(true);
      console.log("success uploading, updating upload status");
    });
  };
  return (
    <div>
      <p className="text-2xl font-bold mb-2">Upload Video</p>
      {errorMessage && <p>{errorMessage}</p>}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Upload Video</Label>
        <Input ref={inputRef} id="video" type="file" onChange={startUpload} />
        {isUploading && <div>Uploading...{progress ? `${progress}%` : ""}</div>}
        {isPreparing && <p>Upload done!</p>}
        <p>UploadID: {uploadId}</p>
      </div>
    </div>
  );
};

export default Uploads;
