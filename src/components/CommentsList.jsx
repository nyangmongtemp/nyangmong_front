import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/context/UserContext";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, MAIN } from "../../configs/host-config";

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

// 카테고리 한글 변환 함수
const getCategoryKorean = (category) => {
  const categoryMap = {
    ADOPT: "분양게시판",
    REVIEW: "후기게시판",
    QUESTION: "질문게시판",
    INTRODUCTION: "소개게시판",
    FREE: "자유게시판",
  };
  return categoryMap[category] || category;
};

const CommentsList = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 10; // 다시 10개로 복원

  // 댓글 데이터 가져오기
  const fetchMyComments = useCallback(
    async (page = 0) => {
      console.log("fetchMyComments 함수 내부, 받은 page:", page);
      if (!token) return;

      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_BASE_URL}${MAIN}/comment/mypage`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: page,
              size: itemsPerPage,
              sort: "commentId,desc", // 댓글 ID 기준 최신순 정렬
            },
          }
        );
        console.log(
          "실제 요청 URL:",
          `${API_BASE_URL}${MAIN}/comment/mypage?page=${page}&size=${itemsPerPage}&sort=createAt,desc`
        );

        console.log("API 응답:", response.data);
        console.log("댓글 데이터:", response.data.result);
        if (response.data.result && response.data.result.content) {
          console.log(
            "댓글 ID 목록:",
            response.data.result.content.map((c) => c.commentId)
          );
          console.log("현재 페이지:", page);
          console.log("페이지 크기:", itemsPerPage);
          console.log("총 페이지 수:", response.data.result.totalPages);
          console.log("총 요소 수:", response.data.result.totalElements);
          console.log(
            "현재 페이지 요소 수:",
            response.data.result.content.length
          );
        }

        if (response.data.result) {
          setComments(response.data.result.content || []);
          setTotalPages(response.data.result.totalPages || 0);
          setTotalElements(response.data.result.totalElements || 0);
        }
      } catch (error) {
        console.error("댓글 데이터 가져오기 실패:", error);
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    },
    [token, itemsPerPage]
  );

  // 컴포넌트 마운트 시 댓글 데이터 가져오기
  useEffect(() => {
    console.log("페이지 변경됨:", currentPage);
    console.log("fetchMyComments 함수 호출, 전달된 page:", currentPage);
    fetchMyComments(currentPage);
  }, [fetchMyComments, currentPage]);

  // 댓글 클릭 핸들러
  const handleCommentClick = (comment) => {
    const { category, contentId } = comment;
    console.log(comment);

    if (category === "ADOPT") {
      navigate(`/adoption-detail/${contentId}`);
    } else if (
      category === "REVIEW" ||
      category === "FREE" ||
      category === "QUESTION" ||
      category === "INTRODUCTION"
    ) {
      const categoryLower = category.toLowerCase();
      navigate(`/detail/${categoryLower}/${contentId}`);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="text-gray-800 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            내가 작성한 댓글
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">댓글을 불러오는 중...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="text-gray-800 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            내가 작성한 댓글 ({totalElements}개)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {comments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                작성한 댓글이 없습니다.
              </div>
            ) : (
              comments.map((comment) => {
                const isClickable =
                  comment.category === "ADOPT" ||
                  comment.category === "REVIEW" ||
                  comment.category === "FREE" ||
                  comment.category === "QUESTION" ||
                  comment.category === "INTRODUCTION";

                return (
                  <div
                    key={comment.commentId}
                    className={`p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 ${
                      isClickable ? "cursor-pointer" : ""
                    }`}
                    onClick={() => isClickable && handleCommentClick(comment)}
                  >
                    <div className="flex items-start gap-3">
                      {comment.profileImage && (
                        <img
                          src={comment.profileImage}
                          alt={comment.nickname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm text-gray-800">
                            {comment.nickname}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(comment.createAt)}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {getCategoryKorean(comment.category)}
                          </span>
                          {comment.hidden && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              비공개
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded break-words whitespace-pre-line">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    const newPage = Math.max(0, currentPage - 1);
                    console.log("이전 페이지 클릭:", newPage);
                    setCurrentPage(newPage);
                  }}
                  className={
                    currentPage === 0
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i)
                .filter(
                  (page) =>
                    page === 0 ||
                    page === totalPages - 1 ||
                    Math.abs(page - currentPage) <= 2
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <PaginationItem>
                        <span className="px-4 py-2">...</span>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => {
                          console.log("페이지 버튼 클릭:", page);
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    const newPage = Math.min(totalPages - 1, currentPage + 1);
                    console.log("다음 페이지 클릭:", newPage);
                    setCurrentPage(newPage);
                  }}
                  className={
                    currentPage === totalPages - 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
