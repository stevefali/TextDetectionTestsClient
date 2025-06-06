import { useEffect, useRef } from "react";

export interface ImagePreviewProps {
  imageUrl: string | null;
}

const ImagePreview = ({ imageUrl }: ImagePreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const drawBoxes = (
    boxes: DOMRectList | undefined,
    imageWidth: number,
    imageHeight: number
  ) => {
    const canv = canvasRef.current;
    if (!canv) {
      return;
    }
    console.log("canvas: ", `${canv.width} x ${canv.height}`);

    canv.width = imageWidth;
    canv.height = imageHeight;

    const ctx = canv.getContext("2d");
    const { width, height } = canv;
    const scaleX = width / imageWidth;
    const scaleY = height / imageHeight;

    // TODO: Calculate and draw box
    if (boxes) {
      ctx?.clearRect(0, 0, width, height);
      for (let i = 0; i < boxes.length; i++) {
        const box = boxes.item(i);
        ctx?.rect(0, 0, box!!.width, box!!.height);
        ctx!!.strokeStyle = "red";
        ctx!!.lineWidth = 12;
        ctx?.stroke();
      }
    }
  };

  //   useEffect(() => {
  if (imageUrl) {
    console.log(
      "imageRef: ",
      `${imgRef.current?.clientWidth} x ${imgRef.current?.clientHeight}`
    );

    const previewImage = imgRef.current;

    drawBoxes(
      previewImage?.getClientRects(),
      previewImage?.clientWidth || 0,
      previewImage?.clientHeight || 0
    );
  }
  //   }, [imageUrl]);

  if (imageUrl) {
    return (
      <div className="relavive">
        {/* <h2>ImagePreview</h2> */}
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
