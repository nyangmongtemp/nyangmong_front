import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminInquiryDetail, patchAdminInquiryReply } from "../../configs/api-utils";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";

const AdminInquiryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseText, setResponseText] = useState("");

  // 날짜 포맷 함수
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

  useEffect(() => {
    fetchInquiryData();
  }, [id]);

  const fetchInquiryData = async () => {
    setLoading(true);
    try {
      const result = await getAdminInquiryDetail(id);
      setData(result);
      setResponseText(result.reply || "");
      setIsEditing(false);
    } catch (error) {
      setError(error.message || "문의 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!responseText.trim()) {
      toast({
        title: "오류",
        description: "답변 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 확인 다이얼로그
    if (!window.confirm("답변을 등록하시겠습니까?")) {
      return;
    }

    setIsSubmitting(true);

    try {
      await patchAdminInquiryReply(id, responseText);
      
      toast({
        title: "성공",
        description: "답변이 등록되었습니다.",
      });
      
      setIsEditing(false);
      fetchInquiryData(); // 데이터 다시 불러오기
    } catch (error) {
      console.error("답변 등록 오류:", error);
      toast({
        title: "오류",
        description: "답변 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      if (window.confirm("수정 중인 내용이 사라집니다. 정말 취소하시겠습니까?")) {
        setIsEditing(false);
        setResponseText(data.reply || "");
      }
    } else {
      navigate("/admin/support?tab=inquiry");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 ml-80">
          <div className="p-8">
            <div className="text-center py-8">로딩중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 ml-80">
          <div className="p-8">
            <div className="text-red-500 text-center py-8">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-80">
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">고객센터</h1>
            </div>
            
            <div className="p-3" style={{ paddingBottom: '0px' }}>
              <div className="p-6">
                <div className="mx-auto">
                  <div className="flex justify-between items-center mb-6">
                    
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      ← 뒤로가기
                    </Button>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>문의 상세</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">사용자 이름</Label>
                            <Input value={data?.userName} readOnly className="bg-gray-50" />
                          </div>
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">이메일</Label>
                            <Input value={data?.userEmail} readOnly className="bg-gray-50" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">답변여부</Label>
                            <Input value={data?.answered ? "답변완료" : "미답변"} readOnly className="bg-gray-50" />
                          </div>
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">문의일시</Label>
                            <Input value={formatDate(data?.createAt)} readOnly className="bg-gray-50" />
                          </div>
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-gray-700 mb-2">제목</Label>
                          <Input value={data?.title} readOnly className="bg-gray-50" />
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-gray-700 mb-2">내용</Label>
                          <Textarea
                            value={data?.content}
                            readOnly
                            className="min-h-[200px] bg-gray-50 resize-none"
                          />
                        </div>

                        {data?.answered && (
                          <>
                            <div>
                              <Label className="block text-sm font-medium text-gray-700 mb-2">관리자 이름</Label>
                              <Input value={data?.adminName || "-"} readOnly className="bg-gray-50" />
                            </div>
                            <div>
                              <Label className="block text-sm font-medium text-gray-700 mb-2">답변일시</Label>
                              <Input value={formatDate(data?.updateAt)} readOnly className="bg-gray-50" />
                            </div>
                          </>
                        )}

                        <div>
                          <Label className="block text-sm font-medium text-gray-700 mb-2">답변</Label>
                          <Textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="답변을 입력하세요"
                            className="min-h-[200px] resize-none"
                            readOnly={!isEditing}
                          />
                        </div>

                        <div className="flex justify-end space-x-3 pt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                          >
                            {isEditing ? "취소" : "목록"}
                          </Button>
                          {isEditing ? (
                            <Button
                              type="submit"
                              className="bg-blue-600 hover:bg-blue-700"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "등록 중..." : "답변등록"}
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => setIsEditing(true)}
                            >
                              {data?.answered ? "답변재등록" : "답변등록"}
                            </Button>
                          )}
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInquiryDetail; 