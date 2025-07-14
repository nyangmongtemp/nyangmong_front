import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MapPin,
  Calendar,
  Eye,
  MessageCircle,
  ArrowLeft,
  User,
  Edit,
  Send,
} from "lucide-react";
import { adoptionAPI } from "../../configs/api-utils.js";
import { useAuth } from "@/context/UserContext";
import AlertDialog from "@/components/ui/alert-dialog";
import CommentSection from "@/components/CommentSection";
import { toast } from "@/components/ui/sonner";
import { API_BASE_URL, USER } from "../../configs/host-config.js";
import axiosInstance from "../../configs/axios-config.js";

const AdoptionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { email, isLoggedIn } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nowLoggedUserId, setNowLoggedUserId] = useState(null);

  // Alert 다이얼로그 상태
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const reservationOptions = [
    { label: "예약가능", value: "A" },
    { label: "예약중", value: "R" },
    { label: "분양완료", value: "C" },
  ];

  // 유저 ID 비동기 조회 함수 추가
  const getNowLoggedUserId = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}${USER}/findId`);
      console.log(response);

      setNowLoggedUserId(response.data);
      return response.data;
    } catch (err) {
      console.error("유저 ID 조회 실패:", err);
      setNowLoggedUserId(null);
      return null;
    }
  };

  console.log("AdoptionDetail 컴포넌트 로드됨, id:", id);

  useEffect(() => {
    const fetchAdoptionDetail = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await adoptionAPI.getAdoptionDetail(id);
        console.log("분양 상세 API 응답:", response);
        console.log("응답 타입:", typeof response);
        console.log("응답 키들:", Object.keys(response || {}));
        setPost(response);
        getNowLoggedUserId();
        console.log("post 상태 설정 완료:", response);
      } catch (err) {
        console.error("분양 상세 조회 실패:", err);
        setError("분양글을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptionDetail();
  }, [id]);

  // Alert 다이얼로그 표시 함수
  const showAlert = (title, message, type = "info") => {
    setAlertDialog({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  // Alert 다이얼로그 닫기 함수
  const closeAlert = () => {
    setAlertDialog((prev) => ({ ...prev, isOpen: false }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">분양글을 불러오는 중...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button
                onClick={() => navigate("/adoption")}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                목록으로 돌아가기
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-500 mb-4">분양글을 찾을 수 없습니다.</p>
              <Button onClick={() => navigate("/adoption")} variant="outline">
                목록으로 돌아가기
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const images =
    post.images || [post.thumbnailImage || post.image].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* 상단 네비게이션 */}
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
                    <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
                      <span>분양게시판</span>
                      <span>{">"}</span>
                      <span>{post.title}</span>
                    </div>
                  </div>
                  {isLoggedIn && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // 좋아요 기능 구현
                        console.log("좋아요 클릭");
                      }}
                      className="flex items-center space-x-2"
                    >
                      <Heart className="h-4 w-4" />
                      <span>좋아요</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* 게시글 내용 */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      {post.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>작성자: {post.nickName}</span>
                      <span>
                        작성일:{" "}
                        {new Date(post.createAt).toLocaleDateString("ko-KR")}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>{post.viewCount || post.views}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-pink-400" />
                        <span>{post.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge className="bg-orange-500">
                      {post.fee === 0
                        ? "무료분양"
                        : `${post.fee.toLocaleString()}원`}
                    </Badge>
                    {/* 예약상태 셀렉트박스 - 내가 쓴 글일 때만 노출 */}
                    {isLoggedIn && post && nowLoggedUserId === post.userId && (
                      <div className="mt-2">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={post.reservationStatus || "A"}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              const token = localStorage.getItem("token");
                              await adoptionAPI.updateReservationStatus(
                                id,
                                newStatus,
                                token
                              );
                              toast.success("예약상태 변경 성공!");
                              setPost({
                                ...post,
                                reservationStatus: newStatus,
                              });
                            } catch (err) {
                              toast.error("예약상태 변경 실패!");
                            }
                          }}
                        >
                          {reservationOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* 이미지 갤러리 */}
                {images.length > 0 && (
                  <div className="mb-6">
                    <div className="relative">
                      <img
                        src={images[currentImageIndex]}
                        alt={post.title}
                        className="w-full h-96 object-cover rounded-lg"
                        onError={(e) => {
                          console.log(
                            "이미지 로드 실패:",
                            images[currentImageIndex]
                          );
                          e.target.src =
                            "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                      {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full ${
                                index === currentImageIndex
                                  ? "bg-white"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {images.length > 1 && (
                      <div className="flex space-x-2 mt-4">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                              index === currentImageIndex
                                ? "border-orange-500"
                                : "border-gray-200"
                            }`}
                          >
                            <img
                              src={image}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 펫 정보 */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">펫 정보</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">품종</span>
                        <p className="font-medium">
                          {post.breed || post.petKind}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">나이</span>
                        <p className="font-medium">{post.age}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">성별</span>
                        <p className="font-medium">
                          {post.gender ||
                            (post.sexCode === "M"
                              ? "수컷"
                              : post.sexCode === "F"
                              ? "암컷"
                              : "미상")}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">지역</span>
                        <p className="font-medium">
                          {post.location || post.address}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">예방접종</span>
                        <p className="font-medium">
                          {post.vaccination || post.vaccine}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">중성화</span>
                        <p className="font-medium">
                          {post.neutering ||
                            (post.neuterYn === "Y"
                              ? "완료"
                              : post.neuterYn === "N"
                              ? "미완료"
                              : "미상")}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">책임비</span>
                        <p className="font-medium text-orange-600">
                          {post.fee === 0
                            ? "무료분양"
                            : `${post.fee.toLocaleString()}원`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 상세 설명 */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4">상세 설명</h3>
                  <div
                    className="prose max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>

                {/* 연락처 정보 */}
                {post.phone && (
                  <div className="mb-8 p-4 bg-orange-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      연락처
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700">{post.phone}</span>
                      <a
                        href={`tel:${post.phone}`}
                        className="ml-2 px-3 py-1 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
                      >
                        전화하기
                      </a>
                    </div>
                  </div>
                )}

                {/* 게시물 수정 버튼 - 로그인한 사용자이면서 작성자인 경우에만 표시 */}
                {isLoggedIn && post && nowLoggedUserId === post.userId && (
                  <div className="mb-8 text-center flex justify-center gap-2">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => navigate(`/adoption/update/${id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      게시물 수정
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        if (
                          !window.confirm(
                            "정말로 이 게시글을 삭제하시겠습니까?"
                          )
                        )
                          return;
                        try {
                          const token = localStorage.getItem("token");
                          await adoptionAPI.deleteAdoptionPost(id, token);
                          alert("게시글이 성공적으로 삭제되었습니다.");
                          navigate("/adoption");
                        } catch (err) {
                          alert("게시글 삭제에 실패했습니다.");
                        }
                      }}
                    >
                      삭제
                    </Button>
                  </div>
                )}

                {/* 댓글 섹션 */}
                <CommentSection
                  postId={id}
                  userId={post.userId}
                  category="adopt"
                  showReplies={true}
                  className="border-t pt-8"
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      {/* Alert 다이얼로그 */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={closeAlert}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
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

export default AdoptionDetail;
