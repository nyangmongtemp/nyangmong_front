
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { getAdminInquiryDetail, patchAdminInquiryReply } from "../../configs/api-utils";

const InquiryDetailModal = ({ isOpen, onClose, informId }) => {
  const [data, setData] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (!isOpen || !informId) return;
    setLoading(true);
    getAdminInquiryDetail(informId)
      .then((res) => {
        setData(res);
        setResponseText(res.reply || "");
        setIsEditing(false);
        setValidationError("");
      })
      .catch((e) => setError(e.message || "상세 조회 실패"))
      .finally(() => setLoading(false));
  }, [isOpen, informId]);

  // 답변 등록/재등록 버튼 클릭 핸들러
  const handleRegisterClick = async () => {
    // 유효성 검사: 빈값, 엔터/스페이스만 입력 불가
    if (!responseText || !responseText.replace(/\s/g, "")) {
      setValidationError("답변 내용을 입력해 주세요.");
      return;
    }
    setValidationError("");
    if (!window.confirm("답변을 등록하시겠습니까?")) {
      return;
    }
    setRegistering(true);
    try {
      await patchAdminInquiryReply(informId, responseText);
      // 등록 성공 시 상세 재조회
      const res = await getAdminInquiryDetail(informId);
      setData(res);
      setIsEditing(false);
      alert("답변이 등록되었습니다.");
      onClose();
    } catch (e) {
      setValidationError(e.message || "답변 등록에 실패했습니다.");
    } finally {
      setRegistering(false);
    }
  };

  // 날짜 포맷 함수 (중복 정의 방지, 없으면 추가)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>문의 상세</DialogTitle>
        </DialogHeader>
        {loading && <div>로딩중...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {data && (
          <div className="space-y-6">
            {/* 사용자이름/이메일, 답변여부/문의일시 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사용자 이름</label>
                <Input value={data.userName} readOnly className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <Input value={data.userEmail} readOnly className="bg-gray-50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">답변여부</label>
                <Input value={data.answered ? "답변완료" : "미답변"} readOnly className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">문의일시</label>
                <Input value={formatDate(data.createAt)} readOnly className="bg-gray-50" />
              </div>
            </div>
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
              <Input value={data.title} readOnly className="bg-gray-50" />
            </div>
            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
              <Textarea value={data.content} readOnly className="bg-gray-50 min-h-[200px] resize-none" />
            </div>
            {/* 답변 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">관리자 이름</label>
                <Input value={data.answered ? (data.adminName || "-") : "-"} readOnly className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">답변일시</label>
                <Input value={data.answered ? formatDate(data.updateAt) : "-"} readOnly className="bg-gray-50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">답변</label>
              <Textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className={`min-h-[200px] resize-none ${data.answered && !isEditing ? 'bg-gray-50' : ''}`}
                readOnly={data.answered && !isEditing}
              />
              {validationError && <div className="text-red-500 text-sm mt-1">{validationError}</div>}
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                취소
              </Button>
              {data.answered ? (
                isEditing ? (
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleRegisterClick} disabled={registering}>
                    {registering ? "등록 중..." : "답변 등록"}
                  </Button>
                ) : (
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsEditing(true)}>
                    답변 재등록
                  </Button>
                )
              ) : (
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleRegisterClick} disabled={registering}>
                  {registering ? "등록 중..." : "답변 등록"}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InquiryDetailModal;
