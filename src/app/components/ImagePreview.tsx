import { useEffect, useRef } from "react";

export interface ImagePreviewProps {
  imageUrl: string | null;
  detectedWords: DetectedWord[] | null;
  originalImageSize: OriginalImageSize | null;
}

interface BoxPoint {
  x: number;
  y: number;
}

interface BoundingPoly {
  vertices: BoxPoint[];
}

export interface DetectedWord {
  boundingPoly: BoundingPoly;
  description: string;
}

export interface OriginalImageSize {
  width: number;
  height: number;
}

const ImagePreview = ({
  imageUrl,
  detectedWords,
  originalImageSize,
}: ImagePreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const drawBoxes = (imageWidth: number, imageHeight: number) => {
    const canv = canvasRef.current;
    if (!canv) {
      return;
    }

    console.log("drawing!!");

    canv.width = imageWidth;
    canv.height = imageHeight;

    const ctx = canv.getContext("2d");
    const { width, height } = canv;
    const scaleX = imageWidth / (originalImageSize?.width || 1);
    const scaleY = imageHeight / (originalImageSize?.height || 1);

    // TODO: Calculate and draw box
    ctx?.clearRect(0, 0, width, height);

    detectedWords?.forEach((word) => {
      const verts = word.boundingPoly.vertices;
      ctx!!.strokeStyle = "red";
      ctx!!.lineWidth = 2;
      console.log(
        `verts: x: ${verts[0].x * scaleX}, y: ${verts[0].y * scaleY}`
      );
      ctx!!.moveTo(verts[0].x * scaleX, verts[0].y * scaleY);
      for (let i = 1; i < verts.length; i++) {
        ctx!!.lineTo(verts[i].x * scaleX, verts[i].y * scaleY);
      }
      ctx!!.lineTo(verts[0].x * scaleX, verts[0].y * scaleY);
      ctx?.stroke();
      console.log("Stroking ", verts.length);
    });
  };

  useEffect(() => {
    if (imageUrl) {
      console.log(
        "imageRef: ",
        `${imgRef.current?.clientWidth} x ${imgRef.current?.clientHeight}`
      );

      const previewImage = imgRef.current;

      if (detectedWords) {
        drawBoxes(
          // previewImage?.getClientRects(),
          previewImage?.clientWidth || 0,
          previewImage?.clientHeight || 0
        );
      }
    }
  }, [detectedWords]);

  if (imageUrl) {
    return (
      <div className="relavive">
        <img src={imageUrl} ref={imgRef} className="absolute size-fit" />
        <canvas ref={canvasRef} className="absolute " />
      </div>
    );
  } else {
    return (
      <div>
        <p>loading...</p>
      </div>
    );
  }
};

export default ImagePreview;
