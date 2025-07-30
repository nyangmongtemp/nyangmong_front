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
import axios from "axios";
import { ADMIN, API_BASE_URL } from "../../configs/host-config";

const BannerDetailModal = ({
  isOpen,
  onClose,
  banner,
  onUpdate,
  onDelete,
  onRefresh,
}) => {
  const [bannerName, setBannerName] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [thumbnailImageFile, setThumbnailImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const bannerUrl = `${API_BASE_URL}${ADMIN}/banner`;
  const token = sessionStorage.getItem("adminToken");

  React.useEffect(() => {
    if (banner) {
      setBannerName(banner.title || banner.name);
      setBannerImage(banner.thumbnailImage || banner.imageUrl);
      setThumbnailImageFile(null); // 모달 열릴 때 파일 초기화
    }
  }, [banner]);

  if (!banner) return null;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnailImageFile(file); // File 객체 저장
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
        title: bannerName, // 입력한 제목을 title로 전달
        name: bannerName, // 혹시 name도 쓰는 곳이 있으면 같이 전달
        imageUrl: bannerImage,
        thumbnailImageFile: thumbnailImageFile, // 파일 전달
      });
    }
    onClose();
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${bannerUrl}/delete/${bannerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        alert("배너가 삭제되었습니다");
        onClose();
      }
    } catch (error) {
      console.error("배너 삭제 요청 에러:", error);
    }
  };

  const { bannerId, basic } = banner || {};

  const handleCancelExpose = async () => {
    try {
      const response = await axios.patch(
        `${bannerUrl}/cancel/${bannerId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("노출이 취소 되었습니다");
        onClose();
        // 성공 시 배너 목록 갱신
        if (onRefresh) {
          await onRefresh();
        }
      }
    } catch (error) {
      console.error("노출 취소 요청 에러:", error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{banner.title || banner.name}</DialogTitle>
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
                  <Button variant="destructive" onClick={handleDelete}>
                    삭제하기
                  </Button>
                )}
                <Button onClick={handleSave}>저장하기</Button>
                {!basic && (
                  <Button
                    variant="outline"
                    className="bg-red-500 text-white hover:bg-red-600"
                    onClick={handleCancelExpose}
                  >
                    노출 취소
                  </Button>
                )}
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
