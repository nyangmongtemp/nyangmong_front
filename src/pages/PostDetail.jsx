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
import CommentSection from "@/components/CommentSection";
import axiosInstance from "../../configs/axios-config";
import axios from "axios";
import { useAuth } from "../context/UserContext";
import { API_BASE_URL, BOARD, USER } from "../../configs/host-config";
import ReportButton from "../components/ReportButton";

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

const PostDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nowLoggedUserId, setNowLoggedUserId] = useState(null);

  // 댓글도 실제 데이터로 연동하려면 별도 상태 필요
  const [comments, setComments] = useState([]);
  const { nickname: userNickname, isLoggedIn } = useAuth();

  // 유저 ID 비동기 조회 함수 추가
  const getNowLoggedUserId = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}${USER}/findId`);
      console.log(response);

      setNowLoggedUserId(response.data);
      return response.data;
    } catch (err) {
      console.error("유저 ID 조회 실패:", err);
      setNowLoggedUserId(null);
      return null;
    }
  };

  useEffect(() => {
    if (!type || !id) {
      setError("잘못된 접근입니다. (type 또는 id 없음)");
      setPost(null);
      return;
    }
    setLoading(true);
    setError(null);

    // 카테고리 매핑
    const categoryMap = {
      free: "FREE",
      question: "QUESTION",
      review: "REVIEW",
    };
    const category = categoryMap[type] || type.toUpperCase();

    axiosInstance
      .get(`${API_BASE_URL}${BOARD}/detail/${category}/${id}`, {
        headers: {
          Authorization: undefined,
        },
      })
      .then((res) => {
        console.log("전체 API 응답:", res);
        console.log("응답 데이터:", res.data);

        // 응답 구조에 따라 데이터 파싱
        let data = res.data.result || res.data.data || res.data;
        if (Array.isArray(data)) data = data[0]; // result가 배열이면 첫 번째 요소만 사용
        console.log("파싱된 데이터:", data); // 콘솔 출력 추가

        // 데이터가 없거나 필수 필드가 없는 경우 처리
        if (!data) {
          console.error("데이터가 없습니다");
          setError("게시글 데이터를 찾을 수 없습니다.");
          return;
        }

        // 백엔드 필드명을 프론트엔드 필드명으로 매핑
        const mappedData = {
          id: data.postid,
          title: data.title,
          content: data.content,
          author: data.nickname,
          userId: data.userid,
          createdAt: data.createdat,
          views: data.viewcount,
          likes: 0, // 백엔드에 likes 필드가 없으므로 기본값 0
          thumbnailimage: data.thumbnailimage,
          category: data.category,
        };

        getNowLoggedUserId();

        console.log("매핑된 데이터:", mappedData);

        setPost(mappedData);
        // 댓글이 포함되어 있다면 분리
        if (data && data.comments) setComments(data.comments);
      })
      .catch((err) => {
        console.error("게시글 조회 에러:", err);
        setError("게시글을 불러오지 못했습니다.");
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [type, id]);

  const handleLike = () => {
    // TODO: 좋아요 기능
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    window.alert("링크가 복사되었습니다!");
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const categoryMap = {
        review: "REVIEW",
        question: "QUESTION",
        free: "FREE",
      };
      const category = categoryMap[type] || type.toUpperCase();
      await axiosInstance.delete(
        `${API_BASE_URL}${BOARD}/${category}/delete/${id}`
      );
      alert("게시글이 삭제되었습니다.");
      navigate(`/board/${type}`);
    } catch (err) {
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  // 렌더링 시 post가 없으면 로딩/에러 처리
  if (loading) {
    return <div className="p-8 text-center text-gray-500">로딩 중...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!post) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>게시글을 불러올 수 없습니다.</p>
        <p>
          URL: /board/detail/{type}/{id}
        </p>
        <p>Post 상태: {JSON.stringify(post)}</p>
      </div>
    );
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
                        {formatDateTime(post.createdAt)}
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
                    {post && userNickname && post.author === userNickname && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/edit/${type}/${id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDelete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {/* 신고 버튼: 본인 댓글이 아니면 노출 */}
                    {nowLoggedUserId !== post.userId && (
                      <ReportButton
                        category="board"
                        accusedUserId={post.userId}
                      />
                    )}
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
                  <div
                    className="whitespace-pre-wrap text-gray-700 leading-relaxed mb-6"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 댓글 섹션 */}
            <CommentSection
              postId={id}
              category={type}
              showReplies={true}
              userId={post.userId}
            />
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
