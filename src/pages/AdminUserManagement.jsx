
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import AdminSidebar from "@/components/AdminSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("createdAt_desc");

  // 임시 사용자 데이터
  const users = [
    {
      id: 1,
      name: "이름",
      email: "이메일",
      createdAt: "최근 접속 일자",
      status: "활성화",
      reportCount: 0,
    },
    {
      id: 2,
      name: "이름",
      email: "이메일",
      createdAt: "생성일자 / 최근 접속 일자",
      status: "활성화",
      reportCount: 1,
    },
    {
      id: 3,
      name: "이름",
      email: "이메일",
      createdAt: "생성일자 / 최근 접속 일자",
      status: "활성화",
      reportCount: 0,
    },
    {
      id: 4,
      name: "이름",
      email: "이메일",
      createdAt: "생성일자 / 최근 접속 일자",
      status: "활성화",
      reportCount: 2,
    },
    {
      id: 5,
      name: "이름",
      email: "이메일",
      createdAt: "생성일자 / 최근 접속 일자?",
      status: "정지",
      reportCount: 3,
    },
    {
      id: 6,
      name: "이름",
      email: "이메일",
      createdAt: "생성일자 / 최근 접속 일자?",
      status: "정지",
      reportCount: 1,
    },
    {
      id: 7,
      name: "이름",
      email: "이메일",
      createdAt: "생성일자 / 최근 접속 일자?",
      status: "활성화",
      reportCount: 0,
    },
    {
      id: 8,
      name: "이름",
      email: "이메일",
      createdAt: "생성일자 / 최근 접속 일자?",
      status: "활성화",
      reportCount: 0,
    },
  ];

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
                    placeholder="사용자 검색어 입력"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="ml-4 w-40">
                    <SelectValue placeholder="정렬조건" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt_desc">생성일자 최신순</SelectItem>
                    <SelectItem value="createdAt_asc">생성일자 오래된순</SelectItem>
                    <SelectItem value="lastLogin_desc">최근 접속일자 최신순</SelectItem>
                    <SelectItem value="lastLogin_asc">최근 접속일자 오래된순</SelectItem>
                    <SelectItem value="reports_desc">신고횟수 내림차순</SelectItem>
                    <SelectItem value="reports_asc">신고횟수 오름차순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                <div>이름</div>
                <div>이메일</div>
                <div>최근 접속일자</div>
                <div>활성화</div>
                <div>신고횟수</div>
              </div>
            </div>

            {/* 사용자 목록 */}
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <Link
                  key={user.id}
                  to={`/admin/users/${user.id}`}
                  className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-5 gap-4">
                    <div className="text-sm text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">
                      {user.createdAt}
                    </div>
                    <div className="text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.status === "활성화"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900">
                      {user.reportCount}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
