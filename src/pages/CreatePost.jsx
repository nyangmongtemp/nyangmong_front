import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, X, Image } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ImageCropModal from "@/components/ImageCropModal";
import axiosInstance from "../../configs/axios-config";
import { useAuth } from "../context/UserContext";
import { API_BASE_URL, BOARD } from "../../configs/host-config";
import CKEditorWrapper from "@/components/CKEditorWrapper";

const CreatePost = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImageSrc, setOriginalImageSrc] = useState(null);
  const [originalFileName, setOriginalFileName] = useState(null); // 원본 파일명 저장
  const [showCropModal, setShowCropModal] = useState(false);
  //const isEdit = location.pathname.startsWith("/update-post");
  let isEdit;
  if (id) {
    isEdit = true;
  } else {
    isEdit = false;
  }
  // 게시판 제목 매핑
  const boardTitles = {
    free: "자유게시판",
    question: "질문게시판",
    review: "후기게시판",
    notice: "공지사항",
  };

  // 동적 페이지 타이틀
  const pageTitle = isEdit
    ? `${boardTitles[type] || "게시판"} 게시물 수정`
    : `${boardTitles[type] || "게시판"} 글쓰기`;

  const buttonText = isEdit ? "수정 완료" : "작성 완료";

  const { isLoggedIn, token, nickname, profileImage } = useAuth();

  useEffect(() => {
    if (isEdit && id) {
      axiosInstance
        .get(`${API_BASE_URL}${BOARD}/detail/${type}/${id}`)
        .then((res) => {
          let data = res.data.result || res.data.data || res.data;
          if (Array.isArray(data)) data = data[0];
          setTitle(data.title);
          setContent(data.content);
          // 이미지 등도 필요시 세팅
          if (data.thumbnailImage || data.thumbnailimage) {
            setImagePreview(data.thumbnailImage || data.thumbnailimage);
            // 실제 파일 객체는 없으므로, 수정 시 새 파일 업로드 필요
          }
        });
    }
  }, [isEdit, type, id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 이미지 파일 형식 검증
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/bmp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("이미지 파일(JPG, PNG, BMP, GIF)만 업로드 가능합니다.");
        return;
      }

      // 원본 파일명과 확장자 저장
      setOriginalFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImageSrc(e.target.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl, croppedBlob) => {
    // 원본 파일명을 유지한 새로운 File 객체 생성
    let croppedFile;
    if (originalFileName) {
      // 원본 파일의 확장자 추출
      const fileExtension = originalFileName.split(".").pop().toLowerCase();

      // MIME 타입에 따른 확장자 매핑
      const mimeToExtension = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/bmp": "bmp",
        "image/gif": "gif",
      };

      // Blob의 MIME 타입에 맞는 확장자 사용
      const extension = mimeToExtension[croppedBlob.type] || fileExtension;

      // 원본 파일명에서 확장자만 변경
      const nameWithoutExtension = originalFileName.substring(
        0,
        originalFileName.lastIndexOf(".")
      );
      const newFileName = `${nameWithoutExtension}_cropped.${extension}`;

      // File 객체로 변환하여 파일명 유지
      croppedFile = new File([croppedBlob], newFileName, {
        type: croppedBlob.type,
      });
    } else {
      // 원본 파일명이 없는 경우 기본값 사용
      croppedFile = new File([croppedBlob], "cropped_image.jpg", {
        type: croppedBlob.type,
      });
    }

    setImagePreview(croppedImageUrl);
    setSelectedImage(croppedFile);
    setShowCropModal(false);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setOriginalImageSrc(null);
    setOriginalFileName(null); // 원본 파일명도 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    // 로그인 상태 확인 (임시로 주석 처리)
    // if (!isLoggedIn || !token) {
    //   alert("로그인이 필요합니다.");
    //   navigate("/login");
    //   return;
    // }

    // 카테고리 매핑 (소문자 → 대문자)
    const categoryMap = {
      free: "FREE",
      question: "QUESTION",
      review: "REVIEW",
    };

    // FormData 생성
    const formData = new FormData();
    formData.append(
      "context",
      new Blob(
        [
          JSON.stringify({
            category: categoryMap[type],
            title,
            content,
          }),
        ],
        { type: "application/json" }
      )
    );

    if (selectedImage) {
      formData.append("thumbnailImage", selectedImage);
    } else {
      // 이미지가 없으면 빈 Blob을 추가 (null 대신)
      formData.append("thumbnailImage", new Blob([]), "empty.jpg");
    }

    try {
      // 토큰 확인
      const storedToken = localStorage.getItem("token");
      console.log("저장된 토큰:", storedToken ? "있음" : "없음");
      console.log("useAuth 토큰:", token ? "있음" : "없음");
      console.log("로그인 상태:", isLoggedIn);
      console.log("실제 토큰 값:", token);

      console.log(id);
      console.log(type);
      console.log(isEdit);
      console.log(formData);

      // 게이트웨이를 통해 board-service로 요청
      console.log("게이트웨이를 통해 board-service로 요청");

      if (isEdit) {
        const response = await axiosInstance.put(
          `${API_BASE_URL}${BOARD}/${categoryMap[type]}/modify/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);

        alert("게시글이 수정되었습니다.");
        navigate(`/board/${type}`);
      } else {
        const response = await axiosInstance.post(
          `${API_BASE_URL}${BOARD}/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("게시글 생성 응답:", response.data);
        alert("게시글이 등록되었습니다.");
        navigate(`/board/${type}`);
      }
    } catch (err) {
      console.error("게시글 생성 에러:", err);
      alert(
        isEdit ? "게시글 수정에 실패했습니다." : "게시글 등록에 실패했습니다."
      );
    }
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
              <h1 className="text-lg font-semibold text-gray-800">
                {pageTitle}
              </h1>
            </div>

            <Card className="border-orange-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-pink-100 border-b border-orange-200">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {isEdit
                    ? `${boardTitles[type] || "게시판"} 게시물 수정`
                    : `${boardTitles[type] || "게시판"} 글쓰기`}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 제목 입력 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium text-gray-700"
                    >
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

                  {/* 내용 입력 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="content"
                      className="text-sm font-medium text-gray-700"
                    >
                      내용 <span className="text-red-500">*</span>
                    </Label>
                    <CKEditorWrapper
                      value={content}
                      onChange={(data) => setContent(data)}
                      boardType={
                        type === "free"
                          ? "free"
                          : type === "question"
                          ? "question"
                          : "review"
                      }
                      placeholder="게시물 내용을 입력해주세요"
                      minHeight={400}
                      maxHeight={400}
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
                      {buttonText}
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

      {/* 이미지 크롭 모달 */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        imageSrc={originalImageSrc}
        onCropComplete={handleCropComplete}
      />

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
