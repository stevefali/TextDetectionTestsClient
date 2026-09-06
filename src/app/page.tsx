"use client";

import axios from "axios";
import { getPreviouslyCachedImageOrNull } from "next/dist/server/image-optimizer";
import Image from "next/image";
import { useRef, useState } from "react";
import ImagePreview, {
  DetectedWord,
  OriginalImageSize,
} from "./components/ImagePreview";

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);

  const DETECTION_URL = "http://10.0.0.226:8080/detection";

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [detectedWords, setDetectedWords] = useState<DetectedWord[] | null>(
    null
  );
  const [originalImageSize, setOriginalImageSize] =
    useState<OriginalImageSize | null>(null);

  const sendImage = async (formData: FormData, endpoint: string) => {
    const response = await axios.post(
      `${DETECTION_URL}/${endpoint}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("response: ", response.data);
    if (endpoint === "detect") {
      setOriginalImageSize(response.data.originalSize);
      const words = response.data.results;

      console.log(words[0].description);

      // For now, just take some
      const trimmed = words.splice(1, 10);

      const detections: DetectedWord[] = trimmed.map((word: any) => {
        const { boundingPoly, description } = word;
        return { boundingPoly: boundingPoly, description: description };
      });

      setDetectedWords(detections);
    }
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

  const onSubmitImage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    action: string
  ) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("testimg", selectedFile);

    console.log("imageUrl: ", imageUrl);
    console.log(formData);
    sendImage(formData, action);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <form
          ref={formRef}
          // onSubmit={onSubmitImage}
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
          <div className="flex flex-row gap-6">
            <button onClick={(e) => onSubmitImage(e, "upload")}>Upload</button>
            <button onClick={(e) => onSubmitImage(e, "detect")}>
              Detect Text
            </button>
          </div>
        </form>
        <ImagePreview
          imageUrl={imageUrl}
          detectedWords={detectedWords}
          originalImageSize={originalImageSize}
        />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
