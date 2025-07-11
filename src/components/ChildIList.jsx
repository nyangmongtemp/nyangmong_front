import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../configs/axios-config";

const ChildIList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axiosInstance
      .get("/board-service/board/introduction/list", {
        params: { page: 0, size: 20 },
      })
      .then((res) => {
        const content = res.data.content || res.data;
        const mapped = content.map((item, idx) => ({
          id: item.id || item.boardId || item._id || idx,
          title: item.title,
          content: item.content,
          author: item.nickname || item.author,
          createdAt: item.createdAt || item.regDate,
          views: item.views || 0,
          likes: item.likes || 0,
          comments: item.comments || 0,
          image: item.thumbnailImageUrl || item.imageUrl || null,
        }));
        setPosts(mapped);
      })
      .catch((err) => {
        setError("소개 게시판 불러오기 실패");
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPets = posts.filter(
    (pet) =>
      pet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                {filteredPets.map((pet) => (
                  <div
                    key={pet.id}
                    className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                    onClick={() => navigate(`/child/detail/${pet.id}`)}
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
                ))}
              </div>
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
