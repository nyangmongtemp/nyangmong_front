import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Loader2, Image, X } from "lucide-react";
import { useAuth } from "@/context/UserContext";
import { adoptionAPI } from "../../configs/api-utils.js";
import ImageCropModal from "@/components/ImageCropModal";
import CKEditorWrapper from "@/components/CKEditorWrapper";

// 기존 이미지 URL을 File로 변환하는 함수
async function urlToFile(url, filename, mimeType) {
  // 확장자 추출
  const ext = filename.split(".").pop().toLowerCase();
  let type = mimeType;
  if (!type || type === "") {
    if (ext === "jpg" || ext === "jpeg") type = "image/jpeg";
    else if (ext === "png") type = "image/png";
    else if (ext === "gif") type = "image/gif";
    else if (ext === "bmp") type = "image/bmp";
    else type = "application/octet-stream";
  }
  // fetch로 blob 받아오기
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("이미지 파일을 불러올 수 없습니다. (fetch 실패)");
  }
  const blob = await res.blob();
  // blob.type이 image/로 시작하지 않으면 강제로 type 지정
  if (!blob.type.startsWith("image/")) {
    return new File([blob], filename, { type });
  }
  // blob.type이 이미지면 그대로 사용
  return new File([blob], filename, { type: blob.type });
}

const AdoptionCreate = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImageSrc, setOriginalImageSrc] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImageType, setOriginalImageType] = useState("image/jpeg");
  const [originalImageName, setOriginalImageName] = useState("thumbnail.jpg");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // 로그인 체크
  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다. 로그인 후 이용해주세요.");
      navigate("/adoption", { state: { tab: "adoption" } });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (isEdit && id) {
      setFetchLoading(true);
      setFetchError(null);

      //console.log("편집 모드 - ID:", id);

      adoptionAPI
        .getAdoptionDetail(id)
        .then((response) => {
          //console.log("API 응답:", response);

          // 응답 구조 확인 및 데이터 추출
          let data = response;
          if (response.data) data = response.data;
          if (response.result) data = response.result;

          //console.log("추출된 데이터:", data);

          // 필드 매핑 및 기본값 설정
          const mappedData = {
            title: data.title || data.title || "",
            content: data.content || data.content || "",
            petCategory: data.petCategory || data.petCategory || "",
            petKind: data.petKind || data.petKind || "",
            sex: data.sexCode || data.sex || data.sexCode || "",
            age: data.age || data.age || "",
            address: data.address || data.address || "",
            neutered: data.neuterYn || data.neutered || data.neuterYn || "",
            vaccinated: data.vaccine || data.vaccinated || data.vaccine || "",
            fee: data.fee || data.fee || "",
            imageUrl:
              data.imageUrl || data.thumbnailImage || data.imageUrl || "",
          };

          //console.log("매핑된 데이터:", mappedData);

          setFormData(mappedData);

          if (data.thumbnailImage || data.imageUrl) {
            setImagePreview(data.thumbnailImage || data.imageUrl);
            setSelectedImage(null); // 기존 이미지는 Blob이 아님
          }

          setFetchError(null);
        })
        .catch((error) => {
          //console.error("게시글 정보 불러오기 실패:", error);
          setFetchError(
            `게시글 정보를 불러오지 못했습니다: ${
              error.message || "알 수 없는 오류"
            }`
          );
        })
        .finally(() => setFetchLoading(false));
    }
  }, [id]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    petCategory: "",
    petKind: "",
    sex: "",
    age: "",
    address: "",
    neutered: "",
    vaccinated: "",
    fee: "",
    imageUrl: "",
  });

  const categories = ["강아지", "고양이", "기타"];
  // 성별, 중성화 옵션을 코드와 라벨로 구성
  const genderOptions = [
    { label: "수컷", value: "M" },
    { label: "암컷", value: "F" },
    { label: "미상", value: "Q" },
  ];
  const neuteredOptions = [
    { label: "예", value: "Y" },
    { label: "아니오", value: "N" },
    { label: "모름", value: "U" },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalImageType(file.type || "image/jpeg");
      setOriginalImageName(file.name || "thumbnail.jpg"); // 파일명 기억
      // 1. MIME 타입 체크
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/bmp",
        "image/gif",
      ];
      // 2. 확장자 체크
      const allowedExts = ["jpg", "jpeg", "png", "bmp", "gif"];
      const fileExt = file.name.split(".").pop().toLowerCase();

      if (
        (!allowedTypes.includes(file.type) && !allowedExts.includes(fileExt)) ||
        fileExt === ""
      ) {
        alert("이미지 파일(JPG, PNG, BMP, GIF)만 업로드 가능합니다.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImageSrc(e.target.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl, croppedBlob) => {
    // 원본 파일명과 타입을 사용해 File로 변환
    const ext = originalImageType.split("/")[1] || "jpg";
    let fileName = originalImageName;
    // 확장자가 없으면 붙여줌
    if (fileName && !fileName.toLowerCase().endsWith("." + ext)) {
      fileName = fileName.replace(/\.[^/.]+$/, "") + "." + ext;
    }
    const file = new File([croppedBlob], fileName, { type: originalImageType });
    setImagePreview(croppedImageUrl);
    setSelectedImage(file);
    setShowCropModal(false);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setOriginalImageSrc(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다. 로그인 후 이용해주세요.");
      navigate("/adoption", { state: { tab: "adoption" } });
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
    // 추가 필수값 검증 (백엔드 요구사항에 따라)
    if (!formData.petKind) {
      alert("품종을 입력해주세요.");
      return;
    }
    if (!formData.sex) {
      alert("성별을 선택해주세요.");
      return;
    }
    if (!formData.neutered) {
      alert("중성화 여부를 선택해주세요.");
      return;
    }

    // 이미지 파일 준비
    let imageFile = selectedImage;
    if (!imageFile && imagePreview && isEdit) {
      // 기존 이미지 URL을 File로 변환 (확장자/type 강제 매칭 적용)
      imageFile = await urlToFile(
        imagePreview,
        originalImageName,
        originalImageType
      );
    }
    if (!imageFile) {
      alert("이미지는 필수입니다.");
      return;
    }

    // animalRequest 객체 생성
    const animalRequest = {
      title: formData.title,
      content: formData.content,
      petCategory: formData.petCategory,
      petKind: formData.petKind,
      age: formData.age,
      vaccine: formData.vaccinated,
      sexCode: formData.sex,
      neuterYn: formData.neutered,
      address: formData.address,
      fee: formData.fee,
    };

    // FormData 구성
    const form = new FormData();
    form.append(
      "animalRequest",
      new Blob([JSON.stringify(animalRequest)], { type: "application/json" })
    );
    form.append("thumbnailImage", imageFile, imageFile.name);

    setLoading(true);
    const token = localStorage.getItem("token");

    if (isEdit) {
      try {
        const response = await adoptionAPI.updateAdoptionPost(id, form, token);
        alert("분양글이 성공적으로 수정되었습니다.");
        navigate("/adoption", { state: { tab: "adoption" } });
      } catch (error) {
        //console.error("분양글 수정 실패:", error);
        if (error.response) {
          alert(
            `에러: ${error.response.status} - ${
              error.response.data?.message || "수정 실패"
            }`
          );
        } else if (error.message) {
          alert(`에러: ${error.message}`);
        } else {
          alert("분양글 수정에 실패했습니다. 다시 시도해주세요.");
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const response = await adoptionAPI.createAdoptionPost(form, token);
      alert("분양글이 성공적으로 등록되었습니다.");
      navigate("/adoption", { state: { tab: "adoption" } });
    } catch (error) {
      //console.error("분양글 등록 실패:", error);
      if (error.response) {
        // axios 에러 응답
        alert(
          `에러: ${error.response.status} - ${
            error.response.data?.message || "등록 실패"
          }`
        );
      } else if (error.message) {
        alert(`에러: ${error.message}`);
      } else {
        alert("분양글 등록에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mr-2" />
            <span className="text-gray-600">게시글 정보를 불러오는 중...</span>
          </div>
        </main>
      </div>
    );
  }
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 text-lg font-medium mb-4">
              게시글 정보를 불러올 수 없습니다
            </div>
            <div className="text-gray-600 text-center mb-6">{fetchError}</div>
            <Button
              onClick={() =>
                navigate("/adoption", { state: { tab: "adoption" } })
              }
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              목록으로 돌아가기
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // 로그인하지 않은 경우 로딩 화면 표시
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mr-2" />
            <span className="text-gray-600">목록으로 이동 중...</span>
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
                onClick={() =>
                  navigate("/adoption", { state: { tab: "adoption" } })
                }
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
                  {isEdit ? "분양글 수정" : "분양글 등록"}
                </CardTitle>
                <p className="text-gray-600">
                  {isEdit
                    ? "기존 정보를 수정할 수 있습니다."
                    : "새로운 가족을 기다리는 반려동물을 등록해주세요."}
                </p>

                {/* 편집 모드일 때만 표시되는 상태 정보 */}
                {isEdit && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center text-blue-800 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      편집 모드: ID {id}번 게시글을 수정 중입니다.
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 제목 */}
                  <div className="space-y-2">
                    <Label htmlFor="title">제목 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
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
                        onValueChange={(value) =>
                          handleInputChange("petCategory", value)
                        }
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
                      <Label htmlFor="petKind">품종 *</Label>
                      <Input
                        id="petKind"
                        value={formData.petKind}
                        onChange={(e) =>
                          handleInputChange("petKind", e.target.value)
                        }
                        placeholder="예: 믹스견"
                      />
                    </div>

                    {/* 성별 셀렉트박스 부분 */}
                    <div className="space-y-2">
                      <Label htmlFor="sex">성별 *</Label>
                      <Select
                        value={formData.sex}
                        onValueChange={(value) =>
                          handleInputChange("sex", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="성별을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map((gender) => (
                            <SelectItem key={gender.value} value={gender.value}>
                              {gender.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">나이 *</Label>
                      <Input
                        id="age"
                        value={formData.age}
                        onChange={(e) =>
                          handleInputChange("age", e.target.value)
                        }
                        placeholder="예: 2살, 6개월"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="petKind">책임비</Label>
                      <Input
                        id="fee"
                        value={formData.fee}
                        onChange={(e) =>
                          handleInputChange("fee", e.target.value)
                        }
                        placeholder="예: 20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">지역 *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="지역을 입력하세요 (예: 서울 강남구)"
                        required
                      />
                    </div>

                    {/* 중성화 셀렉트박스 부분 */}
                    <div className="space-y-2">
                      <Label htmlFor="neutered">중성화 *</Label>
                      <Select
                        value={formData.neutered}
                        onValueChange={(value) =>
                          handleInputChange("neutered", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="중성화 여부를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {neuteredOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vaccinated">예방접종</Label>
                      <Input
                        id="vaccinated"
                        value={formData.vaccinated}
                        onChange={(e) =>
                          handleInputChange("vaccinated", e.target.value)
                        }
                        placeholder="예방접종 상태여부를 입력하세요."
                      />
                    </div>
                  </div>

                  {/* 이미지 업로드 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      이미지 첨부 *
                    </Label>
                    <div className="space-y-4">
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                          <div className="flex flex-col items-center space-y-4">
                            <Image className="h-12 w-12 text-orange-400" />
                            <div className="text-sm text-gray-600">
                              <Button
                                type="button"
                                variant="outline"
                                className="border-orange-300 text-orange-600 hover:bg-orange-50 relative"
                                onClick={() =>
                                  document
                                    .getElementById("image-upload")
                                    .click()
                                }
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                이미지 업로드
                              </Button>
                              <p className="text-gray-500 mt-2">
                                JPG, PNG, BMP, GIF (이미지 파일만 가능)
                              </p>
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

                  {/* 상세 내용 */}
                  <div className="space-y-2">
                    <Label htmlFor="content">상세 내용 *</Label>
                    <div className="border border-gray-300 rounded-md">
                      <CKEditorWrapper
                        value={formData.content}
                        onChange={(data) => handleInputChange("content", data)}
                        boardType="animal"
                        placeholder="반려동물에 대한 상세한 설명을 입력하세요..."
                        minHeight={400}
                        maxHeight={400}
                      />
                    </div>
                  </div>

                  {/* 제출 버튼 */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        navigate("/adoption", { state: { tab: "adoption" } })
                      }
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
                          {isEdit ? "수정 중..." : "등록 중..."}
                        </>
                      ) : isEdit ? (
                        "분양글 수정"
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

      {/* 이미지 크롭 모달 */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        imageSrc={originalImageSrc}
        onCropComplete={handleCropComplete}
        outputType={originalImageType}
      />

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
