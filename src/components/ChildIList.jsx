import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockPosts = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  image: "https://placekitten.com/300/200",
  title: `귀여운 아이 ${i + 1}`,
  region: "서울",
  author: `집사${i + 1}`,
  views: Math.floor(Math.random() * 1000),
  createdAt: `${i + 1}일 전`,
}));

const ChildIList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("최신순");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredPosts = mockPosts.filter((post) => post.title.includes(search));

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-orange-50 hover:border-orange-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === i
              ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-orange-500"
              : "border-gray-300 hover:bg-orange-50 hover:border-orange-300"
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-orange-50 hover:border-orange-300"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="border border-orange-200 rounded-lg shadow-lg bg-white p-6">
              <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  우리 아이 소개 게시판
                </h1>
                <Button
                  onClick={() => navigate("/child/create")}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6"
                >
                  게시물 생성
                </Button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <Input
                  placeholder="검색어 입력"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="md:w-1/2"
                />
                <Select
                  value={sortOption}
                  onValueChange={(v) => setSortOption(v)}
                >
                  <SelectTrigger className="md:w-48">
                    <SelectValue placeholder="정렬 기준" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="최신순">최신순</SelectItem>
                    <SelectItem value="조회순">조회순</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {currentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer bg-gray-50"
                    onClick={() => navigate(`/child/${post.id}`)}
                  >
                    <img
                      src={post.image}
                      alt="썸네일"
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <div className="text-sm text-gray-600 mb-1">
                      지역: {post.region}
                    </div>
                    <div className="font-semibold text-lg text-gray-900 mb-2">
                      {post.title}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      작성일: {post.createdAt} / 조회수: {post.views}
                    </div>
                    <div className="text-xs text-gray-500">
                      작성자: {post.author}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-2">
                {renderPagination()}
              </div>
            </div>
          </div>

          {!isMobile && (
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildIList;
