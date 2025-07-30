import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminSidebar from "../components/AdminSidebar";
import AdminInquiryManagement from "../components/AdminInquiryManagement";
import AdminTermsManagement from "../components/AdminTermsManagement";
import AdminPolicyManagement from "../components/AdminPolicyManagement";
import AdminQnaManagement from "../components/AdminQnaManagement";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const AdminCustomerSupport = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("inquiry");

  useEffect(() => {
    const forceEmailChange = sessionStorage.getItem("forceEmailChange");
    if (forceEmailChange) {
      alert("이메일 변경을 완료해야 다른 기능을 이용할 수 있습니다.");
      navigate("/admin/mypage", { replace: true });
      return;
    }

    // URL 파라미터에서 탭 값 읽기
    const tabParam = searchParams.get("tab");
    if (tabParam && ["inquiry", "terms", "policy", "qna"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [navigate, searchParams]);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-80">
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">고객센터</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full p-3" style={{ paddingBottom: '0px' }}>
              <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1">
                <TabsTrigger
                  value="inquiry"
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
                >
                  1:1 문의 (DM)
                </TabsTrigger>
                <TabsTrigger
                  value="terms"
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

              <TabsContent value="terms" className="p-6">
                <AdminTermsManagement />
              </TabsContent>

              <TabsContent value="policy" className="p-6">
                <AdminPolicyManagement />
              </TabsContent>

              <TabsContent value="qna" className="p-6">
                <AdminQnaManagement />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerSupport;
