import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, MessageCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProfileForm from "@/components/ProfileForm";
import PasswordChangeForm from "@/components/PasswordChangeForm";
import EmailChangeForm from "@/components/EmailChangeForm";
import PostsList from "@/components/PostsList";
import CommentsList from "@/components/CommentsList";
import TabNavigation from "@/components/TabNavigation";
import { useUserPageData } from "@/hooks/useUserPageData";
import { useAuth } from "../context/UserContext";
import axiosInstance from "../../configs/axios-config";
import {
  API_BASE_URL,
  USER,
  MAIN,
  BOARD,
  ABS,
} from "../../configs/host-config";

// 날짜 포맷 함수 추가
const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

const UserMyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [currentPage, setCurrentPage] = useState(1); // 1부터 시작하도록 변경 (CommentSection과 동일)
  const [selectedBoard, setSelectedBoard] = useState("질문");
  const itemsPerPage = 10;
  const { token, email, isLoggedIn, logout, isSocial } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const [formData, setFormData] = useState({
    profileImage: "",
    profileImageBlob: null,
    name: "",
    nickname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    joinDate: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_BASE_URL}${USER}/mypage`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);

        const data = response.data.result;

        setFormData({
          profileImage: data.profileImage || "",
          profileImageBlob: null,
          name: data.userName || "",
          email: data.email || email,
          phone: data.phone || "",
          nickname: data.nickname || "",
          password: "",
          confirmPassword: "",
          joinDate: data.createAt || "",
          address: data.address || "",
        });
      } catch (err) {
        console.log(err);
      }
    };
    if (token) fetchUserData();
  }, [token, email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImageChange = (croppedImageUrl, croppedBlob) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: croppedImageUrl,
      profileImageBlob: croppedBlob,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 닉네임, 전화번호, 주소를 JSON 문자열로 만들고 Blob으로 변환
      const userJson = JSON.stringify({
        nickname: formData.nickname,
      });
      const userBlob = new Blob([userJson], { type: "application/json" });

      const formDataToSend = new FormData();
      formDataToSend.append("user", userBlob);

      if (formData.profileImageBlob) {
        // 원본 파일명을 유지하면서 Blob을 File 객체로 변환
        const originalName = formData.profileImageBlob.name || "profile.jpg"; // 기본 파일명 설정
        const imageFile = new File([formData.profileImageBlob], originalName, {
          type: formData.profileImageBlob.type,
        });
        formDataToSend.append("profileImage", imageFile);
      }

      const response = await axiosInstance.patch(
        `${API_BASE_URL}${USER}/modify-userinfo`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("회원 정보 수정 성공:", response);
      alert(
        "회원 정보가 성공적으로 수정되었습니다. 다시 로그인을 진행해주세요"
      );
      logout();
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);
      alert("회원 정보 수정에 실패했습니다.");
    }
  };

  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 전체 페이지 수 계산 (API 응답에서 받아온 totalPages 활용)
  const [totalPages, setTotalPages] = useState(1);

  // 게시판별 카테고리 매핑
  const boardCategoryMap = {
    질문: "question",
    후기: "review",
    자유: "free",
    소개: "introduction",
    분양: "adoption",
  };

  const getDisplayData = () => {
    let data = [];
    switch (activeTab) {
      case "posts":
        data = myPosts;
        break;
      case "comments":
        data = myComments;
        break;
      default:
        return [];
    }
    // data가 배열이 아니면 빈 배열 반환
    if (!Array.isArray(data)) return [];
    return data; // slice 제거
  };

  const getTotalPages = () => {
    switch (activeTab) {
      case "posts":
        return totalPages; // API에서 받아온 totalPages 사용
      case "comments":
        return Math.ceil(myComments.length / itemsPerPage);
      default:
        return 1;
    }
  };

  // 게시판별 내 게시물 데이터 가져오기 (CommentSection과 동일한 페이징 방식)
  const fetchMyPostsByCategory = async (category) => {
    if (!token) return;

    try {
      console.log("현재 페이지:", currentPage);

      let response;

      // adoption 카테고리인 경우 다른 API 엔드포인트 사용
      if (category === "adoption") {
        response = await axiosInstance.get(
          `${API_BASE_URL}${ABS}/animal-board/mypage?page=${
            currentPage - 1
          }&size=${itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // 기존 방식으로 쿼리 파라미터 사용
        response = await axiosInstance.get(
          `${API_BASE_URL}${BOARD}/list/${category}?page=${currentPage}&size=${itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log(`${category} 게시판 내 게시물 응답:`, response);
      console.log("응답 데이터 구조:", {
        hasData: !!response.data,
        hasResult: !!response.data?.result,
        hasContent: !!response.data?.content,
        resultType: typeof response.data?.result,
        contentType: typeof response.data?.content,
        totalPages:
          response.data?.totalPages || response.data?.result?.totalPages,
        currentPage: currentPage,
        itemsPerPage: itemsPerPage,
      });

      // CommentSection과 동일한 응답 구조 처리
      let newPosts = [];
      let totalPages = 1;

      if (
        response &&
        response.data &&
        response.data.result &&
        Array.isArray(response.data.result.content)
      ) {
        newPosts = response.data.result.content;
        totalPages = response.data.result.totalPages || 1;
      } else if (
        response &&
        response.data &&
        Array.isArray(response.data.content)
      ) {
        newPosts = response.data.content;
        totalPages = response.data.totalPages || 1;
      }

      console.log("매핑된 게시물 데이터:", newPosts);
      setMyPosts(newPosts);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(`${category} 게시판 내 게시물 조회 실패:`, error);
      setMyPosts([]);
      setTotalPages(1);
    }
  };

  // activeTab이 변경될 때마다 해당하는 데이터 가져오기
  useEffect(() => {
    if (!token) return;

    switch (activeTab) {
      case "posts":
        // 선택된 게시판의 카테고리로 데이터 가져오기
        const category = boardCategoryMap[selectedBoard];
        if (category) {
          fetchMyPostsByCategory(category);
        }
        break;
      default:
        break;
    }
  }, [activeTab, selectedBoard, currentPage, token]);

  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(
        `${API_BASE_URL}${USER}/resign`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("회원 탈퇴 성공:", response);
      alert("회원 탈퇴가 완료되었습니다.");

      // 로그아웃 처리 (알림 데이터도 함께 삭제됨)
      logout();
      navigate("/");
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const renderTabContent = () => {
    const displayData = getDisplayData();

    if (activeTab === "profile") {
      return (
        <div className="space-y-6">
          <ProfileForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleProfileImageChange={handleProfileImageChange}
          />
          {!isSocial && (
            <>
              <PasswordChangeForm />
              <EmailChangeForm currentEmail={formData.email} />
            </>
          )}
        </div>
      );
    }

    if (activeTab === "posts") {
      return (
        <div className="space-y-6">
          {/* 게시판 선택 버튼들 */}
          <div className="flex flex-wrap gap-3">
            {["질문", "후기", "소개", "자유", "분양"].map((board) => (
              <button
                key={board}
                onClick={() => {
                  setSelectedBoard(board);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedBoard === board
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-orange-300"
                }`}
              >
                {board} 게시판
              </button>
            ))}
          </div>

          {/* 선택된 게시판 표시 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              {selectedBoard} 게시판의 내 게시물
            </h3>
            <p className="text-blue-600 text-sm">
              현재 {selectedBoard} 게시판에서 작성한 게시물을 확인할 수
              있습니다.
            </p>
          </div>

          {/* 내 게시물 목록 */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="text-gray-800 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                {selectedBoard} 게시판의 내 게시물 ({myPosts.length}개)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {myPosts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    {selectedBoard} 게시판에 작성한 게시물이 없습니다.
                  </div>
                ) : (
                  myPosts.map((post) => (
                    <div
                      key={post.postid}
                      className="p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 cursor-pointer"
                      onClick={() => {
                        // 게시물 상세 페이지로 이동
                        const category = boardCategoryMap[selectedBoard];
                        navigate(`/detail/${category}/${post.postid}`);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm text-gray-800">
                              {post.title}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDateTime(post.createdat)}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              조회수: {post.viewcount || 0}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded break-words whitespace-pre-line">
                            <div
                              dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === "comments") {
      return <CommentsList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* 뒤로가기 버튼 */}
            <div className="mb-6">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>뒤로가기</span>
              </button>
            </div>

            {/* 페이지 제목 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                마이페이지
              </h1>
              <p className="text-gray-600">내 정보를 확인하고 관리하세요.</p>
            </div>

            {/* 탭 메뉴 */}
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setCurrentPage(1);
                if (tab === "posts") {
                  setSelectedBoard("질문");
                }
              }}
              setCurrentPage={setCurrentPage}
            />

            {/* 탭 내용 */}
            {renderTabContent()}

            {/* 회원 탈퇴 버튼 (프로필 탭에서만 표시) */}
            {activeTab === "profile" && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-800">
                      회원 탈퇴
                    </h3>
                  </div>
                  <p className="text-red-700 mb-4">
                    회원 탈퇴 시 모든 개인정보와 활동 내역이 영구적으로
                    삭제되며, 복구할 수 없습니다. 신중하게 결정해주세요.
                  </p>
                  <Button
                    onClick={() => setShowDeleteModal(true)}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    회원 탈퇴
                  </Button>
                </div>
              </div>
            )}

            {/* 페이징 */}
            {activeTab !== "profile" && getTotalPages() > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => {
                          const newPage = Math.max(1, currentPage - 1);
                          console.log("이전 페이지 클릭:", newPage);
                          setCurrentPage(newPage);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: getTotalPages() }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === getTotalPages() ||
                          Math.abs(page - currentPage) <= 2
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <PaginationItem>
                              <span className="px-4 py-2">...</span>
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => {
                                console.log(
                                  "페이지 버튼 클릭:",
                                  page,
                                  "현재 페이지:",
                                  currentPage
                                );
                                setCurrentPage(page);
                              }}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => {
                          const newPage = Math.min(
                            getTotalPages(),
                            currentPage + 1
                          );
                          console.log("다음 페이지 클릭:", newPage);
                          setCurrentPage(newPage);
                        }}
                        className={
                          currentPage === getTotalPages()
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>

        <div className="w-80 flex-shrink-0">
          <Sidebar />
        </div>
      </div>

      {/* 회원 탈퇴 확인 모달 */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>회원 탈퇴 확인</span>
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              정말로 회원 탈퇴를 진행하시겠습니까?
              <br />
              <br />
              <strong className="text-red-600">
                ⚠️ 이 작업은 되돌릴 수 없습니다.
              </strong>
              <br />
              <br />
              • 모든 개인정보 삭제
              <br />
              • 작성한 게시글 및 댓글 삭제
              <br />
              • 좋아요 및 북마크 삭제
              <br />• 메시지 내역 삭제
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "처리 중..." : "회원 탈퇴"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserMyPage;
