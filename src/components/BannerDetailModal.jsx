
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageCropModal from "./ImageCropModal";

const BannerDetailModal = ({ isOpen, onClose, banner, onUpdate, onDelete }) => {
  const [bannerName, setBannerName] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    if (banner) {
      setBannerName(banner.name);
      setBannerImage(banner.imageUrl);
    }
  }, [banner]);

  if (!banner) return null;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
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

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...banner,
        name: bannerName,
        imageUrl: bannerImage
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (banner.type === "custom" && onDelete) {
      onDelete(banner.id);
    }
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
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

            <div className="bg-gray-50 border rounded-lg h-48 flex items-center justify-center overflow-hidden">
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

            <div className="flex justify-between">
              <Button 
                onClick={handleImageClick}
                className="bg-blue-600 hover:bg-blue-700"
              >
                이미지 수정하기
              </Button>
              
              <div className="space-x-2">
                {banner.type === "custom" && (
                  <Button 
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    삭제하기
                  </Button>
                )}
                <Button onClick={handleSave}>
                  저장하기
                </Button>
              </div>
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

export default BannerDetailModal;
