
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getUserReportHistory, patchReportConfirm } from "../../configs/api-utils";

const getCategoryLabel = (category) => {
  switch (category) {
    case "COMMENT":
      return "댓글/대댓글";
    case "CHAT":
      return "채팅";
    case "BOARD":
      return "게시글";
    default:
      return category;
  }
};

const ReportHistoryModal = ({ isOpen, onClose, userId }) => {
  const [suspensionReason, setSuspensionReason] = useState("");
  const [suspensionDays, setSuspensionDays] = useState("");
  const [reportHistory, setReportHistory] = useState([]);
  const [accuseUserName, setAccuseUserName] = useState("");
  const [accuseUserEmail, setAccuseUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !userId) return;
    setLoading(true);
    setError(null);
    getUserReportHistory(userId)
      .then((result) => {
        setReportHistory(result || []);
        if (result && result.length > 0) {
          setAccuseUserName(result[0].accuseUserName || "");
          setAccuseUserEmail(result[0].accuseUserEmail || "");
        } else {
          setAccuseUserName("");
          setAccuseUserEmail("");
        }
      })
      .catch((e) => setError(e.message || "신고 이력 조회 실패"))
      .finally(() => setLoading(false));
  }, [isOpen, userId]);

  const handleSubmit = () => {
    console.log("처리하기:", { suspensionReason, suspensionDays });
    // 처리 로직 구현
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {accuseUserName && accuseUserEmail
              ? `${accuseUserName}(${accuseUserEmail}) 사용자의 신고 이력`
              : "사용자의 신고 이력"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 신고 이력 목록 */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="text-center text-gray-500">불러오는 중...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : reportHistory.length === 0 ? (
              <div className="text-center text-gray-400">신고 이력이 없습니다.</div>
            ) : (
              reportHistory.map((report) => (
                <div key={report.reportId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-base text-gray-600 mb-1">
                        <span className="font-semibold">신고날짜: </span>
                        {report.createAt?.slice(0, 16).replace("T", " ")}
                      </div>
                      <div className="text-base mb-1">
                        <span className="font-semibold">신고자: </span>
                        <span className="font-normal">{report.reportUserName} ({report.reportUserEmail})</span>
                      </div>
                      <div className="text-base mb-1">
                        <span className="font-semibold">신고 콘텐츠: </span>
                        <span className="font-normal">{getCategoryLabel(report.category)}</span>
                      </div>
                      <div className="text-base">
                        <span className="font-semibold">신고 내용: </span>
                        <span className="font-normal whitespace-pre-line">{report.content}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={async () => {
                      if (!window.confirm("신고 기록을 확인하셨으면 확인 아니라면 취소를 클릭해주세요.(확인 시 신고 기록이 삭제됩니다.)")) return;
                      try {
                        await patchReportConfirm(report.reportId);
                        setReportHistory((prev) => prev.filter((r) => r.reportId !== report.reportId));
                      } catch (e) {
                        alert("신고 확인 중 오류가 발생했습니다");
                      }
                    }}>
                      신고 확인
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t pt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* 정지사유 선택 */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  정지사유 카테고리 선택
                </Label>
                <Select value={suspensionReason} onValueChange={setSuspensionReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="정지사유를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inappropriate-content">부적절한 콘텐츠</SelectItem>
                    <SelectItem value="spam">스팸 행위</SelectItem>
                    <SelectItem value="harassment">괴롭힘</SelectItem>
                    <SelectItem value="fraud">사기 행위</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 정지 일수 선택 */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  정지 일수 (라디오버튼)
                </Label>
                <RadioGroup value={suspensionDays} onValueChange={setSuspensionDays}>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="1day" />
                      <Label htmlFor="1day" className="text-sm">1일</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="3days" />
                      <Label htmlFor="3days" className="text-sm">3일</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="7" id="7days" />
                      <Label htmlFor="7days" className="text-sm">7일</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="15" id="15days" />
                      <Label htmlFor="15days" className="text-sm">15일</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30" id="30days" />
                      <Label htmlFor="30days" className="text-sm">30일</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="permanent" id="permanent" />
                      <Label htmlFor="permanent" className="text-sm">무기한</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="text-right mt-6">
              <Button onClick={handleSubmit} disabled={!suspensionReason || !suspensionDays}>
                처리하기
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportHistoryModal;
