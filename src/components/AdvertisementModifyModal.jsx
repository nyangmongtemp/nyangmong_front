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

const AdvertisementModifyModal = ({
  isOpen,
  onClose,
  ad,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [adTitle, setAdTitle] = useState("");
  const [adDes, setAdDes] = useState("");
  const [adLink, setAdLink] = useState("");
  const [adImage, setAdImage] = useState("");
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateError, setDateError] = useState("");
  const fileInputRef = useRef(null);
  const [isRequired, setIsRequired] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (ad) {
      setAdTitle(ad.name || "");
      setAdDes(ad.description || "");
      setAdLink(ad.link || "");
      setAdImage(ad.imageUrl || "");
      setStartDate(ad.startDate ? new Date(ad.startDate) : null);
      setEndDate(ad.endDate ? new Date(ad.endDate) : null);
    } else {
      setAdTitle("");
      setAdDes("");
      setAdLink("");
      setAdImage("");
      setStartDate(null);
      setEndDate(null);
    }
  }, [ad]);

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
    setAdImage(croppedImageUrl);
    setIsCropModalOpen(false);
  };

  const handleSave = () => {
    if (startDate && endDate && endDate < startDate) {
      setDateError("종료일은 시작일보다 빠를 수 없습니다.");
      return;
    }
    setDateError("");

    const payload = {
      title: adTitle,
      description: adDes,
      link: adLink, // ✅ payload에 추가
      image_url: adImage,
      startDate,
      endDate,
    };

    if (ad) {
      onUpdate?.({ ...ad, ...payload });
    } else {
      onCreate?.(payload);
    }

    onClose();
  };

  const handleDelete = () => {
    if (ad?.type === "custom") {
      onDelete?.(ad.id);
    }
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              광고 수정
            </DialogTitle>
          </DialogHeader>
          <DialogHeader>
            <DialogTitle>광고 제목</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={adTitle}
              onChange={(e) => setAdTitle(e.target.value)}
              placeholder="광고 제목을 입력하세요"
            />
            <DialogHeader>
              <DialogTitle>광고 설명</DialogTitle>
            </DialogHeader>
            <Input
              value={adDes}
              onChange={(e) => setAdDes(e.target.value)}
              placeholder="설명을 입력하세요"
            />
            <DialogHeader>
              <DialogTitle>광고 링크 url</DialogTitle>
            </DialogHeader>

            <Input
              value={adLink}
              onChange={(e) => setAdLink(e.target.value)} // ✅ 올바른 핸들러
              placeholder="링크 URL을 입력하세요"
            />

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

              {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
            </div>

            <div className="space-y-4">
              {/* 광고 노출 필수 여부 */}
              <div>
                <DialogHeader>
                  <DialogTitle>광고 노출 필수 여부</DialogTitle>
                </DialogHeader>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="isRequired"
                      value="true"
                      checked={isRequired === true}
                      onChange={() => setIsRequired(true)}
                    />
                    <span>예</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="isRequired"
                      value="false"
                      checked={isRequired === false}
                      onChange={() => setIsRequired(false)}
                    />
                    <span>아니오</span>
                  </label>
                </div>
              </div>

              {/* 활성화 여부 */}
              <div>
                < DialogHeader>
                  <DialogTitle>활성화 여부</DialogTitle>
                </DialogHeader>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="isActive"
                      value="true"
                      checked={isActive === true}
                      onChange={() => setIsActive(true)}
                    />
                    <span>예</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="isActive"
                      value="false"
                      checked={isActive === false}
                      onChange={() => setIsActive(false)}
                    />
                    <span>아니오</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border rounded-lg h-48 flex items-center justify-center overflow-hidden">
              {adImage ? (
                <img
                  src={adImage}
                  alt="광고 이미지"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-gray-500">광고 이미지</span>
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
                {ad?.type === "custom" && (
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

export default AdvertisementModifyModal;