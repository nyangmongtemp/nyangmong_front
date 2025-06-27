import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const file1 = [
  "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
];

const AdoptionCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    breed: "",
    age: "",
    books: "",
    gender: "",
    region: "",
    detailLocation: "",
    responsibilityFee: "",
    vaccination: "",
    neutering: "",
    healthStatus: "",
    temperament: "",
    description: "",
  });
  const [thumbnailImages, setThumbnailImages] = useState([]);

  const categories = ["강아지", "고양이", "기타"];
  const regions = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "경기",
    "강원",
    "충북",
    "충남",
    "전북",
    "전남",
    "경북",
    "경남",
    "제주",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (thumbnailImages.length + files.length > 1) {
      alert("최대 1개의 이미지만 업로드할 수 있습니다.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: e.target?.result,
            file,
          },
        ]);
      };
      reader.readAsDataURL(file); // ✅ 여기는 File 객체니까 문제 없음
    });
  };

  const removeImage = (id) => {
    setThumbnailImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (thumbnailImages.length === 0) {
      alert("썸네일 이미지를 최소 1개 업로드해야 합니다.");
      return;
    }
    console.log("Form submitted:", formData, thumbnailImages);
    navigate("/adoption");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* 헤더 영역 */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/adoption")}
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>목록으로</span>
                    </Button>
                    <div className="text-lg font-semibold text-gray-800">
                      분양 게시글 작성
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {/* 상단 입력 영역 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* 왼쪽: 작성자 정보 */}
                  <div className="space-y-4">
                    <div>
                      입양 가능 여부
                      <Select
                        value={formData.books}
                        onValueChange={(value) =>
                          handleInputChange("books", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="예약 여부" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">예약 가능</SelectItem>
                          <SelectItem value="Y">예약 완료</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        책임비 *
                      </Label>
                      <Input placeholder="책임비를 입력하세요" required />
                    </div>
                  </div>

                  {/* 가운데: 동물 정보 */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        동물 종류 *
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="동물 종류 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        품종
                      </Label>
                      <Input
                        value={formData.breed}
                        onChange={(e) =>
                          handleInputChange("breed", e.target.value)
                        }
                        placeholder="품종을 입력하세요"
                      />
                    </div>
                  </div>

                  {/* 오른쪽: 분양 정보 */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        분양 희망 지역
                      </Label>
                      <Select
                        value={formData.region}
                        onValueChange={(value) =>
                          handleInputChange("region", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="지역 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        나이/성별 정보
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={formData.age}
                          onChange={(e) =>
                            handleInputChange("age", e.target.value)
                          }
                          placeholder="나이"
                        />
                        <Select
                          value={formData.gender}
                          onValueChange={(value) =>
                            handleInputChange("gender", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="성별" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="수컷">수컷</SelectItem>
                            <SelectItem value="암컷">암컷</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 제목 입력 */}
                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-700">
                    제목 *
                  </Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="분양글 제목을 입력하세요"
                    className="text-lg"
                    required
                  />
                </div>

                {/* 이미지 업로드 영역 */}
                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    사진 업로드 *
                  </Label>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 왼쪽: 업로드 영역 */}
                    <div>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="thumbnail-upload"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              사진을 업로드하세요
                            </p>
                            <p className="text-xs text-gray-400">
                              썸네일 이미지는 1개만 가능
                            </p>
                          </div>
                          <input
                            id="thumbnail-upload"
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>

                    {/* 오른쪽: 업로드된 이미지 미리보기 */}
                    <div>
                      {thumbnailImages.length > 0 ? (
                        <div className="grid">
                          {thumbnailImages.map((image) => (
                            <div key={image.id} className="relative">
                              <img
                                src={image.url}
                                alt="업로드된 이미지"
                                className="w-full object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
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

                {/* 상세 내용 작성 */}
                <div className="mb-8">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    상세 내용 *
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="아이에 대한 자세한 설명을 작성해주세요..."
                    className="min-h-48 resize-none"
                    required
                  />
                </div>

                {/* 버튼 영역 */}
                <div className="flex justify-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/adoption")}
                    className="px-8"
                  >
                    작성 취소
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 px-8"
                  >
                    작성 완료
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-16">
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

export default AdoptionCreate;
