
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CustomerQnA = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  const qnaItems = [
    {
      id: 1,
      title: "제목",
      author: "작성자",
      date: "생성일자"
    },
    {
      id: 2,
      title: "제목",
      author: "작성자", 
      date: "생성일자"
    },
    {
      id: 3,
      title: "제목",
      author: "작성자",
      date: "생성일자"
    },
    {
      id: 4,
      title: "제목",
      author: "작성자",
      date: "생성일자"
    },
    {
      id: 5,
      title: "제목",
      author: "작성자",
      date: "생성일자"
    },
    {
      id: 6,
      title: "제목",
      author: "작성자",
      date: "생성일자"
    },
    {
      id: 7,
      title: "제목",
      author: "작성자",
      date: "생성일자"
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

      {/* Q&A 목록 */}
      <div className="space-y-3">
        {qnaItems.map((item) => (
          <div 
            key={item.id} 
            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-sm text-gray-800">{item.title}</div>
              <div className="text-sm text-gray-600">{item.author}</div>
              <div className="text-sm text-gray-800 text-right">{item.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerQnA;
