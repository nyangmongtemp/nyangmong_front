import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import { getAdminUserDetail } from "../../configs/api-utils";
import ReportHistoryModal from "@/components/ReportHistoryModal";

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    // 권한 체크: BOSS, CONTENT만 접근 가능
    const adminRole = sessionStorage.getItem("adminRole");
    if (adminRole !== "BOSS" && adminRole !== "CONTENT") {
      alert("접근 권한이 없습니다.");
      navigate("/admin", { replace: true });
      return;
    }
    setLoading(true);
    getAdminUserDetail(id)
      .then(setData)
      .catch((e) => setError(e.message || "상세 조회 실패"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="p-8">로딩중...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!data) return <div className="p-8">데이터가 없습니다.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-80 p-8">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">사용자 상세 정보</h1>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">이름</span>
              <span>{data.userName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">이메일</span>
              <span>{data.email}</span>
          </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">닉네임</span>
              <span>{data.nickname}</span>
                  </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">주소</span>
              <span>{data.address || "-"}</span>
                </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">전화번호</span>
              <span>{data.phone || "-"}</span>
                  </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">소셜ID</span>
              <span>{data.socialId || "-"}</span>
                </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">소셜 Provider</span>
              <span>{data.socialProvider || "-"}</span>
              </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">계정 활성화</span>
              <span>{data.active ? "활성화" : "비활성화"}</span>
                  </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">신고횟수</span>
              <span>
                {data.reportCount}
                <button
                  className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setIsReportModalOpen(true)}
                    >
                  신고이력 보기
                </button>
                    </span>
                  </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">정지횟수</span>
              <span>{data.pauseCount}</span>
        </div>
      </div>
      <ReportHistoryModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userId={id}
      />
          <div className="mt-8 flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => navigate(-1)}
            >
              목록으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
