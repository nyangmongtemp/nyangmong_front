import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const AdvertisementDetailModal = ({ isOpen, onClose, ad }) => {
  const [adId, setAdId] = useState("");
  const [adName, setAdName] = useState("");
  const [adDes, setAdDes] = useState("");
  const [adLink, setAdLink] = useState("");
  const [adImage, setAdImage] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (ad) {
      setAdId(ad.id ?? "");
      setAdName(ad.name ?? "");
      setAdDes(ad.description ?? "");
      setAdLink(ad.link ?? "");
      setAdImage(ad.imageUrl ?? "");
      setIsRequired(ad.isRequired === true || ad.isRequired === "true");
      setIsActive(ad.isActive === true || ad.isActive === "true");
      setCreatedAt(ad.createdAt ? format(new Date(ad.createdAt), "yyyy-MM-dd") : "");
      setUpdatedAt(ad.updatedAt ? format(new Date(ad.updatedAt), "yyyy-MM-dd") : "");
      setStartDate(ad.startDate ? new Date(ad.startDate) : null);
      setEndDate(ad.endDate ? new Date(ad.endDate) : null);
    }
  }, [ad]);

  if (!ad) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg space-y-4">
        <DialogHeader>
          <DialogTitle>광고 상세 정보</DialogTitle>
        </DialogHeader>

        <div>
          <label className="font-medium">광고 아이디</label>
          <input
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={adId}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">광고 제목</label>
          <input
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={adName}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">광고 설명</label>
          <input
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={adDes}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">링크 URL</label>
          <input
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={adLink}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">광고 시작일</label>
          <div className="flex items-center gap-2 border rounded px-2 py-1 bg-gray-100">
            <span>{startDate ? format(startDate, "yyyy-MM-dd") : "-"}</span>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </div>
        </div>

        <div>
          <label className="font-medium">광고 종료일</label>
          <div className="flex items-center gap-2 border rounded px-2 py-1 bg-gray-100">
            <span>{endDate ? format(endDate, "yyyy-MM-dd") : "-"}</span>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </div>
        </div>

        <div>
          <p className="font-medium">필수 노출 여부</p>
          <input
            type="text"
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={isRequired ? "예" : "아니오"}
            readOnly
          />
        </div>

        <div>
          <p className="font-medium">활성화 여부</p>
          <input
            type="text"
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={isActive ? "예" : "아니오"}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">생성일</label>
          <input
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={createdAt}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">수정일</label>
          <input
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={updatedAt}
            readOnly
          />
        </div>

        <div className="bg-gray-50 border rounded-lg h-48 flex items-center justify-center overflow-hidden">
          {adImage ? (
            <img
              src={adImage}
              alt="광고 이미지"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-gray-500">광고 이미지 없음</span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvertisementDetailModal;