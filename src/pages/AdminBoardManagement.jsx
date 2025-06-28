import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminBoardManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // 임시 게시판 데이터
  const posts = [
    {
      id: 1,
      category: "질문게시판",
      title: "강아지가 밥을 안 먹어요...",
      author: "도진호",
      createdAt: "2025.06.24 12:47",
    },
    {
      id: 2,
      category: "질문게시판",
      title: "강아지가 밥을 안 먹어요...",
      author: "도진호",
      createdAt: "2025.06.24 12:47",
    },
    {
      id: 3,
      category: "질문게시판",
      title: "강아지가 밥을 안 먹어요...",
      author: "도진호",
      createdAt: "2025.06.24 12:47",
    },
    {
      id: 4,
      category: "질문게시판",
      title: "강아지가 밥을 안 먹어요...",
      author: "도진호",
      createdAt: "2025.06.24 12:47",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="ml-80 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">게시판 관리</h1>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* 검색 및 필터 영역 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="검색어 입력"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 max-w-md"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">검색</Button>
              </div>

              <div className="flex gap-4">
                {/* 검색조건 셀렉트 */}
                <Select
                  onValueChange={(value) =>
                    console.log("검색조건 선택됨:", value)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="기본정렬" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">제목</SelectItem>
                    <SelectItem value="author">작성자</SelectItem>
                  </SelectContent>
                </Select>

                {/* 정렬조건 셀렉트 */}
                <Select
                  onValueChange={(value) =>
                    console.log("정렬조건 선택됨:", value)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">질문게시판</SelectItem>
                    <SelectItem value="oldest">분양게시판</SelectItem>
                    <SelectItem value="title">자유게시판</SelectItem>
                    <SelectItem value="ㅁㄴㅇㅁㅇㄴㅁㅇ">질문게시판</SelectItem>
                    <SelectItem value="퓨퓨퓨">소개게시판</SelectItem>
                  </SelectContent>
                </Select>

                {/* 정렬조건 셀렉트 */}
                <Select
                  onValueChange={(value) =>
                    console.log("정렬조건 선택됨:", value)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="최신순" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">최신순</SelectItem>
                    <SelectItem value="oldest">오래된순</SelectItem>
                    <SelectItem value="title">제목순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                <div>V</div>
                <div>카테고리 종류</div>
                <div>게시물 제목</div>
                <div>작성자</div>
                <div>생성일자</div>
              </div>
            </div>

            {/* 게시물 목록 */}
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <div key={post.id} className="p-4 hover:bg-gray-50">
                  <div className="grid grid-cols-5 gap-4 items-center">
                    <div className="text-sm">
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="text-sm text-gray-900">{post.category}</div>
                    <div className="text-sm text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-900">{post.author}</div>
                    <div className="text-sm text-gray-500">
                      {post.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 버튼 영역 */}
            <div className="p-4 border-t border-gray-200 flex justify-center">
              <Button variant="outline">삭제하기</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBoardManagement;
