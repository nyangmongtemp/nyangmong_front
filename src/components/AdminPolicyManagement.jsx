import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { getAdminTermsList } from "../../configs/api-utils";

const AdminPolicyManagement = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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
    fetchPolicyData();
  }, [currentPage, searchTerm]);

  const fetchPolicyData = async () => {
    setLoading(true);
    try {
      const result = await getAdminTermsList('policy', currentPage - 1, 10, searchTerm);
      setData(result);
    } catch (error) {
      setError(error.message || "개인정보처리방침 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && !data) {
    return <div className="text-center py-8">로딩중...</div>;
  }

  if (error && !data) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">개인정보처리방침 관리</h3>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="제목, 내용 검색"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
      </div>

      {data && (
        <>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                <span>번호</span>
                <span>제목</span>
                <span>내용</span>
                <span>작성자</span>
                <span>생성일자</span>
                <span>수정일자</span>
              </div>
            </div>
            <div className="divide-y">
              {data.content.map((policy, index) => (
                <div
                  key={policy.termsId}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="grid grid-cols-6 gap-4 text-sm">
                    <span className="text-gray-500">
                      {(currentPage - 1) * 10 + index + 1}
                    </span>
                    <span className="text-blue-600 hover:underline truncate">
                      {policy.title}
                    </span>
                    <span className="truncate">
                      {policy.content.replace(/<[^>]*>/g, '')}
                    </span>
                    <span>{policy.adminName}</span>
                    <span>{formatDate(policy.createAt)}</span>
                    <span>{formatDate(policy.updateAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 페이징 */}
          <div className="flex justify-between items-center">
            <div className="flex justify-center flex-1">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.max(1, data.totalPages) }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        className={`cursor-pointer ${
                          currentPage === page 
                            ? "bg-blue-500 text-white border-blue-500" 
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(data.totalPages, currentPage + 1))}
                      className={
                        currentPage === data.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/admin/policy/create")}
            >
              생성
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPolicyManagement; 