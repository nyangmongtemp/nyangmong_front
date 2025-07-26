import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { getAdminLogList } from "../../configs/api-utils";

const AdminLogManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 권한 체크: BOSS, CONTENT만 접근 가능
  useEffect(() => {
    const adminRole = sessionStorage.getItem("adminRole");
    if (adminRole !== "BOSS" && adminRole !== "CONTENT") {
      alert("접근 권한이 없습니다.");
      navigate("/admin", { replace: true });
      return;
    }
  }, [navigate]);

  // 데이터 fetch
  useEffect(() => {
    setLoading(true);
    getAdminLogList(currentPage - 1, 10, searchTerm)
      .then(setData)
      .finally(() => setLoading(false));
  }, [currentPage, searchTerm]);

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-80 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">로그 관리</h1>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* 검색 영역 */}
            <div className="p-6 border-b border-gray-200">
              <Input
                placeholder="이름, 이메일 검색"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full max-w-md"
              />
            </div>
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                <div>번호</div>
                <div>사용자 이름(닉네임)</div>
                <div>이메일</div>
                <div>관리자 이름</div>
                <div>IP</div>
                <div>열람 시간</div>
              </div>
            </div>
            {/* 로그 목록 */}
            <div className="divide-y divide-gray-200">
              {loading && <div className="p-4 text-center">로딩중...</div>}
              {!loading && data?.content?.length === 0 && <div className="p-4 text-center">로그가 없습니다.</div>}
              {!loading && data?.content?.map((log, index) => (
                <div key={log.logId} className="p-4 hover:bg-gray-50">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="text-sm text-gray-500">
                      {(currentPage - 1) * 10 + index + 1}
                    </div>
                    <div className="text-sm text-gray-900">{log.userName}({log.userNickName})</div>
                    <div className="text-sm text-gray-900">{log.userEmail}</div>
                    <div className="text-sm text-gray-900">{log.adminName}</div>
                    <div className="text-sm text-gray-900">{log.adminIp}</div>
                    <div className="text-sm text-gray-500">{formatDate(log.createAt)}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* 페이징 */}
            {data && (
              <div className="flex justify-center py-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                          onClick={() => setCurrentPage(page)}
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
                        onClick={() => setCurrentPage(Math.min(data.totalPages, currentPage + 1))}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogManagement;
