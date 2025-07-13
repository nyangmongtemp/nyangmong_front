import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axiosInstance from "../../configs/axios-config";
import { useAuth } from "@/context/UserContext";
import { API_BASE_URL, BOARD } from "../../configs/host-config";

const ChildDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { nickname: userNickname } = useAuth();

  const IMAGE_BASE_URL = "http://localhost:8000/path/to/image/dir/"; // 실제 이미지 경로로 수정

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get(`${API_BASE_URL}${BOARD}/detail/introduction/${id}`)
      .then((res) => {
        let data = res.data.result || res.data.data || res.data;
        if (Array.isArray(data)) data = data[0];
        setPost({
          id: data.postid || data.postId,
          userId: data.userid || data.userId,
          title: data.title,
          content: data.content,
          nickname: data.nickname,
          createdAt: data.createdAt || data.createAt,
          updatedAt: data.updatedAt || data.updateAt,
          viewCount: data.viewCount,
          // 이미지 파일명만 내려올 경우 실제 URL로 변환
          thumbnailImage:
            data.thumbnailImage || data.thumbnailimage
              ? (data.thumbnailImage || data.thumbnailimage).startsWith("http")
                ? data.thumbnailImage || data.thumbnailimage
                : IMAGE_BASE_URL + (data.thumbnailImage || data.thumbnailimage)
              : null,
        });
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError("해당 게시글을 찾을 수 없습니다.");
        } else {
          setError("상세 정보를 불러오지 못했습니다.");
        }
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="p-8 text-center text-gray-500">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!post) return null;

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axiosInstance.delete(
        `${API_BASE_URL}${BOARD}/introduction/delete/${post.id || post.postId}`
      );
      alert("게시글이 삭제되었습니다.");
      navigate("/child/list");
    } catch (err) {
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  // 썸네일 이미지 필드명 대응
  const thumbnail = post.thumbnailImage || post.thumbnailimage;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <Card className="border-blue-200 shadow-sm">
              <CardHeader className="pb-4 flex flex-row items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                  ← 목록으로
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">
                  우리 아이 소개 상세
                </h1>
                {/* 작성자만 수정/삭제 버튼 노출 */}
                {post.nickname &&
                  userNickname &&
                  post.nickname === userNickname && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate(`/child/edit/${post.id || post.postId}`)
                        }
                      >
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDelete}
                        style={{ marginLeft: 8 }}
                      >
                        삭제
                      </Button>
                    </>
                  )}
              </CardHeader>
              <CardContent>
                {thumbnail && (
                  <div className="mb-6 flex justify-center">
                    <img
                      src={thumbnail}
                      alt={post.title}
                      className="max-h-80 rounded-lg object-contain"
                    />
                  </div>
                )}
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <div className="text-gray-700 mb-4 whitespace-pre-line">
                  {post.content}
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>작성자: {post.nickname}</span>
                  <span>작성일: {post.createAt}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>조회수: {post.viewCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-80">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildDetail;
