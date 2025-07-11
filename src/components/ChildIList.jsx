import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, BOARD } from "../../configs/host-config";

const ChildIList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // 실제로 보여줄 페이지 수 계산
  const effectiveTotalPages =
    posts.length === 0 && currentPage === totalPages && totalPages > 1
      ? totalPages - 1
      : totalPages;

  useEffect(() => {
    // 쿼리 파라미터에서 page 읽기
    const params = new URLSearchParams(location.search);
    const pageParam = parseInt(params.get("page"), 10);
    if (pageParam && pageParam !== currentPage) {
      setCurrentPage(pageParam);
    } else if (!pageParam && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [location.search]);

  useEffect(() => {
    if (currentPage > effectiveTotalPages && effectiveTotalPages > 0) {
      setCurrentPage(effectiveTotalPages);
      return;
    }
    setLoading(true);
    setError(null);
    axiosInstance
      .get(`${API_BASE_URL}${BOARD}/introduction/list`, {
        params: { page: currentPage - 1, size: pageSize },
      })
      .then((res) => {
        const content = res.data.content || res.data;
        const mapped = content.map((item, idx) => ({
          id: item.id || item.boardId || item._id || item.postId || idx,
          title: item.title,
          content: item.content,
          author: item.nickname || item.author,
          createdAt:
            item.createAt ||
            item.createdAt ||
            item.regDate ||
            item.created_date,
          views: item.views || item.viewCount || 0,
          likes: item.likes || 0,
          comments: item.comments || 0,
          image:
            item.thumbnailimage ||
            item.thumbnailImageUrl ||
            item.imageUrl ||
            item.thumbnailImage ||
            null,
        }));
        mapped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(mapped);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        setError("소개 게시판 불러오기 실패");
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, [currentPage, effectiveTotalPages]);

  const filteredPets = searchTerm
    ? posts.filter(
        (pet) =>
          pet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;

  // 페이지네이션 UI
  const renderPagination = () => {
    if (effectiveTotalPages < 1) return null;
    const pages = [];
    for (let i = 1; i <= effectiveTotalPages; i++) {
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
    return (
      <>
        <div className="flex justify-center items-center mt-8 mb-2">
          {pages}
          {currentPage < effectiveTotalPages && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="rounded-md px-4 py-2 border text-sm font-semibold mx-1 bg-white text-gray-800 border-gray-300 hover:bg-orange-50"
            >
              &gt;
            </button>
          )}
        </div>
        <div className="flex justify-center mt-2 text-sm text-gray-500">
          {effectiveTotalPages > 1 &&
            `현재 페이지: ${currentPage} / ${effectiveTotalPages}`}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  우리 아이 소개 게시판
                </h1>
                <Button
                  onClick={() => navigate("/child/create")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  게시글 작성
                </Button>
              </div>

              {/* 검색 영역 */}
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

              {/* 펫 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPets.length === 0 ? (
                  <div className="col-span-2 text-center text-gray-400 py-12">
                    게시글이 없습니다.
                  </div>
                ) : (
                  filteredPets.map((pet) => (
                    <div
                      key={pet.id}
                      className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                      onClick={() => navigate(`/detail/introduction/${pet.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* 이미지 */}
                      <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={pet.image}
                          alt={pet.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* 정보 */}
                      <div className="space-y-2">
                        <h2 className="text-lg font-semibold text-gray-800">
                          {pet.title}
                        </h2>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {pet.content}
                        </p>

                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{pet.author}</span>
                          <span>작성일자: {pet.createdAt}</span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-500">
                          <span>조회수: {pet.views}</span>
                          <span>댓글: {pet.comments}</span>
                        </div>

                        <div className="flex justify-between mt-3">
                          <Button
                            variant="outline"
                            className="text-sm px-4 py-2 border-gray-300 hover:bg-gray-50"
                          >
                            좋아요 ❤️ {pet.likes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {renderPagination()}
            </div>
          </div>

          {/* 사이드바 */}
          <div className="w-80">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildIList;
