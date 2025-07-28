import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, TERMS } from "../../configs/host-config";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const CustomerQnADetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}`;
  };

  useEffect(() => {
    fetchQnAData();
  }, [id]);

  const fetchQnAData = async () => {
    setLoading(true);
    try {
      console.log("클릭된 termsId:", id);
      const response = await axiosInstance.get(
        `${API_BASE_URL}${TERMS}/qna/${id}`
      );
      console.log("Q&A 상세 조회 응답:", response.data);
      setData(response.data.result);
    } catch (error) {
      console.error("Q&A 상세 조회 에러:", error);
      setError("Q&A 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/customer-service?tab=qna");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Q&A를 불러오는 중...</p>
              </div>
            </div>
          </div>
          <div className="w-80 flex-shrink-0">
            <Sidebar />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-20">
                <div className="text-red-600 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  뒤로가기
                </button>
              </div>
            </div>
          </div>
          <div className="w-80 flex-shrink-0">
            <Sidebar />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* 페이지 제목 */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                고객센터
              </h1>
            </div>

            {/* 탭 메뉴 */}
            <div className="bg-white rounded-lg border">
              <Tabs defaultValue="qna" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1 m-6 mb-0">
                  <TabsTrigger
                    value="inquiry"
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
                    onClick={() => navigate("/customer-service?tab=inquiry")}
                  >
                    고객 문의
                  </TabsTrigger>
                  <TabsTrigger
                    value="terms"
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
                    onClick={() => navigate("/customer-service?tab=terms")}
                  >
                    이용약관 관리
                  </TabsTrigger>
                  <TabsTrigger
                    value="privacy"
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
                    onClick={() => navigate("/customer-service?tab=privacy")}
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

                <TabsContent value="qna" className="p-6">
                  <div className="max-w-4xl mx-auto">
                    <Card>
                      <CardHeader>
                        <CardTitle>Q&A 상세</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <Label
                              htmlFor="title"
                              className="text-sm font-medium text-gray-700"
                            >
                              제목
                            </Label>
                            <Input
                              id="title"
                              value={data?.title || ""}
                              readOnly
                              className="mt-1 bg-gray-50"
                            />
                          </div>

                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                              내용
                            </Label>
                            <div
                              className="min-h-[400px] max-h-[400px] overflow-y-auto border border-gray-300 rounded-md p-3 bg-gray-50"
                              dangerouslySetInnerHTML={{
                                __html: data?.content || "내용이 없습니다.",
                              }}
                            />
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

                          <div className="flex justify-end pt-6">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleBack}
                            >
                              목록으로
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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

export default CustomerQnADetail;
