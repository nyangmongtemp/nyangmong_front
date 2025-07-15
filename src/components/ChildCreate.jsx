import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, BOARD } from "../../configs/host-config";
import CKEditorWrapper from "@/components/CKEditorWrapper";

const ChildCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // 동적 페이지 타이틀
  const pageTitle = isEdit
    ? "우리 아이 소개 게시판 수정"
    : "우리 아이 소개 게시판 글쓰기";
  const buttonText = isEdit ? "수정 완료" : "작성 완료";

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isEdit) {
      axiosInstance
        .get(`${API_BASE_URL}${BOARD}/detail/introduction/${id}`)
        .then((res) => {
          let data = res.data.result || res.data.data || res.data;
          if (Array.isArray(data)) data = data[0];
          setFormData({
            title: data.title,
            description: data.content,
          });
          if (data.thumbnailImage || data.thumbnailimage) {
            setThumbnail({
              id: Date.now(),
              url: data.thumbnailImage || data.thumbnailimage,
              file: null, // 실제 파일은 없으므로 수정 시 새 파일 업로드 필요
            });
          }
        });
    }
  }, [isEdit, id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnail) {
      alert("썸네일 이미지를 업로드해주세요.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append(
      "context",
      new Blob(
        [
          JSON.stringify({
            title: formData.title,
            content: formData.description,
          }),
        ],
        { type: "application/json" }
      )
    );
    formDataToSend.append("thumbnailImage", thumbnail.file);

    try {
      if (isEdit) {
        await axiosInstance.put(
          `${API_BASE_URL}${BOARD}/introduction/modify/${id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("게시글이 수정되었습니다.");
        // 강제 새로고침을 위해 replace: false로 설정하고 페이지 새로고침
        navigate("/child/list?page=1", { replace: false });
        // 페이지 새로고침으로 최신 데이터 확보
        window.location.reload();
      } else {
        await axiosInstance.post(
          `${API_BASE_URL}${BOARD}/introduction/create`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("게시글이 등록되었습니다.");
        // 강제 새로고침을 위해 replace: false로 설정하고 페이지 새로고침
        navigate("/child/list?page=1", { replace: false });
        // 페이지 새로고침으로 최신 데이터 확보
        window.location.reload();
      }
    } catch (err) {
      alert(
        isEdit ? "게시글 수정에 실패했습니다." : "게시글 등록에 실패했습니다."
      );
    }
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
                {pageTitle}
              </div>
            </div>
          </div>
          {/* 폼 본문 */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="제목을 입력하세요"
                className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                썸네일 이미지 업로드 <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-4 text-orange-400" />
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
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                상세 내용 <span className="text-red-500">*</span>
              </Label>
              <CKEditorWrapper
                value={formData.description}
                onChange={(data) => handleInputChange("description", data)}
                boardType="introduction"
                placeholder="반려동물에 대한 상세한 설명을 입력하세요..."
                minHeight={400}
                maxHeight={400}
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
                {buttonText}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChildCreate;
