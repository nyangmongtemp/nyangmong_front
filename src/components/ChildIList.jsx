import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const ChildIList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // 임시 데이터 - 실제로는 API에서 가져올 데이터
  const pets = [
    {
      id: 1,
      title: "우리 고양이 자랑하고 싶어요 ㅎㅎ",
      content: "너무 귀여운 우리 고양이 사진 공유합니다~",
      author: "냥이맘",
      createdAt: "25분 전",
      views: 156,
      likes: 24,
      comments: 12,
      image:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      title: "집사님들의 고양이 자랑방 🐱",
      content: "귀여운 고양이 사진 한 장 투척합니다!",
      author: "고양이천국",
      createdAt: "1시간 전",
      views: 200,
      likes: 35,
      comments: 8,
      image:
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      title: "말랑말랑 냥이 발바닥 😻",
      content: "저희 집 냥이 발바닥이 너무 귀여워서 공유해요~",
      author: "냥발러버",
      createdAt: "2시간 전",
      views: 98,
      likes: 14,
      comments: 4,
      image:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      title: "아기 고양이 분양받았어요!",
      content: "태어난 지 한 달도 안 된 고양이에요. 너무 귀엽죠?",
      author: "새집사",
      createdAt: "3시간 전",
      views: 300,
      likes: 60,
      comments: 20,
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
  ];

  const filteredPets = pets.filter(
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
