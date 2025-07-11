import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Eye, Clock } from "lucide-react";
import axiosInstance from "../../configs/axios-config";
import { useNavigate } from "react-router-dom";

const RecentPosts = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // question, review, free 카테고리 최근 게시글 API 연동
  useEffect(() => {
    const fetchRecentPosts = async () => {
      setLoading(true);
      setError(null);
      const fetchCategory = async (category, label, color) => {
        try {
          const res = await axiosInstance.get(
            "/board-service/board/information/list",
            {
              params: { category, page: 0, size: 30 },
            }
          );
          const content = res.data.content || res.data;
          return content.map((item, idx) => ({
            id: item.postId, // PK
            title: item.title,
            category: label,
            author: item.nickname, // 작성자
            replies: item.comments || 0,
            views: item.viewCount, // 조회수
            time: item.createAt, // 작성시간
            updateTime: item.updateAt, // 수정시간
            categoryColor: color,
            imageUrl: item.thumbnailImage || null,
          }));
        } catch (err) {
          return [];
        }
      };
      Promise.all([
        fetchCategory("QUESTION", "질문게시판", "bg-blue-100 text-blue-800"),
        fetchCategory("REVIEW", "후기게시판", "bg-green-100 text-green-800"),
        fetchCategory("FREE", "자유게시판", "bg-orange-100 text-orange-800"),
      ]).then((results) => {
        // 모든 카테고리 데이터 합치고, 최신순 정렬(작성시간 기준)
        const allPosts = results.flat();
        allPosts.sort((a, b) => {
          const dateA = a.time ? new Date(a.time) : new Date(0);
          const dateB = b.time ? new Date(b.time) : new Date(0);
          return dateB - dateA; // 최신순(내림차순)
        });
        setPosts(allPosts.slice(0, 10)); // 상위 10개만 보여줌
        setLoading(false);
      });
    };

    fetchRecentPosts(); // 초기 로드

    // 페이지 포커스 시 갱신 (새로고침, 탭 전환 등)
    const handleFocus = () => {
      fetchRecentPosts();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

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
            {(isMobile ? posts.slice(0, 5) : posts).map((post, index) => (
              <div
                key={post.id}
                onClick={() => {
                  // 카테고리 라벨을 실제 라우트 파라미터로 변환
                  let type = "free";
                  if (post.category === "질문게시판") type = "question";
                  else if (post.category === "후기게시판") type = "review";
                  else if (post.category === "자유게시판") type = "free";
                  navigate(`/post/${type}/${post.id}`);
                }}
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
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default RecentPosts;
