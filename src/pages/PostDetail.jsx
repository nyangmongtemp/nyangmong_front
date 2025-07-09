import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  Trash2,
} from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import axiosInstance from "../../configs/axios-config";

const PostDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 댓글도 실제 데이터로 연동하려면 별도 상태 필요
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!type || !id) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get(`/board-service/board/detail/${type.toUpperCase()}/${id}`)
      .then((res) => {
        // 응답 구조에 따라 데이터 파싱
        let data = res.data.result || res.data.data || res.data;
        if (Array.isArray(data)) data = data[0]; // result가 배열이면 첫 번째 요소만 사용
        console.log("상세 post 데이터:", data); // 콘솔 출력 추가
        setPost(data);
        // 댓글이 포함되어 있다면 분리
        if (data && data.comments) setComments(data.comments);
      })
      .catch((err) => {
        setError("게시글을 불러오지 못했습니다.");
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [type, id]);

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      setNewComment("");
    }
  };

  const handleLike = () => {
    // TODO: 좋아요 기능
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    window.alert("링크가 복사되었습니다!");
  };

  // 렌더링 시 post가 없으면 로딩/에러 처리
  if (loading) {
    return <div className="p-8 text-center text-gray-500">로딩 중...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 영역 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 게시물 내용 */}
            <Card className="border-orange-200 shadow-sm">
              {/* 뒤로가기 버튼 */}
              <div className="flex items-center gap-4 mb-6 pl-4 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/board/${type}`)}
                  className="p-2 hover:bg-orange-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-lg font-semibold text-gray-800">
                  뒤로 가기
                </h1>
              </div>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-500">
                        {post.author}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        {post.createdAt}
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold mb-4 text-gray-900">
                      {post.title}
                    </h1>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        조회 {post.views}
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        좋아요 {post.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        댓글 {comments.length}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* 썸네일 이미지 */}
                {post.thumbnailimage && (
                  <div className="mb-6 flex justify-center">
                    <img
                      src={post.thumbnailimage}
                      alt={post.title}
                      className="max-h-80 rounded-lg object-contain"
                    />
                  </div>
                )}
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed mb-6">
                    {post.content}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    onClick={handleLike}
                    variant="outline"
                    className="flex items-center gap-2 border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <Heart className="w-4 h-4" />
                    좋아요 {post.likes}
                  </Button>
                  <div className="flex gap-2"></div>
                </div>
              </CardContent>
            </Card>

            {/* 댓글 섹션 */}
            <Card className="border-orange-200 shadow-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  댓글 {comments.length}개
                </h3>
              </CardHeader>
              <CardContent>
                {/* 댓글 작성 */}
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-pink-50 rounded-lg border border-orange-100">
                  <Textarea
                    placeholder="댓글을 입력하세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-3 resize-none border-orange-200 focus:border-orange-400"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim()}
                      className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500"
                    >
                      댓글 작성
                    </Button>
                  </div>
                </div>

                {/* 댓글 목록 */}
                <div className="space-y-4">
                  {comments.map((comment, index) => (
                    <div key={comment.id}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm text-gray-800">
                              {comment.author}
                            </span>
                            <span className="text-xs text-gray-500">
                              {comment.createdAt}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:bg-orange-50"
                          >
                            답글
                          </Button>
                        </div>
                      </div>
                      {index < comments.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>

                {comments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    첫 번째 댓글을 작성해보세요!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 영역 */}
          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-orange-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">냥</span>
              </div>
              <p className="font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                냥몽 - 반려동물과 함께하는 따뜻한 커뮤니티
              </p>
            </div>
            <p className="text-sm">© 2024 냥몽. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PostDetail;
