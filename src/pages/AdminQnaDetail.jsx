import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminTermsDetail, updateAdminTerms } from "../../configs/api-utils";
import CKEditorWrapper from "@/components/CKEditorWrapper";
import AdminSidebar from "@/components/AdminSidebar";

const AdminQnaDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

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
    fetchQnaData();
  }, [id]);

  const fetchQnaData = async () => {
    setLoading(true);
    try {
      const result = await getAdminTermsDetail("qna", id);
      setData(result);
      setFormData({
        title: result.title || "",
        content: result.content || "",
      });
    } catch (error) {
      setError(error.message || "Q&A 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!formData.content.trim() || formData.content === "<p><br></p>") {
      alert("내용을 입력해주세요.");
      return;
    }

    // 확인 다이얼로그
    if (!window.confirm("Q&A를 수정하시겠습니까?")) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateAdminTerms("qna", id, formData);
      
      alert("Q&A가 수정되었습니다.");
      
      setIsEditing(false);
      fetchQnaData(); // 데이터 다시 불러오기
    } catch (error) {
      console.error("Q&A 수정 오류:", error);
      alert("Q&A 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleModifyClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    // 유효성 검사
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!formData.content.trim() || formData.content === "<p><br></p>") {
      alert("내용을 입력해주세요.");
      return;
    }

    // 확인 다이얼로그
    if (!window.confirm("Q&A를 수정하시겠습니까?")) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateAdminTerms("qna", id, formData);
      
      alert("Q&A가 수정되었습니다.");
      
      setIsEditing(false);
      fetchQnaData(); // 데이터 다시 불러오기
    } catch (error) {
      console.error("Q&A 수정 오류:", error);
      alert("Q&A 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      if (window.confirm("수정 중인 내용이 사라집니다. 정말 취소하시겠습니까?")) {
        setIsEditing(false);
        setFormData({
          title: data.title || "",
          content: data.content || "",
        });
      }
    } else {
      navigate("/admin/support?tab=qna");
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
                      <CardTitle>Q&A 상세</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                            제목
                          </Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="제목을 입력하세요"
                            className="mt-1"
                            readOnly={!isEditing}
                            required
                          />
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-gray-700 mb-2">
                            관리자 이름
                          </Label>
                          <Input
                            value={data?.adminName || "-"}
                            readOnly
                            className="mt-1 bg-gray-50"
                          />
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-gray-700 mb-2">
                            내용
                          </Label>
                          {isEditing ? (
                            <CKEditorWrapper
                              value={formData.content}
                              onChange={(data) => setFormData({ ...formData, content: data })}
                              placeholder="내용을 입력하세요"
                              minHeight={400}
                              maxHeight={400}
                            />
                          ) : (
                            <div 
                              className="min-h-[400px] max-h-[400px] overflow-y-auto border border-gray-300 rounded-md p-3 bg-gray-50"
                              dangerouslySetInnerHTML={{ __html: formData.content || "내용이 없습니다." }}
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                              등록일
                            </Label>
                            <Input
                              value={formatDate(data?.createAt)}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                              수정일
                            </Label>
                            <Input
                              value={formatDate(data?.updateAt)}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
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
                              type="button"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={handleUpdateClick}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "수정 중..." : "수정완료"}
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={handleModifyClick}
                            >
                              수정
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

export default AdminQnaDetail; 