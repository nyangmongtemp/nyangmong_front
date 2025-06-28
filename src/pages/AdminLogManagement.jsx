import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminLogManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [managerFilter, setManagerFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // 임시 로그 데이터
  const logs = [
    {
      id: 1,
      userEmail: "사용자 이름 / email",
      managerName: "관리자 이름",
      date: "2025.06.24 12:11",
    },
    {
      id: 2,
      userEmail: "도진호(email)",
      managerName: "강일민",
      date: "2025.06.24 12:11",
    },
    {
      id: 3,
      userEmail: "Email (이름)",
      managerName: "이은혁",
      date: "2025.06.24 12:11",
    },
    {
      id: 4,
      userEmail: "Email (이름)",
      managerName: "이은혁",
      date: "2025.06.24 12:11",
    },
    {
      id: 5,
      userEmail: "Email (이름)",
      managerName: "이은혁",
      date: "2025.06.24 12:11",
    },
    {
      id: 6,
      userEmail: "Email (이름)",
      managerName: "이은혁",
      date: "2025.06.24 12:11",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="ml-80 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">로그 관리</h1>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* 검색 및 필터 영역 */}
            <div className="p-6 border-b border-gray-200">
              <div className="mb-4">
                <Input
                  placeholder="이름 검색 (또는 이메일)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full max-w-md"
                />
              </div>

              <div className="flex gap-4">
                <Select value={managerFilter} onValueChange={setManagerFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="관리자 이름" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="강일민">강일민</SelectItem>
                    <SelectItem value="이은혁">이은혁</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="열람 시간" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">오늘</SelectItem>
                    <SelectItem value="week">이번주</SelectItem>
                    <SelectItem value="month">이번달</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700">
                <div>사용자 이름 / email</div>
                <div>관리자 이름</div>
                <div>열람 시간</div>
              </div>
            </div>

            {/* 로그 목록 */}
            <div className="divide-y divide-gray-200">
              {logs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-gray-50">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm text-gray-900">{log.userEmail}</div>
                    <div className="text-sm text-gray-900">
                      {log.managerName}
                    </div>
                    <div className="text-sm text-gray-500">{log.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogManagement;
