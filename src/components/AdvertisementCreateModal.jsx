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
import axios from "axios";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, ADMIN } from "../../configs/host-config";

const AdvertisementCreateModal = ({
  isOpen,
  onClose,
  ad,
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
  const [isRequired, setIsRequired] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleSave = async () => {
    const token = sessionStorage.getItem("adminToken");
    console.log("사용중인 토큰:", token);
    if (!token) {
      alert("관리자 인증이 필요합니다.");
      return;
    }

    if (!adTitle || !adDes || !adLink || !startDate || !endDate) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // Base64 이미지를 Blob으로 변환
    const dataURLtoFile = (dataUrl, filename) => {
      const arr = dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    };

    const adData = {
      title: adTitle,
      description: adDes,
      linkUrl: adLink,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      isRequired,
    };

    const formData = new FormData();
    formData.append(
      "dto",
      new Blob([JSON.stringify(adData)], { type: "application/json" })
    );

    if (adImage?.startsWith("data:image/")) {
      const imageFile = dataURLtoFile(adImage, "adImage.png");
      formData.append("image", imageFile);
    }

    console.log(formData);

    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}${ADMIN}/ads`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            //"Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ 광고 등록 성공:", response.data);
      alert("광고가 성공적으로 등록되었습니다.");
      onClose();
      onUpdate();
    } catch (error) {
      console.error("❌ 광고 등록 오류:", error);
      alert("광고 등록에 실패했습니다.");
    }
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
            <DialogTitle className="text-2xl font-bold">광고 등록</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>광고 제목</DialogTitle>
            </DialogHeader>
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
              onChange={(e) => setAdLink(e.target.value)}
              placeholder="링크 URL을 입력하세요"
            />

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

export default AdvertisementCreateModal;
