import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Heart, MessageCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, BOARD, ABS } from "../../configs/host-config";
import { useAuth } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

// 카테고리 한글 변환 함수
const getCategoryKorean = (category) => {
  const map = {
    QUESTION: "질문",
    FREE: "자유",
    REVIEW: "후기",
    INTRODUCTION: "소개",
    ADOPTION: "분양",
  };
  return map[category?.toUpperCase()] || category;
};

const PostsList = ({ userId, category }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(0);
  }, [category]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token || !category) return;
      setIsLoading(true);
      console.log(category);

      try {
        let url, params, response;
        if (category === "adoption") {
          url = `${API_BASE_URL}${ABS}/animal-board/mypage`;
          params = {
            page: currentPage,
            size: itemsPerPage,
            // sort: "animalId,desc", // 필요시 주석 해제
          };
          const queryString = Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
          console.log("[분양] 실제 요청 URL:", `${url}?${queryString}`);
          response = await axiosInstance.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params,
          });
          console.log("[분양] 응답 객체:", response);
          // 분양 게시판 응답 구조에 맞게 세팅
          if (response.data && Array.isArray(response.data.content)) {
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages || 1);
            setTotalElements(response.data.totalElements || 0);
          }
        } else {
          url = `${API_BASE_URL}${BOARD}/list/${category}`;
          params = {
            page: currentPage,
            size: itemsPerPage,
            sort: "postId,desc",
          };
          const queryString = Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
          console.log("실제 요청 URL:", `${url}?${queryString}`);
          response = await axiosInstance.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params,
          });
          console.log(response);
          if (response.data.result) {
            setPosts(
              Array.isArray(response.data.result)
                ? response.data.result
                : Array.isArray(response.data.result?.content)
                ? response.data.result.content
                : []
            );
            setTotalPages(response.data.result.totalPages || 1);
            setTotalElements(response.data.result.totalElements || 0);
          }
        }
      } catch (error) {
        setPosts([]);
        setTotalPages(1);
        setTotalElements(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [token, category, currentPage]);

  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-pink-50">
          <CardTitle className="text-gray-800 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            내가 작성한 게시글
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">게시글을 불러오는 중...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-pink-50">
          <CardTitle className="text-gray-800 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            내가 작성한 게시글 ({totalElements}개)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {posts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                작성한 게시글이 없습니다.
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.postId || post.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0"
                  onClick={() => {
                    if (category === "adoption") {
                      navigate(`/adoption-detail/${post.postId || post.id}`);
                    } else {
                      navigate(
                        `/detail/${category.toLowerCase()}/${
                          post.postId || post.postid || post.id
                        }`
                      );
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      {getCategoryKorean(post.category || category)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {post.date || post.createAt?.slice(0, 10)}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2 hover:text-orange-600 transition-colors">
                    {post.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>조회 {post.views ?? post.viewcount ?? 0}</span>
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {post.likes ?? post.likeCount ?? 0}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {post.comments ?? post.commentCount ?? 0}
                    </span>
                  </div>
                </div>
              ))
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
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
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
                        onClick={() => setCurrentPage(() => page)}
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
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                  }
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

export default PostsList;
