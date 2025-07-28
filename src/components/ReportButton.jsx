import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, USER } from "../../configs/host-config";
import { Flag } from "lucide-react";

const ReportButton = ({ category, accusedUserId }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log(category, accusedUserId, reason);

      const res = await axiosInstance.post(`${API_BASE_URL}${USER}/report`, {
        userId: accusedUserId,
        category: category,
        content: reason,
      });
      console.log(res);
      setOpen(false);
      setReason("");
      alert("신고가 접수되었습니다.");
    } catch (e) {
      alert("신고 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-500 hover:bg-red-50 border border-transparent rounded-md px-2 py-1 text-xs"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Flag className="w-4 h-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>신고하기</DialogTitle>
          </DialogHeader>
          <div className="mb-2 text-sm text-gray-700">
            신고 사유를 입력해 주세요.
          </div>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="신고 사유를 입력하세요"
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!reason.trim() || loading}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {loading ? "신고 중..." : "신고하기"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportButton;
