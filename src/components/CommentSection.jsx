import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Send, Reply, Edit, Trash2, Heart } from "lucide-react";
import { useAuth } from "@/context/UserContext";
import {
  getCommunityComments,
  createCommunityComment,
  updateCommunityComment,
  deleteCommunityComment,
  getAdoptionComments,
  createAdoptionComment,
  updateAdoptionComment,
  deleteAdoptionComment,
} from "../../configs/api-examples";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, MAIN, USER } from "../../configs/host-config";
import { Card as BorderCard } from "@/components/ui/card";
import { AiFillHeart } from "react-icons/ai";

// 날짜 포맷 함수 추가
const formatDateTime = (dateString) => {
  if (!dateString) return "";
  // ISO 8601: '2024-07-10T13:45:23.000Z' → '2024-07-10 13:45'
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

const CommentSection = ({
  postId,
  category,
  userId,
  showReplies = true,
  className = "",
}) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [hidden, setHidden] = useState(false); // 비공개 여부 상태
  // 답글 입력창 노출 상태
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // 페이징 관련 상태
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const [nowLoggedUserId, setNowLoggedUserId] = useState(null);

  // 댓글, 좋아요 개수 조회
  const fetchCommentLikeCount = async () => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}${MAIN}/detail`,
        {
          category: category,
          contentId: postId,
        }
      );
      console.log(response);

      setCommentCount(response.data.result.commentCount);
      setLikeCount(response.data.result.likeCount);
    } catch (err) {
      console.error("좋아요/댓글 개수 조회 실패:", err);
    }
  };

  // 좋아요 토글
  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await axiosInstance.post(`${API_BASE_URL}${MAIN}/like`, {
        category: category,
        contentId: postId,
      });
      console.log(response);

      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("좋아요 토글 실패:", err);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // 댓글 목록 페이징 조회
  const fetchComments = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const response = await axiosInstance.post(
        `${API_BASE_URL}${MAIN}/comment/list?page=${pageNum}&size=10&sort=createAt`,
        {
          category: category,
          contentId: postId,
        }
      );
      console.log(response);

      // === 배열 추출을 안전하게! ===
      let newComments = [];
      let totalPages = 1;
      if (
        response &&
        response.data &&
        response.data.result &&
        Array.isArray(response.data.result.content)
      ) {
        newComments = response.data.result.content;
        totalPages = response.data.result.totalPages || 1;
      }

      if (append) {
        setComments((prev) => [...prev, ...newComments]);
      } else {
        setComments(newComments);
      }

      setHasMore(pageNum < totalPages);
    } catch (err) {
      console.error("댓글 조회 실패:", err);
      setError("댓글을 불러오는데 실패했습니다.");
      if (!append) {
        setComments([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 더보기 버튼 클릭 핸들러
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchComments(nextPage, true);
  };

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}${MAIN}/comment/create`,
        {
          content: newComment,
          authorId: user?.id,
          category: category,
          contentId: postId,
          hidden: hidden,
        }
      );
      console.log(response);

      setNewComment("");
      setHidden(false);
      // 댓글 작성 후 첫 페이지부터 다시 로드
      setPage(1);
      fetchComments(1, false);
      fetchCommentLikeCount(); // 댓글 개수 업데이트
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  // 댓글 수정
  const handleCommentEdit = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const response = await axiosInstance.patch(
        `${API_BASE_URL}${MAIN}/comment/modify`,
        {
          content: editText,
          commentId,
        }
      );
      setEditingComment(null);
      setEditText("");
      alert("댓글 수정이 완료되었습니다.");
      // 댓글 수정 후 현재 페이지 다시 로드
      fetchComments(page, false);
    } catch (err) {
      console.error("댓글 수정 실패:", err);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      console.log(commentId);

      const response = await axiosInstance.delete(
        `${API_BASE_URL}${MAIN}/comment/delete/${commentId}`
      );
      alert("댓글 삭제가 완료되었습니다.");
      // 댓글 삭제 후 첫 페이지부터 다시 로드
      setPage(1);
      fetchComments(1, false);
      fetchCommentLikeCount(); // 댓글 개수 업데이트
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // 답글 작성
  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      // TODO: 답글 API 구현 시 활성화
      console.log("답글 작성:", commentId, replyText);
      const response = await axiosInstance.post(
        `${API_BASE_URL}${MAIN}/reply/create`,
        {
          commentId,
          content: replyText,
        }
      );
      setReplyText("");
      setReplyTo(null);
    } catch (err) {
      console.error("답글 작성 실패:", err);
      alert("답글 작성에 실패했습니다.");
    }
  };

  // 컴포넌트 마운트 시 댓글 조회
  // 좋아요 여부 조회
  const fetchIsLiked = async () => {
    if (!isLoggedIn || !postId || !category) return;
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}${MAIN}/liked`,
        {
          category: category,
          contentId: postId,
        }
      );
      console.log(response);

      // 백엔드에서 true/false 반환한다고 가정
      setIsLiked(!!response.data?.result);
    } catch (err) {
      console.error("좋아요 여부 조회 실패:", err);
    }
  };

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
    if (postId && category) {
      setPage(1);
      setHasMore(true);
      fetchCommentLikeCount();
      fetchComments(1, false);
      fetchIsLiked();
    }
  }, [postId, category, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      getNowLoggedUserId();
    }
  }, [isLoggedIn]);

  const handleReplyClick = (commentId) => {
    if (replyTo === commentId) {
      setReplyTo(null);
      setReplyText("");
    } else {
      setReplyTo(commentId);
      setReplyText("");
    }
  };

  const handleKeyPress = (e, callback) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      callback();
    }
  };

  // 비공개 댓글 열람 상태 관리
  const [revealedComments, setRevealedComments] = useState({}); // { [commentId]: true }

  // 비공개 댓글 확인 API
  const handleRevealHiddenComment = async (commentId) => {
    if (!isLoggedIn) {
      alert("비공개 댓글을 열람할 권한이 없습니다.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}${MAIN}/comment/hidden`,
        {
          userId,
          commentId,
        }
      );
      console.log(response);

      if (response.data === true) {
        setRevealedComments((prev) => ({ ...prev, [commentId]: true }));
      } else {
        alert("비공개 댓글을 확인할 권한이 없습니다.");
      }
    } catch (err) {
      if (err.status === 403) {
        alert("비공개 댓글을 열람할 권한이 없습니다.");
      } else {
        alert("비공개 댓글 확인에 실패했습니다.");
      }
    }
  };

  // 대댓글 상태 관리
  const [replyOpen, setReplyOpen] = useState({}); // { [commentId]: true }
  const [replyEdit, setReplyEdit] = useState({}); // { [replyId]: true }
  const [replyEditText, setReplyEditText] = useState("");
  const [replyInputs, setReplyInputs] = useState({}); // { [commentId]: "" }
  const [repliesByCommentId, setRepliesByCommentId] = useState({}); // { [commentId]: [replies] }

  // 대댓글 조회
  const fetchReplies = async (commentId) => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}${MAIN}/reply/list/${commentId}`
      );
      // 응답 구조에 따라 result, data 등에서 배열 추출
      const replies = Array.isArray(response.data?.result)
        ? response.data.result
        : response.data?.replies || [];
      setRepliesByCommentId((prev) => ({ ...prev, [commentId]: replies }));
    } catch (err) {
      alert("대댓글을 불러오는데 실패했습니다.");
    }
  };

  // 대댓글 더보기 버튼 클릭 핸들러
  const handleReplyToggle = (commentId) => {
    setReplyOpen((prev) => {
      const next = { ...prev, [commentId]: !prev[commentId] };
      // 열 때만 fetch
      if (!prev[commentId]) {
        fetchReplies(commentId);
      }
      return next;
    });
  };

  // 대댓글 생성
  const handleReplyCreate = async (parentCommentId) => {
    const content = replyInputs[parentCommentId]?.trim();
    if (!content) return;
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}${MAIN}/reply/create`,
        {
          commentId: parentCommentId,
          content,
        }
      );
      console.log(response);
      alert("대댓글이 생성되었습니다.");
      setReplyInputs((prev) => ({ ...prev, [parentCommentId]: "" }));
      // 대댓글 목록 새로고침
      fetchReplies(parentCommentId);
      // 컴포넌트 전체 데이터 새로고침
      fetchComments(page, false);
      fetchCommentLikeCount();
      fetchIsLiked();
    } catch (err) {
      alert("대댓글 작성에 실패했습니다.");
    }
  };
  // 대댓글 수정
  const handleReplyEditSubmit = async (replyId, parentCommentId) => {
    if (!replyEditText.trim()) return;
    try {
      const response = await axiosInstance.patch(
        `${API_BASE_URL}${MAIN}/reply/modify`,
        {
          replyId,
          content: replyEditText,
        }
      );
      console.log(response);
      setReplyEdit((prev) => ({ ...prev, [replyId]: false }));
      setReplyEditText("");
      // 대댓글 목록 새로고침
      fetchReplies(parentCommentId);
      // 컴포넌트 전체 데이터 새로고침
      fetchComments(page, false);
      fetchCommentLikeCount();
      fetchIsLiked();
    } catch (err) {
      alert("대댓글 수정에 실패했습니다.");
    }
  };
  // 대댓글 삭제
  const handleReplyDelete = async (replyId, parentCommentId) => {
    if (!window.confirm("대댓글을 삭제하시겠습니까?")) return;
    try {
      const response = await axiosInstance.delete(
        `${API_BASE_URL}${MAIN}/reply/delete/${replyId}`
      );
      console.log(response);
      alert("대댓글 삭제가 완료되었습니다.");
      // 대댓글 목록 새로고침
      fetchReplies(parentCommentId);
      // 컴포넌트 전체 데이터 새로고침
      fetchComments(page, false);
      fetchCommentLikeCount();
      fetchIsLiked();
    } catch (err) {
      alert("대댓글 삭제에 실패했습니다.");
    }
  };

  return (
    <Card className={`border-orange-200 shadow-sm ${className}`}>
      <CardHeader>
        <div className="flex flex-col items-center justify-center py-2">
          <button
            onClick={handleLikeToggle}
            className={`transition-all duration-200 focus:outline-none ${
              isLiked
                ? "text-red-500 scale-110"
                : "text-gray-300 hover:text-red-400"
            }`}
          >
            <AiFillHeart className="w-12 h-12" />
          </button>
          <span className="mt-1 text-xl font-bold text-gray-700">
            {likeCount}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* 댓글 작성 */}
        {isLoggedIn ? (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-pink-50 rounded-lg border border-orange-100">
            <Textarea
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleCommentSubmit)}
              className="mb-3 resize-none border-orange-200 focus:border-orange-400"
              rows={5}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={hidden}
                  onChange={(e) => setHidden(e.target.checked)}
                  className="accent-orange-500"
                />
                비공개
              </label>
              <Button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
                className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500"
              >
                <Send className="w-4 h-4 mr-2" />
                댓글 작성
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-2">
              댓글을 작성하려면 로그인이 필요합니다.
            </p>
          </div>
        )}

        {/* 댓글 목록 */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">댓글을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchComments}
              className="mt-2"
            >
              다시 시도
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(comments) &&
              comments.map((comment, index) => (
                <BorderCard
                  key={comment.commentId}
                  className="border border-orange-100 shadow-none p-4 mb-2"
                >
                  {/* 프로필 이미지 + 닉네임/날짜/내용 세로 정렬 */}
                  <div className="flex items-start gap-3 mb-2">
                    {comment.profileImage && (
                      <img
                        src={comment.profileImage}
                        alt={comment.nickname}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-base text-gray-800">
                          {comment.nickname}
                        </span>
                        <span className="text-xs text-gray-500">
                          {comment.createAt
                            ? formatDateTime(comment.createAt)
                            : ""}
                        </span>
                      </div>
                      <div className="text-gray-700 text-sm break-words whitespace-pre-line">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                  {/* 댓글 액션 버튼들 */}
                  {isLoggedIn && (
                    <div className="flex gap-2">
                      {/* 수정/삭제 버튼: 본인만 */}
                      {nowLoggedUserId === comment.userId && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingComment(comment.commentId);
                              setEditText(comment.content);
                            }}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCommentDelete(comment.commentId)
                            }
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {/* 답글 버튼: 로그인 시 항상, 단 비공개 댓글 미열람 시 숨김 */}
                      {showReplies &&
                        !(
                          comment.hidden && !revealedComments[comment.commentId]
                        ) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setReplyTo(
                                replyTo === comment.commentId
                                  ? null
                                  : comment.commentId
                              )
                            }
                            className="text-orange-600 hover:bg-orange-50"
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            답글
                          </Button>
                        )}
                    </div>
                  )}
                  {/* 답글 입력창: replyTo가 현재 commentId일 때만 노출 */}
                  {replyTo === comment.commentId && (
                    <div className="mt-3">
                      <Textarea
                        placeholder="답글을 입력하세요..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyPress={(e) =>
                          handleKeyPress(e, () =>
                            handleReplySubmit(comment.commentId)
                          )
                        }
                        className="resize-none border-orange-200 focus:border-orange-400"
                        rows={2}
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleReplySubmit(comment.commentId)}
                          disabled={!replyText.trim()}
                          className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          답글 작성
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* 대댓글 더보기 버튼 */}
                  {comment.reply &&
                    (!comment.hidden ||
                      revealedComments[comment.commentId]) && (
                      <div className="w-full mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                          onClick={() => handleReplyToggle(comment.commentId)}
                        >
                          {replyOpen[comment.commentId]
                            ? "대댓글 숨기기"
                            : "대댓글 더보기"}
                        </Button>
                      </div>
                    )}
                  {/* 대댓글 목록 - 댓글과 같은 너비로 표시 */}
                  {replyOpen[comment.commentId] &&
                    repliesByCommentId[comment.commentId] &&
                    repliesByCommentId[comment.commentId].length > 0 &&
                    (!comment.hidden ||
                      revealedComments[comment.commentId]) && (
                      <div className="w-full mt-3">
                        <div className="border-l-2 border-orange-200 pl-4 space-y-2">
                          {repliesByCommentId[comment.commentId].map(
                            (reply) => (
                              <div
                                key={reply.replyId}
                                className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      {reply.profileImage && (
                                        <img
                                          src={reply.profileImage}
                                          alt={reply.nickname}
                                          className="w-6 h-6 rounded-full"
                                        />
                                      )}
                                      <span className="font-medium text-xs text-gray-800">
                                        {reply.nickname}
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        {reply.createAt
                                          ? formatDateTime(reply.createAt)
                                          : ""}
                                      </span>
                                    </div>
                                    {/* 답글 수정 모드 */}
                                    {replyEdit[reply.replyId] ? (
                                      <>
                                        <Textarea
                                          value={replyEditText}
                                          onChange={(e) =>
                                            setReplyEditText(e.target.value)
                                          }
                                          className="resize-none"
                                          rows={2}
                                        />
                                        <div className="flex gap-2 mt-2">
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              handleReplyEditSubmit(
                                                reply.replyId,
                                                comment.commentId
                                              )
                                            }
                                            className="bg-orange-500 hover:bg-orange-600"
                                          >
                                            수정 완료
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setReplyEdit((prev) => ({
                                                ...prev,
                                                [reply.replyId]: false,
                                              }));
                                              setReplyEditText("");
                                            }}
                                          >
                                            취소
                                          </Button>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="text-gray-700 text-sm break-words whitespace-pre-line">
                                        {reply.content}
                                      </div>
                                    )}
                                  </div>
                                  {isLoggedIn &&
                                    nowLoggedUserId === reply.userId && (
                                      <div className="flex gap-1 ml-2 shrink-0">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setReplyEdit((prev) => ({
                                              ...prev,
                                              [reply.replyId]: true,
                                            }));
                                            setReplyEditText(reply.content);
                                          }}
                                          className="text-blue-600 hover:bg-blue-50 p-1 h-auto"
                                        >
                                          <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            handleReplyDelete(
                                              reply.replyId,
                                              comment.commentId
                                            )
                                          }
                                          className="text-red-600 hover:bg-red-50 p-1 h-auto"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </BorderCard>
              ))}
          </div>
        )}

        {comments.length === 0 && !loading && !error && (
          <div className="text-center py-8 text-gray-500">
            첫 번째 댓글을 작성해보세요!
          </div>
        )}

        {/* 더보기 버튼 */}
        {hasMore && comments.length > 0 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                  불러오는 중...
                </>
              ) : (
                "댓글 더보기"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentSection;
