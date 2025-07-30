import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAdminTerms } from "../../configs/api-utils";
import CKEditorWrapper from "@/components/CKEditorWrapper";
import AdminSidebar from "@/components/AdminSidebar";

const AdminQnaCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!window.confirm("Q&A를 등록하시겠습니까?")) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createAdminTerms("qna", formData);
      
      alert("Q&A가 등록되었습니다.");
      
      navigate("/admin/support?tab=qna");
    } catch (error) {
      console.error("Q&A 등록 오류:", error);
      alert("Q&A 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("작성 중인 내용이 사라집니다. 정말 나가시겠습니까?")) {
      navigate("/admin/support?tab=qna");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-80">
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">고객센터</h1>
            </div>
            
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
                      <CardTitle>Q&A 등록</CardTitle>
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
                            required
                          />
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-gray-700 mb-2">
                            내용
                          </Label>
                          <CKEditorWrapper
                            value={formData.content}
                            onChange={(data) => setFormData({ ...formData, content: data })}
                            placeholder="내용을 입력하세요"
                            minHeight={400}
                            maxHeight={400}
                          />
                        </div>

                        <div className="flex justify-end space-x-3 pt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                          >
                            취소
                          </Button>
                          <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "등록 중..." : "등록"}
                          </Button>
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
  );
};

export default AdminQnaCreate; 