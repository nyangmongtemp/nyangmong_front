import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, ADMIN } from "../../configs/host-config";

const AdvertisementDetailModal = ({ isOpen, onClose, adId }) => {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAdDetail = async () => {
      if (!adId) return;
      const token = sessionStorage.getItem("adminToken");
      try {
        const res = await axiosInstance.get(
          `${API_BASE_URL}${ADMIN}/ads/${adId}`
        );
        setAd(res.data.result);
      } catch (error) {
        console.error("광고 상세 조회 실패:", error);
      }
    };

    fetchAdDetail();
  }, [adId]);

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
            value={ad.id ?? ""}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">광고 제목</label>
          <input
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={ad.title ?? ""}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">광고 설명</label>
          <input
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={ad.description ?? ""}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">링크 URL</label>
          <input
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={ad.linkUrl ?? ""}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">광고 시작일</label>
          <div className="flex items-center gap-2 border rounded px-2 py-1 bg-gray-100">
            <span>
              {ad.startDate
                ? format(new Date(ad.startDate), "yyyy-MM-dd")
                : "-"}
            </span>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </div>
        </div>

        <div>
          <label className="font-medium">광고 종료일</label>
          <div className="flex items-center gap-2 border rounded px-2 py-1 bg-gray-100">
            <span>
              {ad.endDate ? format(new Date(ad.endDate), "yyyy-MM-dd") : "-"}
            </span>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </div>
        </div>

        <div>
          <p className="font-medium">필수 노출 여부</p>
          <input
            type="text"
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={ad.confirmed ? "예" : "아니오"}
            readOnly
          />
        </div>

        <div>
          <p className="font-medium">활성화 여부</p>
          <input
            type="text"
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={ad.active ? "예" : "아니오"}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">생성일</label>
          <input
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={
              ad.createAt ? format(new Date(ad.createAt), "yyyy-MM-dd") : ""
            }
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">수정일</label>
          <input
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={
              ad.updateAt ? format(new Date(ad.updateAt), "yyyy-MM-dd") : ""
            }
            readOnly
          />
        </div>

        <div className="bg-gray-50 border rounded-lg h-48 flex items-center justify-center overflow-hidden">
          {ad.thumbnailImage ? (
            <img
              src={ad.thumbnailImage}
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
