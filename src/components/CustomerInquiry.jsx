
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CustomerInquiry = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  const inquiries = [
    {
      id: 1,
      content: "담뮤 내용",
      manager: "관리자 이름",
      status: "접수완료"
    },
    {
      id: 2,
      content: "담뮤 내용", 
      manager: "관리자 이름",
      status: "접수완료"
    },
    {
      id: 3,
      content: "담뮤 내용",
      manager: "관리자 이름", 
      status: "접수완료"
    },
    {
      id: 4,
      content: "담뮤 내용",
      manager: "관리자 이름",
      status: "접수완료"
    },
    {
      id: 5,
      content: "담뮤 내용",
      manager: "관리자 이름",
      status: "접수완료"
    },
    {
      id: 6,
      content: "담뮤 내용",
      manager: "관리자 이름",
      status: "접수완료"
    }
  ];

  return (
    <div className="space-y-6">
      {/* 검색 및 정렬 */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="검색어 입력"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80"
        />
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">최신순/오래된순</span>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">(셀렉트박스)</span>
        </div>
      </div>

      {/* 문의 목록 */}
      <div className="space-y-3">
        {inquiries.map((inquiry) => (
          <div 
            key={inquiry.id} 
            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-sm text-gray-800">{inquiry.content}</div>
              <div className="text-sm text-gray-600">{inquiry.manager}</div>
              <div className="text-sm text-gray-800 text-right">{inquiry.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerInquiry;
