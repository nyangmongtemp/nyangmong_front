import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

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

const CommentsList = ({ comments, isLoading }) => {
  const navigate = useNavigate();

  // 댓글 클릭 핸들러
  const handleCommentClick = (comment) => {
    const { category, contentId } = comment;

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
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardTitle className="text-gray-800 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          내가 작성한 댓글 ({comments.length}개)
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
  );
};

export default CommentsList;
