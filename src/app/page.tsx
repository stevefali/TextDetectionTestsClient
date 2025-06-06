"use client";

import axios from "axios";
import { getPreviouslyCachedImageOrNull } from "next/dist/server/image-optimizer";
import Image from "next/image";
import { useRef, useState } from "react";
import ImagePreview from "./components/ImagePreview";

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploadImage = async (formData: FormData) => {
    const response = axios.post(
      "http://10.0.0.226:8080/detection/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("response: ", (await response).data.message);
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      setImageUrl(URL.createObjectURL(file));
    } else {
      setImageUrl(null);
    }
  };

  const onSubmitImage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("testimg", selectedFile);

    console.log("imageUrl: ", imageUrl);
    console.log(formData);

    uploadImage(formData);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <form
          ref={formRef}
          onSubmit={onSubmitImage}
          // encType="multipart/form-data"
        >
          <label htmlFor="image-input">Upload an image file</label>
          <input
            type="file"
            // name="testimg"
            accept="image/*"
            id="image-input"
            onChange={onImageChange}
            capture="environment"
          />
          <button type="submit">Upload</button>
        </form>
        <ImagePreview imageUrl={imageUrl} />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
