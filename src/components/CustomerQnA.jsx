import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, TERMS } from "../../configs/host-config";

const CustomerQnA = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [qnaData, setQnaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchQnA = async (page = 0) => {
    setLoading(true);
    setError(null);

    try {
      // 디버깅을 위해 페이지 번호 출력
      //console.log("요청할 페이지 번호:", page);

      const response = await axiosInstance.get(
        `${API_BASE_URL}${TERMS}/qna/list/${page}`
      );
      //console.log(`${API_BASE_URL}${TERMS}/qna/list/${page}`);
      //console.log("Q&A 조회 응답:", response.data);
      setQnaData(response.data.result);
    } catch (err) {
      //console.error("Q&A 조회 에러:", err);
      setError("Q&A를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 자동으로 Q&A 조회
    fetchQnA(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleQnAClick = (termsId) => {
    //console.log("클릭된 termsId:", termsId);
    navigate(`/customer-qna-detail/${termsId}`);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Q&A</h3>
        <button
          onClick={() => fetchQnA(currentPage)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "로딩 중..." : "새로고침"}
        </button>
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Q&A를 불러오는 중...</p>
        </div>
      )}

      {error && (
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
            onClick={() => fetchQnA(currentPage)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      )}

      {!loading && !error && qnaData && (
        <div className="bg-white rounded-lg border">
          {/* 목록 헤더 */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <h4 className="text-lg font-semibold text-gray-900">Q&A 목록</h4>
            <p className="text-sm text-gray-500 mt-1">
              총 {qnaData.totalElements}개 (페이지 {currentPage + 1} /{" "}
              {qnaData.totalPages})
            </p>
          </div>

          {/* 목록 내용 */}
          <div className="divide-y">
            {qnaData.content && qnaData.content.length > 0 ? (
              qnaData.content.map((item, index) => (
                <div
                  key={item.termsId || item.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleQnAClick(item.termsId || item.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="text-lg font-medium text-gray-900 mb-1">
                        {item.title}
                      </h5>
                      <p className="text-sm text-gray-500">
                        업데이트: {formatDateTime(item.updateAt)}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      v{index + 1}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                Q&A가 없습니다.
              </div>
            )}
          </div>

          {/* 페이징 버튼 */}
          {qnaData.totalPages > 1 && (
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex justify-center items-center space-x-2">
                {/* 이전 페이지 버튼 */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-2 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>

                {/* 페이지 번호 버튼들 */}
                {Array.from({ length: qnaData.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      currentPage === i
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                {/* 다음 페이지 버튼 */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === qnaData.totalPages - 1}
                  className="px-3 py-2 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && !error && !qnaData && (
        <div className="text-center py-20">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Q&A 내용</h3>
          <p className="text-gray-500">Q&A의 상세 내용이 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerQnA;
