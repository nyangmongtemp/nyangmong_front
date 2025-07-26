import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CKEditorWrapper from "./CKEditorWrapper";
import { getAdminTermsLastPost, createAdminTerms, updateAdminTerms } from "../../configs/api-utils";

const AdminTermsManagement = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
    fetchTermsData();
  }, []);

  const fetchTermsData = async () => {
    setLoading(true);
    try {
      const result = await getAdminTermsLastPost();
      setData(result);
      if (result) {
        setFormData({
          title: result.title || "",
          content: result.content || "",
        });
      }
    } catch (error) {
      setError(error.message || "약관 조회에 실패했습니다.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // 원래 데이터로 복원
    if (data) {
      setFormData({
        title: data.title || "",
        content: data.content || "",
      });
    }
  };

  const handleSubmit = async () => {
    const action = data ? "수정" : "등록";
    if (!window.confirm(`약관을 ${action}하시겠습니까?`)) {
      return;
    }

    try {
      if (data) {
        await updateAdminTerms('terms', data.id, formData);
        alert("약관이 수정되었습니다.");
      } else {
        await createAdminTerms('terms', formData);
        alert("약관이 등록되었습니다.");
      }
      setIsEditing(false);
      await fetchTermsData();
    } catch (error) {
      alert(error.message || "작업에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className="text-center py-8">로딩중...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">이용약관 관리</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            readOnly={!isEditing && data !== null}
            className={!isEditing && data !== null ? "bg-gray-50" : ""}
            placeholder="제목을 입력하세요"
          />
        </div>

        {data && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">관리자 이름</label>
            <Input
              value={data.adminName || "-"}
              readOnly
              className="bg-gray-50"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
          {(!data || isEditing) ? (
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

        {data && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">등록일</label>
              <p className="text-sm text-gray-900 py-2">
                {formatDate(data.createAt)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">수정일</label>
              <p className="text-sm text-gray-900 py-2">
                {formatDate(data.updateAt)}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          {!isEditing ? (
            data ? (
              <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                수정
              </Button>
            ) : (
              <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                등록
              </Button>
            )
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                {data ? "수정완료" : "등록"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTermsManagement; 