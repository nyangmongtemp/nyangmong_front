import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Eye, Clock } from "lucide-react";

const RecentPosts = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const recentPosts = [
    {
      id: 1,
      title: "강아지 산책 시 주의사항이 궁금해요",
      category: "질문게시판",
      author: "초보집사",
      replies: 12,
      views: 234,
      time: "10분 전",
      categoryColor: "bg-blue-100 text-blue-800",
    },
    {
      id: 2,
      title: "고양이 사료 추천해주세요!",
      category: "정보게시판",
      author: "냥이맘",
      replies: 8,
      views: 156,
      time: "25분 전",
      categoryColor: "bg-green-100 text-green-800",
    },
    {
      id: 3,
      title: "반려동물 응급처치 방법",
      category: "정보게시판",
      author: "펫닥터",
      replies: 23,
      views: 445,
      time: "1시간 전",
      categoryColor: "bg-green-100 text-green-800",
    },
    {
      id: 4,
      title: "우리 강아지가 음식을 안 먹어요",
      category: "질문게시판",
      author: "걱정많은주인",
      replies: 15,
      views: 278,
      time: "1시간 전",
      categoryColor: "bg-blue-100 text-blue-800",
    },
    {
      id: 5,
      title: "고양이 털 관리하는 방법",
      category: "정보게시판",
      author: "그루밍전문가",
      replies: 19,
      views: 367,
      time: "2시간 전",
      categoryColor: "bg-green-100 text-green-800",
    },
    {
      id: 6,
      title: "강아지 훈련 방법 문의드립니다",
      category: "질문게시판",
      author: "댕댕이주인",
      replies: 7,
      views: 189,
      time: "3시간 전",
      categoryColor: "bg-blue-100 text-blue-800",
    },
    {
      id: 7,
      title: "반려동물 보험 가입 후기",
      category: "정보게시판",
      author: "경험자",
      replies: 31,
      views: 523,
      time: "4시간 전",
      categoryColor: "bg-green-100 text-green-800",
    },
    {
      id: 8,
      title: "고양이가 밤에 우는 이유가 뭘까요?",
      category: "질문게시판",
      author: "밤잠설친집사",
      replies: 18,
      views: 298,
      time: "5시간 전",
      categoryColor: "bg-blue-100 text-blue-800",
    },
    {
      id: 9,
      title: "강아지 예방접종 스케줄",
      category: "정보게시판",
      author: "수의사김",
      replies: 12,
      views: 412,
      time: "6시간 전",
      categoryColor: "bg-green-100 text-green-800",
    },
    {
      id: 10,
      title: "새끼 고양이 키우는 팁 좀 알려주세요",
      category: "질문게시판",
      author: "새내기집사",
      replies: 24,
      views: 356,
      time: "7시간 전",
      categoryColor: "bg-blue-100 text-blue-800",
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">최근 게시물</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">
            전체 게시판 최신글
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {(isMobile ? recentPosts.slice(0, 5) : recentPosts).map(
              (post, index) => (
                <div
                  key={post.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`text-xs ${post.categoryColor}`}>
                          {post.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          #{index + 1}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1 hover:text-orange-600 transition-colors line-clamp-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>by {post.author}</span>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{post.replies}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default RecentPosts;
