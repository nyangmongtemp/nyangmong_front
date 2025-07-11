import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axiosInstance from "../../configs/axios-config";

const ChildDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get(`/board-service/board/introduction/detail/${id}`)
      .then((res) => {
        let data = res.data.result || res.data.data || res.data;
        if (Array.isArray(data)) data = data[0];
        setPost(data);
      })
      .catch(() => {
        setError("상세 정보를 불러오지 못했습니다.");
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="p-8 text-center text-gray-500">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!post) return null;

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
              </CardHeader>
              <CardContent>
                {post.thumbnailimage && (
                  <div className="mb-6 flex justify-center">
                    <img
                      src={post.thumbnailimage}
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
