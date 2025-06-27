import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChildCreate = () => {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [thumbnail, setThumbnail] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (thumbnail) {
      alert("이미지는 1개만 업로드할 수 있습니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setThumbnail({
        id: Date.now(),
        url: reader.result,
        file,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setThumbnail(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!thumbnail) {
      alert("썸네일 이미지를 업로드해주세요.");
      return;
    }

    console.log("제출 내용:", formData, thumbnail);
    navigate("/posts"); // 실제 경로에 맞게 수정
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* 헤더 영역 */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate("/child/list")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>목록으로</span>
              </Button>
              <div className="text-lg font-semibold text-gray-800">
                게시물 작성
              </div>
            </div>
          </div>

          {/* 폼 본문 */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                제목 *
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="제목을 입력하세요"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                썸네일 이미지 업로드 *
              </Label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        클릭하거나 드래그하여 이미지 업로드
                      </p>
                      <p className="text-xs text-gray-400">
                        썸네일 이미지는 1개만 가능
                      </p>
                    </div>
                    <input
                      id="thumbnail-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                <div>
                  {thumbnail ? (
                    <div className="relative">
                      <img
                        src={thumbnail.url}
                        alt="썸네일 미리보기"
                        className="w-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-400">
                        업로드된 이미지가 없습니다
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                상세 내용 *
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="내용을 입력하세요..."
                className="min-h-48 resize-none"
                required
              />
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/posts")}
              >
                작성 취소
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
              >
                작성 완료
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChildCreate;
