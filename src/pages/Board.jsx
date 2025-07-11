import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Eye,
  Heart,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";
import axiosInstance from "../../configs/axios-config";

const Board = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  // API에서 받아온 행사 게시글 저장
  const [apiPosts, setApiPosts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    console.log(type);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 행사 게시판일 때 API 호출
  useEffect(() => {
    if (type === "event") {
      axiosInstance
        .get("http://localhost:8000/festival-service/api/festivals")
        .then((res) => {
          const mappedPosts = res.data.map((festival) => {
            let imageUrl = null;
            if (festival.imagePath) {
              // imagePath에서 src= 뒤의 URL 추출
              const match = festival.imagePath.match(/src\s*=\s*([^&\s]+)/i);
              if (match && match[1]) {
                imageUrl = decodeURIComponent(match[1]);
              }
            }

            // festivalDate 예: "2025.07.04. (금) ~ 2025.07.06. (일)"
            // 시작일과 종료일만 추출
            const datePattern = /(\d{4}\.\d{2}\.\d{2})/g;
            const dates = festival.festivalDate.match(datePattern);

            let category = "행사"; // 기본값
            if (dates && dates.length === 2) {
              const [startStr, endStr] = dates;
              // 날짜 객체 생성 (YYYY.MM.DD → YYYY-MM-DD 형식으로 변환 후)
              const startDate = new Date(startStr.replace(/\./g, "-"));
              const endDate = new Date(endStr.replace(/\./g, "-"));
              const now = new Date();

              if (now < startDate) {
                category = "진행예정";
              } else if (now >= startDate && now <= endDate) {
                category = "진행중";
              } else {
                category = "종료";
              }
            }

            return {
              id: festival.festivalId,
              title: festival.title,
              content: festival.location ? `위치: ${festival.location}` : "",
              date: festival.festivalDate,
              category,
              imageUrl,
              money: festival.money, // 가격 정보
              url: festival.url, // 행사 URL
              reservationDate: festival.reservationDate, //예매기간
              description: festival.description, //행사설명
              time: festival.festivalTime, //행사진행시간
            };
          });

          setApiPosts(mappedPosts);
          setCurrentPage(1); // 페이지 초기화
        })
        .catch((err) => {
          console.error("행사 게시글 불러오기 실패", err);
          setApiPosts([]); // 에러 시 빈 배열
        });
    }
  }, [type]);

  // 게시판 제목 매핑
  const boardTitles = {
    free: "자유게시판",
    question: "질문게시판",
    review: "후기게시판",
    event: "행사게시판",
  };

  // 더미 데이터 및 API 데이터 분기 처리
  const getBoardSpecificPosts = (boardType) => {
    if (boardType === "event") {
      return apiPosts;
    }
    // 기존 더미 데이터 (생략 없이 그대로 넣으세요)
    const basePosts = {
      free: [
        // {
        //   id: 1,
        //   title: "우리 고양이 자랑하고 싶어요 ㅎㅎ",
        //   content:
        //     "너무 귀여운 우리 고양이 사진 공유합니다~ 오늘 새로운 장난감 사줬더니 정말 좋아해요!",
        //   author: "냥이맘",
        //   createdAt: "10분 전",
        //   views: 234,
        //   likes: 24,
        //   comments: 12,
        //   category: "자유",
        //   isHot: true,
        // },
      ],
      question: [
        // {
        //   id: 1,
        //   title: "강아지 산책 시 주의사항이 궁금해요",
        //   content:
        //     "처음으로 강아지를 키우게 되었는데, 산책할 때 어떤 점들을 주의해야 할까요? 목줄은 어떤 걸 사용하는 게 좋을까요?",
        //   author: "초보집사",
        //   createdAt: "5분 전",
        //   views: 89,
        //   likes: 7,
        //   comments: 15,
        //   category: "질문",
        //   isHot: true,
        // },
      ],
      review: [
        // {
        //   id: 1,
        //   title: "○○병원 진료 후기 - 정말 친절하세요!",
        //   content:
        //     "우리 강아지 중성화 수술을 위해 방문했는데, 의료진분들이 정말 친절하고 꼼꼼하게 봐주셨어요. 적극 추천합니다!",
        //   author: "만족한견주",
        //   createdAt: "2시간 전",
        //   views: 345,
        //   likes: 28,
        //   comments: 16,
        //   category: "후기",
        //   isHot: true,
        // },
      ],
    };
    // 추가 더미 데이터 생성 로직도 기존 그대로 유지
    // 예시: 단순 return 기존 더미 (필요시 추가 더미도 넣으세요)
    return basePosts[boardType] || basePosts.free;
  };

  const allPosts = getBoardSpecificPosts(type);
  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  const handlePostClick = (post) => {
    if (type === "event" && post.url) {
      // 새 탭에서 해당 행사 URL로 이동
      window.open(post.url, "_blank");
    } else {
      // 일반 게시판일 경우 상세 페이지로 이동
      navigate(`/post/${type}/${post.id}`);
    }
  };

  const handleCreatePost = () => {
    navigate(`/create-post/${type}`);
  };

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
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-pink-100 border-b border-orange-200">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-orange-500" />
                  <span className="m1-2">{boardTitles[type] || "게시판"}</span>
                  <div className="flex-grow" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* 게시글 목록 */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-end mb-4">
                    {type === "event" ? (
                      <></>
                    ) : (
                      <Button
                        onClick={handleCreatePost}
                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        글쓰기
                      </Button>
                    )}
                  </div>
                  {currentPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-orange-300 transition-all cursor-pointer bg-white"
                    >
                      {/* 텍스트와 이미지 함께 flex로 묶기 */}
                      <div className="flex justify-between items-start">
                        {/* 텍스트 영역 */}
                        <div className="flex-1">
                          {/* 제목 + 카테고리 + HOT 뱃지 같이 묶기 */}
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900 hover:text-orange-600 transition-colors">
                              {post.title}
                            </h3>

                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                post.category === "질문"
                                  ? "border-blue-300 text-blue-600 bg-blue-50"
                                  : post.category === "후기"
                                  ? "border-green-300 text-green-600 bg-green-50"
                                  : post.category === "진행예정"
                                  ? "border-gray-400 text-gray-600 bg-gray-100"
                                  : post.category === "진행중"
                                  ? "border-orange-400 text-orange-600 bg-orange-100"
                                  : post.category === "종료"
                                  ? "border-red-400 text-red-600 bg-red-100"
                                  : "border-orange-300 text-orange-600 bg-orange-50"
                              }`}
                            >
                              {post.category}
                            </Badge>

                            {post.isHot && (
                              <Badge className="text-xs bg-red-500 hover:bg-red-500">
                                HOT
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {post.content}
                          </p>

                          {/* 행사 설명 */}
                          {post.description && (
                            <p className="text-sm text-gray-700 mb-1 line-clamp-2">
                              {post.description}
                            </p>
                          )}

                          {post.money && (
                            <p className="text-sm text-gray-700 mb-3 line-clamp-1">
                              요금정보: {post.money}
                            </p>
                          )}
                          {/* 🎟 예매 기간 정보 */}
                          {post.reservationDate &&
                            post.reservationDate.trim() !== "" && (
                              <p className="text-sm text-gray-700 mb-3">
                                예매기간: {post.reservationDate}
                              </p>
                            )}
                          {/* 행사 시간 추가 ✅ */}
                          {post.time && post.time.trim() !== "" && (
                            <p className="text-sm text-gray-700 mb-3">
                              행사시간: {post.time}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              {/* 작성자 정보는 event 게시판에서 숨기기 */}
                              {type !== "event" && (
                                <div className="flex items-center space-x-1">
                                  <User className="h-4 w-4" />
                                  <span>{post.author}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{post.createdAt}</span>
                                <span>{post.date}</span>
                              </div>
                            </div>
                            {/* 🎯 조회수/좋아요/댓글 아이콘은 event 게시판에서만 숨기기 */}
                            {type !== "event" && (
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-4 w-4" />
                                  <span>{post.views}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Heart className="h-4 w-4 text-red-400" />
                                  <span>{post.likes}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageCircle className="h-4 w-4 text-blue-400" />
                                  <span>{post.comments}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 이미지 영역 */}

                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-28 h-36 object-cover rounded-md ml-6 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* 페이지네이션 */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">{renderPagination()}</div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* 사이드바 */}
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

export default Board;
