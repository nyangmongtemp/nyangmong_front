
import React, { useState } from "react";
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

const ReportHistoryModal = ({ isOpen, onClose, userId }) => {
  const [suspensionReason, setSuspensionReason] = useState("");
  const [suspensionDays, setSuspensionDays] = useState("");

  // 임시 신고 이력 데이터
  const reportHistory = [
    {
      id: 1,
      date: "2024-06-20",
      reporter: "신고자 이름",
      reason: "부적절한 게시물 등록",
      content: "신고자 이메일 / 신고 카테고리"
    },
    {
      id: 2,
      date: "2024-06-15",
      reporter: "신고자 이름",
      reason: "부적절한 게시물 등록",
      content: "신고자 이메일 / 신고 카테고리"
    }
  ];

  const handleSubmit = () => {
    console.log("처리하기:", { suspensionReason, suspensionDays });
    // 처리 로직 구현
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>사용자의 신고 이력</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 신고 이력 목록 */}
          <div className="space-y-4">
            {reportHistory.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">{report.date}</div>
                    <div className="font-medium mb-1">{report.reporter}</div>
                    <div className="text-sm text-gray-800 mb-2">{report.reason}</div>
                    <div className="text-sm text-gray-600">{report.content}</div>
                  </div>
                  <Button variant="outline" size="sm">
                    신고 확인
                  </Button>
                </div>
              </div>
            ))}
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

          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">사용자의 신고 처리에관한니다. → 더불공을 부정적?</span>
            </div>
            <div className="text-xs text-gray-500">
              지 현재누구니다. 속성은, 들구 되의 설정 접굴에글입니다. 프로필없을 내용인그 옹습니다. 옵 고르 허위 정보보이아누없을.
              보화이잇년 프로필무트 옵습니다 옴습니다.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportHistoryModal;
