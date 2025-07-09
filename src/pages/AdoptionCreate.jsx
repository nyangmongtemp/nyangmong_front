import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useAuth } from "@/context/UserContext";
import { adoptionAPI } from "../../configs/api-utils.js";

const AdoptionCreate = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  // 로그인 체크
  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    petCategory: "",
    sex: "",
    age: "",
    address: "",
    neutered: "",
    vaccinated: "",
    contact: "",
    email: "",
    price: "무료분양",
    imageUrl: ""
  });

  const categories = ["강아지", "고양이", "기타"];
  const genderOptions = ["수컷", "암컷", "미상"];
  const neuteredOptions = ["예", "아니오", "모름"];
  const vaccinatedOptions = ["예", "아니오", "모름"];
  const regions = [
    { value: "서울", label: "서울" },
    { value: "경기", label: "경기" },
    { value: "강원도", label: "강원도" },
    { value: "강원특별자치도", label: "강원특별자치도" },
    { value: "충청북도", label: "충청북도" },
    { value: "충청남도", label: "충청남도" },
    { value: "대전", label: "대전" },
    { value: "세종", label: "세종" },
    { value: "전라북도", label: "전라북도" },
    { value: "전라남도", label: "전라남도" },
    { value: "전북특별자치도", label: "전북특별자치도" },
    { value: "광주", label: "광주" },
    { value: "경상북도", label: "경상북도" },
    { value: "경상남도", label: "경상남도" },
    { value: "부산", label: "부산" },
    { value: "대구", label: "대구" },
    { value: "울산", label: "울산" },
    { value: "제주", label: "제주" },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    // 필수 필드 검증
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (!formData.petCategory) {
      alert("반려동물 종류를 선택해주세요.");
      return;
    }
    if (!formData.address) {
      alert("지역을 선택해주세요.");
      return;
    }

    setLoading(true);
    
    try {
      const response = await adoptionAPI.createAdoptionPost(formData);
      console.log('분양글 등록 성공:', response);
      alert("분양글이 성공적으로 등록되었습니다.");
      navigate("/adoption");
    } catch (error) {
      console.error('분양글 등록 실패:', error);
      alert("분양글 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 로그인하지 않은 경우 로딩 화면 표시
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mr-2" />
            <span className="text-gray-600">로그인 페이지로 이동 중...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* 뒤로가기 버튼 */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate("/adoption")}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                목록으로 돌아가기
              </Button>
            </div>

            {/* 분양글 등록 폼 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  분양글 등록
                </CardTitle>
                <p className="text-gray-600">
                  새로운 가족을 기다리는 반려동물을 등록해주세요.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 제목 */}
                  <div className="space-y-2">
                    <Label htmlFor="title">제목 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="분양글 제목을 입력하세요"
                      required
                    />
                  </div>

                  {/* 반려동물 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="petCategory">반려동물 종류 *</Label>
                      <Select
                        value={formData.petCategory}
                        onValueChange={(value) => handleInputChange("petCategory", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="종류를 선택하세요" />
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

                    <div className="space-y-2">
                      <Label htmlFor="sex">성별</Label>
                      <Select
                        value={formData.sex}
                        onValueChange={(value) => handleInputChange("sex", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="성별을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">나이</Label>
                      <Input
                        id="age"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        placeholder="예: 2살, 6개월"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">지역 *</Label>
                      <Select
                        value={formData.address}
                        onValueChange={(value) => handleInputChange("address", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="지역을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region.value} value={region.value}>
                              {region.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="neutered">중성화</Label>
                      <Select
                        value={formData.neutered}
                        onValueChange={(value) => handleInputChange("neutered", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="중성화 여부를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {neuteredOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vaccinated">예방접종</Label>
                      <Select
                        value={formData.vaccinated}
                        onValueChange={(value) => handleInputChange("vaccinated", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="예방접종 여부를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {vaccinatedOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 연락처 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact">연락처</Label>
                      <Input
                        id="contact"
                        value={formData.contact}
                        onChange={(e) => handleInputChange("contact", e.target.value)}
                        placeholder="전화번호를 입력하세요"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="이메일을 입력하세요"
                      />
                    </div>
                  </div>

                  {/* 이미지 URL */}
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">이미지 URL</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                      placeholder="반려동물 이미지 URL을 입력하세요"
                    />
                  </div>

                  {/* 상세 내용 */}
                  <div className="space-y-2">
                    <Label htmlFor="content">상세 내용 *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      placeholder="반려동물에 대한 상세한 설명을 입력하세요"
                      rows={8}
                      required
                    />
                  </div>

                  {/* 제출 버튼 */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/adoption")}
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          등록 중...
                        </>
                      ) : (
                        "분양글 등록"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

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