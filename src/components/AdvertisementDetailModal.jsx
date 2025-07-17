import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import ImageCropModal from "./ImageCropModal";

const AdvertisementDetailModal = ({
  isOpen,
  onClose,
  banner,
  onUpdate,
  onDelete,
}) => {
  const [bannerName, setBannerName] = useState("");
  const [bannerDes, setBannerDes] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (banner) {
      setBannerName(banner.name);
      setBannerDes(banner.description);
      setBannerImage(banner.imageUrl);
      setStartDate(banner.startDate ? new Date(banner.startDate) : null);
      setEndDate(banner.endDate ? new Date(banner.endDate) : null);
    }
  }, [banner]);

  if (!banner) return null;

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

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...banner,
        name: bannerName,
        imageUrl: bannerImage,
        description: bannerDes,
        startDate,
        endDate,
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
            <DialogTitle>광고 이름 </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={bannerName}
              onChange={(e) => setBannerName(e.target.value)}
              placeholder="광고 이름을 입력하세요"
            />

            <DialogHeader>
              <DialogTitle>광고 설명</DialogTitle>
            </DialogHeader>
            <Input
              value={bannerDes}
              onChange={(e) => setBannerDes(e.target.value)}
              placeholder="설명을 입력하세요"
            />

            {/* 날짜 선택 */}
            <div className="space-y-2">
              <DialogHeader>
                <DialogTitle>광고 시작일</DialogTitle>
              </DialogHeader>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {startDate
                      ? format(startDate, "yyyy-MM-dd")
                      : "시작일을 선택하세요"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <DialogHeader>
                <DialogTitle>광고 종료일</DialogTitle>
              </DialogHeader>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {endDate
                      ? format(endDate, "yyyy-MM-dd")
                      : "종료일을 선택하세요"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 이미지 영역 */}
            <div className="bg-gray-50 border rounded-lg h-48 flex items-center justify-center overflow-hidden">
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="광고 이미지"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-gray-500">광고 이미지</span>
              )}
            </div>

            {/* 버튼 영역 */}
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

export default AdvertisementDetailModal;
