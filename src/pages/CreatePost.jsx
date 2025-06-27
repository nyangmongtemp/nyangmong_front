
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, X } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const CreatePost = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 게시판 제목 매핑
  const boardTitles = {
    free: '자유게시판',
    question: '질문게시판',
    review: '후기게시판',
    notice: '공지사항'
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    
    // TODO: 실제 게시글 생성 로직
    console.log("게시글 생성:", { title, content, image: selectedImage });
    navigate(`/board/${type}`);
  };

  const handleCancel = () => {
    navigate(`/board/${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 영역 */}
          <div className="lg:col-span-3">
            {/* 뒤로가기 버튼 */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate(`/board/${type}`)}
                className="p-2 hover:bg-orange-50"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-800">뒤로 가기</h1>
            </div>

            <Card className="border-orange-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-pink-100 border-b border-orange-200">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {boardTitles[type] || '게시판'} 글쓰기
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 제목 입력 */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                      제목 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="제목을 입력하세요"
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      required
                    />
                  </div>

                  {/* 이미지 업로드 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      이미지 첨부 (선택)
                    </Label>
                    <div className="space-y-4">
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="h-8 w-8 text-orange-400" />
                            <div className="text-sm text-gray-600">
                              <label htmlFor="image-upload" className="font-medium text-orange-600 hover:text-orange-500 cursor-pointer">
                                클릭하여 이미지 업로드
                              </label>
                              <p className="text-gray-500">PNG, JPG, JPEG (최대 10MB)</p>
                            </div>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="미리보기"
                            className="w-full max-w-md h-48 object-cover rounded-lg border border-orange-200"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 내용 입력 */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                      내용 <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="내용을 입력하세요"
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 min-h-[300px] resize-none"
                      required
                    />
                  </div>

                  {/* 버튼 영역 */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white"
                    >
                      게시글 작성
                    </Button>
                  </div>
                </form>
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

export default CreatePost;
