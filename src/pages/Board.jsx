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

const Board = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 게시판 제목 매핑
  const boardTitles = {
    free: "자유게시판",
    question: "질문게시판",
    review: "후기게시판",
    event: "행사게시판",
  };

  // 게시판별 맞춤 더미데이터
  const getBoardSpecificPosts = (boardType) => {
    const basePosts = {
      free: [
        {
          id: 1,
          title: "우리 고양이 자랑하고 싶어요 ㅎㅎ",
          content: "너무 귀여운 우리 고양이 사진 공유합니다~ 오늘 새로운 장난감 사줬더니 정말 좋아해요!",
          author: "냥이맘",
          createdAt: "10분 전",
          views: 234,
          likes: 24,
          comments: 12,
          category: "자유",
          isHot: true,
        },
        {
          id: 2,
          title: "강아지와 함께하는 주말 나들이 후기",
          content: "어제 강아지와 함께 한강공원에 다녀왔어요. 날씨도 좋고 정말 즐거웠습니다.",
          author: "멍멍이아빠",
          createdAt: "25분 전",
          views: 156,
          likes: 18,
          comments: 8,
          category: "자유",
          isHot: false,
        },
        {
          id: 3,
          title: "반려동물과 함께하는 일상 공유",
          content: "매일매일 반려동물과 함께하는 소소한 일상들을 나누고 싶어요.",
          author: "펫러버",
          createdAt: "1시간 전",
          views: 89,
          likes: 12,
          comments: 5,
          category: "자유",
          isHot: false,
        }
      ],
      question: [
        {
          id: 1,
          title: "강아지 산책 시 주의사항이 궁금해요",
          content: "처음으로 강아지를 키우게 되었는데, 산책할 때 어떤 점들을 주의해야 할까요? 목줄은 어떤 걸 사용하는 게 좋을까요?",
          author: "초보집사",
          createdAt: "5분 전",
          views: 89,
          likes: 7,
          comments: 15,
          category: "질문",
          isHot: true,
        },
        {
          id: 2,
          title: "고양이가 밥을 안 먹어요, 어떻게 해야 할까요?",
          content: "3일째 우리 고양이가 사료를 거의 안 먹고 있어요. 병원에 가봐야 할까요?",
          author: "걱정많은집사",
          createdAt: "30분 전",
          views: 156,
          likes: 12,
          comments: 23,
          category: "질문",
          isHot: false,
        },
        {
          id: 3,
          title: "반려동물 보험 추천 부탁드려요",
          content: "반려동물 보험을 들고 싶은데 어떤 보험이 좋은지 추천해주세요.",
          author: "신중한견주",
          createdAt: "1시간 전",
          views: 203,
          likes: 9,
          comments: 18,
          category: "질문",
          isHot: false,
        }
      ],
      review: [
        {
          id: 1,
          title: "○○병원 진료 후기 - 정말 친절하세요!",
          content: "우리 강아지 중성화 수술을 위해 방문했는데, 의료진분들이 정말 친절하고 꼼꼼하게 봐주셨어요. 적극 추천합니다!",
          author: "만족한견주",
          createdAt: "2시간 전",
          views: 345,
          likes: 28,
          comments: 16,
          category: "후기",
          isHot: true,
        },
        {
          id: 2,
          title: "펫샵 사료 구매 후기 - 배송 빨라요",
          content: "온라인으로 주문한 사료가 하루만에 왔어요. 포장도 깔끔하고 가격도 합리적이었습니다.",
          author: "쇼핑마니아",
          createdAt: "3시간 전",
          views: 189,
          likes: 15,
          comments: 7,
          category: "후기",
          isHot: false,
        },
        {
          id: 3,
          title: "강아지 미용실 후기 - 실력이 정말 좋아요",
          content: "처음 가본 미용실인데 우리 강아지를 정말 예쁘게 만들어주셨어요. 다음에도 여기로 갈 예정입니다.",
          author: "미용만족",
          createdAt: "4시간 전",
          views: 267,
          likes: 22,
          comments: 11,
          category: "후기",
          isHot: false,
        }
      ]
    };

    const selectedPosts = basePosts[boardType] || basePosts.free;
    
    // 추가 더미 데이터 생성
    const additionalPosts = Array.from({ length: 47 }, (_, i) => {
      const baseIndex = i + 4;
      let title, content, category;
      
      switch(boardType) {
        case 'question':
          title = `질문 ${baseIndex}: ${['사료 추천', '병원 찾기', '훈련 방법', '건강 관리', '용품 구매'][i % 5]}에 대해 문의드려요`;
          content = `${['우리 반려동물의', '처음 키우는', '고민이 많은', '경험이 부족한', '도움이 필요한'][i % 5]} 상황에서 전문가의 조언을 구합니다.`;
          category = "질문";
          break;
        case 'review':
          title = `후기 ${baseIndex}: ${['병원', '펫샵', '미용실', '호텔', '훈련소'][i % 5]} 이용 후기입니다`;
          content = `${['정말 만족스러운', '추천하고 싶은', '서비스가 좋은', '친절한', '전문적인'][i % 5]} 경험을 공유합니다.`;
          category = "후기";
          break;
        default:
          title = `자유 ${baseIndex}: ${['일상 공유', '사진 자랑', '나들이 후기', '장난감 추천', '간식 후기'][i % 5]}`;
          content = `${['오늘의', '즐거운', '특별한', '소중한', '행복한'][i % 5]} 반려동물과의 일상을 나누고 싶어요.`;
          category = "자유";
      }

      return {
        id: baseIndex,
        title,
        content,
        author: `사용자${baseIndex}`,
        createdAt: `${Math.floor(i/10) + 1}일 전`,
        views: Math.floor(Math.random() * 500) + 50,
        likes: Math.floor(Math.random() * 30) + 1,
        comments: Math.floor(Math.random() * 15) + 1,
        category,
        isHot: Math.random() > 0.9,
      };
    });

    return [...selectedPosts, ...additionalPosts];
  };

  const allPosts = getBoardSpecificPosts(type);

  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  const handlePostClick = (postId) => {
    navigate(`/post/${type}/${postId}`);
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

    // 이전 페이지 버튼
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

    // 페이지 번호
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

    // 다음 페이지 버튼
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
                      onClick={() => handlePostClick(post.id)}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-orange-300 transition-all cursor-pointer bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                post.category === "질문"
                                  ? "border-blue-300 text-blue-600 bg-blue-50"
                                  : "border-green-300 text-green-600 bg-green-50"
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
                          <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-orange-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{post.createdAt}</span>
                              </div>
                            </div>
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
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 페이지네이션과 글쓰기 버튼 */}
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
