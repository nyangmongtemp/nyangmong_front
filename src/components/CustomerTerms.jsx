import React, { useState, useEffect } from "react";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, TERMS } from "../../configs/host-config";

const CustomerTerms = () => {
  const [termsData, setTermsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 날짜 포맷 함수 추가
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

  const fetchTerms = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}${TERMS}/terms/lastPost`
      );
      //console.log("이용약관 조회 응답:", response.data);
      setTermsData(response.data.result);
    } catch (err) {
      //console.error("이용약관 조회 에러:", err);
      setError("이용약관을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 자동으로 이용약관 조회
    fetchTerms();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">이용약관</h3>
        <button
          onClick={fetchTerms}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "로딩 중..." : "새로고침"}
        </button>
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">이용약관을 불러오는 중...</p>
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
            onClick={fetchTerms}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      )}

      {!loading && !error && termsData && (
        <div className="bg-white rounded-lg border p-6">
          <div className="prose max-w-none">
            {/* 제목 표시 */}
            <h4 className="text-xl font-semibold mb-4">{termsData.title}</h4>

            {/* 날짜 정보 표시 */}
            <div className="text-sm text-gray-500 mb-4">
              <p>업데이트: {formatDateTime(termsData.updateAt)}</p>
            </div>

            {/* 구분선 */}
            <div className="border-t pt-4">
              {/* CKEditor 형식으로 content 렌더링 */}
              {termsData.content ? (
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: termsData.content }}
                />
              ) : (
                <p className="text-gray-500">이용약관 내용이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!loading && !error && !termsData && (
        <div className="text-center py-20">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            이용약관 내용
          </h3>
          <p className="text-gray-500">
            이용약관의 상세 내용이 여기에 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerTerms;
