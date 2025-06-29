
import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MessageCircle, 
  Eye, 
  Heart, 
  Clock, 
  User,
  Filter
} from "lucide-react";

const AdminCustomerSupport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;

  // 통합 게시판 데이터
  const allPosts = [
    // 자유게시판 데이터
    {
      id: 1,
      title: "우리 고양이 자랑하고 싶어요 ㅎㅎ",
      content: "너무 귀여운 우리 고양이 사진 공유합니다~",
      author: "냥이맘",
      createdAt: "2024-06-28 14:30",
      views: 234,
      likes: 24,
      comments: 12,
      board: "free",
      boardName: "자유게시판",
      status: "정상"
    },
    {
      id: 2,
      title: "강아지와 함께하는 주말 나들이 후기",
      content: "어제 강아지와 함께 한강공원에 다녀왔어요.",
      author: "멍멍이아빠",
      createdAt: "2024-06-28 13:15",
      views: 156,
      likes: 18,
      comments: 8,
      board: "free",
      boardName: "자유게시판",
      status: "정상"
    },
    // 질문게시판 데이터
    {
      id: 3,
      title: "강아지 산책 시 주의사항이 궁금해요",
      content: "처음으로 강아지를 키우게 되었는데, 산책할 때 어떤 점들을 주의해야 할까요?",
      author: "초보집사",
      createdAt: "2024-06-28 12:45",
      views: 89,
      likes: 7,
      comments: 15,
      board: "question",
      boardName: "질문게시판",
      status: "답변완료"
    },
    {
      id: 4,
      title: "고양이가 밥을 안 먹어요, 어떻게 해야 할까요?",
      content: "3일째 우리 고양이가 사료를 거의 안 먹고 있어요.",
      author: "걱정많은집사",
      createdAt: "2024-06-28 11:20",
      views: 156,
      likes: 12,
      comments: 23,
      board: "question",
      boardName: "질문게시판",
      status: "답변대기"
    },
    // 후기게시판 데이터
    {
      id: 5,
      title: "○○병원 진료 후기 - 정말 친절하세요!",
      content: "우리 강아지 중성화 수술을 위해 방문했는데, 의료진분들이 정말 친절하고 꼼꼼하게 봐주셨어요.",
      author: "만족한견주",
      createdAt: "2024-06-28 10:30",
      views: 345,
      likes: 28,
      comments: 16,
      board: "review",
      boardName: "후기게시판",
      status: "정상"
    },
    {
      id: 6,
      title: "펫샵 사료 구매 후기 - 배송 빨라요",
      content: "온라인으로 주문한 사료가 하루만에 왔어요.",
      author: "쇼핑마니아",
      createdAt: "2024-06-28 09:15",
      views: 189,
      likes: 15,
      comments: 7,
      board: "review",
      boardName: "후기게시판",
      status: "정상"
    }
  ];

  // 필터링된 게시글
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBoard = selectedBoard === "all" || post.board === selectedBoard;
    return matchesSearch && matchesBoard;
  });

  // 페이지네이션
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const getBoardBadgeColor = (board) => {
    switch(board) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case '답변완료': return 'bg-green-100 text-green-800';
      case '답변대기': return 'bg-yellow-100 text-yellow-800';
      case '정상': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="ml-80 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">고객센터 관리</h1>

          {/* 검색 및 필터 영역 */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="제목, 내용, 작성자로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedBoard === "all" ? "default" : "outline"}
                    onClick={() => setSelectedBoard("all")}
                    className="whitespace-nowrap"
                  >
                    전체
                  </Button>
                  <Button
                    variant={selectedBoard === "free" ? "default" : "outline"}
                    onClick={() => setSelectedBoard("free")}
                    className="whitespace-nowrap"
                  >
                    자유게시판
                  </Button>
                  <Button
                    variant={selectedBoard === "question" ? "default" : "outline"}
                    onClick={() => setSelectedBoard("question")}
                    className="whitespace-nowrap"
                  >
                    질문게시판
                  </Button>
                  <Button
                    variant={selectedBoard === "review" ? "default" : "outline"}
                    onClick={() => setSelectedBoard("review")}
                    className="whitespace-nowrap"
                  >
                    후기게시판
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {allPosts.filter(p => p.board === 'free').length}
                  </div>
                  <div className="text-sm text-gray-600">자유게시판</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {allPosts.filter(p => p.board === 'question').length}
                  </div>
                  <div className="text-sm text-gray-600">질문게시판</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {allPosts.filter(p => p.board === 'review').length}
                  </div>
                  <div className="text-sm text-gray-600">후기게시판</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {allPosts.filter(p => p.status === '답변대기').length}
                  </div>
                  <div className="text-sm text-gray-600">답변대기</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 게시글 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>게시글 관리 ({filteredPosts.length}개)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getBoardBadgeColor(post.board)}`}>
                          {post.boardName}
                        </Badge>
                        <Badge className={`text-xs ${getStatusBadgeColor(post.status)}`}>
                          {post.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{post.createdAt}</span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
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
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerSupport;
