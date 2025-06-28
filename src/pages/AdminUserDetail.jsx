import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportHistoryModal from "@/components/ReportHistoryModal";

const AdminUserDetail = () => {
  const { id } = useParams();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // 임시 사용자 데이터
  const userData = {
    id: id,
    name: "사용자 이름",
    email: "user@example.com",
    phone: "010-1234-5678",
    address: "서울시 강남구",
    joinDate: "2024-01-15",
    lastLogin: "2024-06-25",
    status: "활성화",
    reportCount: 3,
    posts: 25,
    comments: 87,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="ml-80 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              사용자 상세 정보
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsReportModalOpen(true)}
              >
                신고 이력
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용자 이름
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {userData.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {userData.email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전화번호
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {userData.phone}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    주소
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {userData.address}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    가입일자
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {userData.joinDate}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최근 접속일
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {userData.lastLogin}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    계정 상태
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        userData.status === "활성화"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {userData.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    신고 횟수
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {userData.reportCount}회
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    작성 글 수
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {userData.posts}개
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ReportHistoryModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userId={id}
      />
    </div>
  );
};

export default AdminUserDetail;
