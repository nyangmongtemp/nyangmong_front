import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminSidebar from "../components/AdminSidebar";
import AdminInquiryManagement from "../components/AdminInquiryManagement";
import AdminPolicyManagement from "../components/AdminPolicyManagement";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminCustomerSupport = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const forceEmailChange = sessionStorage.getItem("forceEmailChange");
    if (forceEmailChange) {
      alert("이메일 변경을 완료해야 다른 기능을 이용할 수 있습니다.");
      navigate("/admin/mypage", { replace: true });
      return;
    }
  }, [navigate]);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-80">
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">고객센터</h1>
            </div>

            <Tabs defaultValue="inquiry" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1 m-6 mb-0">
                <TabsTrigger
                  value="inquiry"
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
                >
                  1:1 문의 (DM)
                </TabsTrigger>
                <TabsTrigger
                  value="medical"
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
                >
                  이용약관 관리
                </TabsTrigger>
                <TabsTrigger
                  value="policy"
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
                >
                  개인정보처리방침 관리
                </TabsTrigger>
                <TabsTrigger
                  value="qna"
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
                >
                  Q&A
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inquiry" className="p-6">
                <AdminInquiryManagement />
              </TabsContent>

              <TabsContent value="medical" className="p-6">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    이용약관 관리
                  </h3>
                  <p className="text-gray-500">
                    이용약관 관리 기능이 준비 중입니다.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="policy" className="p-6">
                <AdminPolicyManagement />
              </TabsContent>

              <TabsContent value="qna" className="p-6">
                <div className="space-y-4">
                  <div className="border rounded-lg">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
                        <span>제목</span>
                        <span>내용</span>
                        <span>작성자</span>
                        <span>생성일자</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <span>1번 Q&A</span>
                        <span>회원가입 오류 발생 관련 공지</span>
                        <span>도진호</span>
                        <span>2025.06.24 12:47</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      생성 버튼
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerSupport;
