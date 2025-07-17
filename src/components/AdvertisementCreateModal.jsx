import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageCropModal from "./ImageCropModal";

const AdvertisementCreateModal = ({ isOpen, onClose, onCreate }) => {
  const [bannerName, setBannerName] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl) => {
    setBannerImage(croppedImageUrl);
    setIsCropModalOpen(false);
  };

  const handleSubmit = () => {
    if (bannerName.trim() && bannerImage) {
      if (onCreate) {
        onCreate({
          name: bannerName,
          imageUrl: bannerImage,
        });
      }
      setBannerName("");
      setBannerImage("");
      onClose();
    }
  };

  const handleClose = () => {
    setBannerName("");
    setBannerImage("");
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>배너 이름 (입력 가능)</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={bannerName}
              onChange={(e) => setBannerName(e.target.value)}
              placeholder="배너 이름을 입력하세요"
            />

            <div
              className="bg-gray-50 border rounded-lg h-48 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={handleImageClick}
            >
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="배너 이미지"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-gray-500">배너 이미지</span>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!bannerName.trim() || !bannerImage}
              >
                배너 등록하기
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </DialogContent>
      </Dialog>

      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
      />
    </>
  );
};

export default AdvertisementCreateModal;
