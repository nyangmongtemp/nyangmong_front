
import React, { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Crop, X } from "lucide-react";

const ImageCropModal = ({ isOpen, onClose, imageSrc, onCropComplete, outputType = "image/jpeg" }) => {
  const [crop, setCrop] = useState({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const onImageLoad = (e) => {
    imageRef.current = e.currentTarget;
  };

  const handleCropComplete = () => {
    if (!completedCrop || !imageRef.current) return;

    const canvas = canvasRef.current;
    const image = imageRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedImageUrl = URL.createObjectURL(blob);
        onCropComplete(croppedImageUrl, blob);
        onClose();
      }
    }, outputType, 0.8);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Crop className="h-5 w-5" />
            <span>이미지 크롭</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {imageSrc && (
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={undefined}
                className="max-w-full"
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  onLoad={onImageLoad}
                  alt="크롭할 이미지"
                  className="max-w-full h-auto"
                />
              </ReactCrop>
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="hidden"
          />

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              onClick={handleCropComplete}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={!completedCrop}
            >
              크롭 완료
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropModal;
