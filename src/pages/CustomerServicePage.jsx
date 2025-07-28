import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CustomerInquiry from "@/components/CustomerInquiry";
import CustomerTerms from "@/components/CustomerTerms";
import CustomerPrivacy from "@/components/CustomerPrivacy";
import CustomerQnA from "@/components/CustomerQnA";

const CustomerServicePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("inquiry");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* 뒤로가기 버튼 */}
            <div className="mb-6">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>뒤로가기</span>
              </button>
            </div>

            {/* 페이지 제목 */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                고객센터
              </h1>
            </div>

            {/* 탭 메뉴 */}
            <div className="bg-white rounded-lg border">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1 m-6 mb-0">
                  <TabsTrigger
                    value="inquiry"
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
                  >
                    고객 문의
                  </TabsTrigger>
                  <TabsTrigger
                    value="terms"
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
                  >
                    이용약관 관리
                  </TabsTrigger>
                  <TabsTrigger
                    value="privacy"
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
                  <CustomerInquiry />
                </TabsContent>

                <TabsContent value="terms" className="p-6">
                  <CustomerTerms />
                </TabsContent>

                <TabsContent value="privacy" className="p-6">
                  <CustomerPrivacy />
                </TabsContent>

                <TabsContent value="qna" className="p-6">
                  <CustomerQnA />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <div className="w-80 flex-shrink-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default CustomerServicePage;
