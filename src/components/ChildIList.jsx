import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, BOARD } from "../../configs/host-config";
import { useAuth } from "../context/UserContext";
import { logUserEvent } from "../hooks/user-log-hook";

// 날짜 포맷 함수 추가
const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

const ChildIList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [allPosts, setAllPosts] = useState([]); // 전체 데이터
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const pageSize = 10;
  const { isLoggedIn } = useAuth();

  // 쿼리 파라미터에서 page 읽기
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = parseInt(params.get("page"), 10);
    if (pageParam && pageParam !== currentPage) {
      setCurrentPage(pageParam);
    } else if (!pageParam && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [location.search]);

  // 전체 데이터 한 번에 받아오기
  useEffect(() => {
    setLoading(true);
    setError(null);

    logUserEvent("board_view", {
      selectedCategory: "introduction",
    });

    axiosInstance
      .get(`${API_BASE_URL}${BOARD}/list/INTRODUCTION`, {
        params: { page: 0, size: 1000 }, // 충분히 크게!
      })
      .then((res) => {
        console.log(res);

        const content = res.data.content || [];
        // 최신순 정렬(내림차순)
        content.sort(
          (a, b) =>
            new Date(b.createAt || b.createdAt) -
            new Date(a.createAt || a.createdAt)
        );
        // Board.jsx와 동일하게 likes/comments/postId 필드 매핑
        const mappedPosts = content.map((item) => ({
          ...item,
          postId: item.postid,
          createdAt: item.createdat,
          likes: item.likeCount,
          comments: item.commentCount,
        }));
        // 최신순 정렬 (작성일 또는 postId 기준 내림차순)
        mappedPosts.sort((a, b) => {
          // createAt/createdAt이 있으면 날짜 기준, 없으면 postId 기준
          const dateA = new Date(a.createAt || a.createdAt || 0);
          const dateB = new Date(b.createAt || b.createdAt || 0);
          if (!isNaN(dateA) && !isNaN(dateB)) {
            return dateB - dateA;
          }
          return (b.postId || 0) - (a.postId || 0);
        });
        setAllPosts(mappedPosts);
      })
      .catch(() => setError("소개 게시판 불러오기 실패"))
      .finally(() => setLoading(false));
  }, []);

  // 페이지네이션 데이터
  const totalPages = Math.ceil(allPosts.length / pageSize);
  const pagedPosts = allPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const filteredPets = searchTerm
    ? pagedPosts.filter(
        (pet) =>
          pet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : pagedPosts;

  // 페이지네이션 UI
  const renderPagination = () => {
    if (totalPages <= 1) return null;
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
          onClick={() => setCurrentPage(currentPage - 1)}
          className="rounded-md px-4 py-2 border text-sm font-semibold mx-1 bg-white text-gray-800 border-gray-300 hover:bg-orange-50"
        >
          &lt;
        </button>
      );
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`rounded-md px-4 py-2 border text-sm font-semibold mx-1 ${
            currentPage === i
              ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white border-0"
              : "bg-white text-gray-800 border-gray-300 hover:bg-orange-50"
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
          onClick={() => setCurrentPage(currentPage + 1)}
          className="rounded-md px-4 py-2 border text-sm font-semibold mx-1 bg-white text-gray-800 border-gray-300 hover:bg-orange-50"
        >
          &gt;
        </button>
      );
    }
    return (
      <>
        <div className="flex justify-center items-center mt-8 mb-2">
          {pages}
        </div>
        <div className="flex justify-center mt-2 text-sm text-gray-500">
          {totalPages > 1 &&
            `현재 페이지: ${currentPage} / ${totalPages} (총 ${allPosts.length}개 게시글)`}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  우리 아이 소개 게시판
                </h1>
                {isLoggedIn && (
                  <Button
                    onClick={() => navigate("/child/create")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    게시글 작성
                  </Button>
                )}
              </div>
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="검색어 입력"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 max-w-md"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  검색
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  전체 보기
                </Button>
              </div>
              {loading && (
                <div className="text-center py-12">
                  <div className="text-gray-500">게시글을 불러오는 중...</div>
                </div>
              )}
              {error && (
                <div className="text-center py-12">
                  <div className="text-red-500">{error}</div>
                </div>
              )}
              {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPets.length === 0 ? (
                    <div className="col-span-2 text-center text-gray-400 py-12">
                      게시글이 없습니다.
                    </div>
                  ) : (
                    filteredPets.map((pet) => (
                      <div
                        key={pet.postId}
                        className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                        onClick={() =>
                          navigate(
                            `/detail/introduction/${pet.postid || pet.id}`
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                          <img
                            src={pet.thumbnailImage || pet.thumbnailimage}
                            alt={pet.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-lg font-semibold text-gray-800">
                            {pet.title}
                          </h2>
                          <p
                            className="text-sm text-gray-600 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: pet.content }}
                          />
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{pet.nickname || pet.author}</span>
                            <span>
                              작성일자:{" "}
                              {formatDateTime(pet.createAt || pet.createdAt)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>
                              조회수: {pet.viewCount || pet.viewcount}
                            </span>
                            <span>
                              댓글: {pet.comments || pet.commentCount}
                            </span>
                            <span>❤️ {pet.likeCount}</span>
                          </div>
                          <div className="flex justify-between mt-3"></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {renderPagination()}
            </div>
          </div>
          <div className="w-80">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildIList;
