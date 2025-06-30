
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const MessagesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  const messages = [
    {
      id: 1,
      senderName: "사용자 이름",
      content: "내용 (1줄만 보여주기)",
      status: "전송완료"
    },
    {
      id: 2,
      senderName: "사용자 이름",
      content: "내용 (1줄만 보여주기)",
      status: "전송완료"
    },
    {
      id: 3,
      senderName: "사용자 이름",
      content: "내용 (1줄만 보여주기)",
      status: "전송완료"
    },
    {
      id: 4,
      senderName: "사용자 이름",
      content: "내용 (1줄만 보여주기)",
      status: "전송완료"
    },
    {
      id: 5,
      senderName: "사용자 이름",
      content: "내용 (1줄만 보여주기)",
      status: "전송완료"
    },
    {
      id: 6,
      senderName: "사용자 이름",
      content: "내용 (1줄만 보여주기)",
      status: "전송완료"
    }
  ];

  const filteredMessages = messages.filter(message =>
    message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* 뒤로가기 버튼 */}
            <div className="mb-6">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>뒤로가기</span>
              </button>
            </div>

            {/* 페이지 제목 */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">메시지</h1>
            </div>

            {/* 검색 및 정렬 */}
            <div className="bg-white rounded-lg border p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
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

              {/* 메시지 목록 */}
              <div className="space-y-3">
                {filteredMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-800">{message.senderName}</div>
                      <div className="text-sm text-gray-600">{message.content}</div>
                      <div className="text-sm text-gray-800 text-right">{message.status}</div>
                    </div>
                  </div>
                ))}
              </div>
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

export default MessagesPage;
