import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAdminUserList } from "../../configs/api-utils";

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [active, setActive] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("false");

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
    getAdminUserList(currentPage - 1, 10, searchTerm, report, active)
      .then(setData)
      .finally(() => setLoading(false));
  }, [currentPage, searchTerm, report, active]);

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
          <h1 className="text-2xl font-bold text-gray-800 mb-8">사용자 관리</h1>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* 검색 및 정렬 영역 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1 max-w-md">
                  <Input
                    placeholder="이름, 닉네임, 이메일 검색"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={active} onValueChange={(v) => { setActive(v); setCurrentPage(1); }}>
                    <SelectTrigger className="ml-4 w-40">
                      <SelectValue placeholder="계정 활성화" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">활성화여부 전체조회</SelectItem>
                      <SelectItem value="true">계정 활성화</SelectItem>
                      <SelectItem value="false">계정 비활성화</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={report} onValueChange={(v) => { setReport(v); setCurrentPage(1); }}>
                    <SelectTrigger className="ml-4 w-40">
                      <SelectValue placeholder="신고이력 조회" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">신고이력 전체조회</SelectItem>
                      <SelectItem value="true">신고이력 존재회원</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                <div>이름(닉네임)</div>
                <div>이메일</div>
                <div>계정 활성화</div>
                <div>신고횟수</div>
                <div>정지횟수</div>
                <div>가입일</div>
              </div>
            </div>
            {/* 사용자 목록 */}
            <div className="divide-y divide-gray-200">
              {loading && <div className="p-4 text-center">로딩중...</div>}
              {!loading && data?.content?.length === 0 && <div className="p-4 text-center">사용자가 없습니다.</div>}
              {!loading && data?.content?.map((user) => (
                <Link
                  key={user.userId}
                  to={`/admin/users/${user.userId}`}
                  className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-6 gap-2">
                    <div className="text-sm text-gray-900 w-32 truncate">{user.userName}({user.nickname})</div>
                    <div className="text-sm text-gray-900 w-40 truncate">{user.email}</div>
                    <div className="text-sm w-24 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {user.active ? "계정 활성화" : "계정 비활성화"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 w-16 text-center">{user.reportCount}</div>
                    <div className="text-sm text-gray-900 w-16 text-center">{user.pauseCount}</div>
                    <div className="text-sm text-gray-500 w-28 truncate text-center">{formatDate(user.createAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
            {/* 페이징 */}
            {data?.totalPages > 1 && (
              <div className="flex justify-center space-x-2 py-4">
                {Array.from({ length: data.totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    className={`px-3 py-1 rounded border ${idx + 1 === data.number + 1 ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
