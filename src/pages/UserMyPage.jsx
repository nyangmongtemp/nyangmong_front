import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
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
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProfileForm from "@/components/ProfileForm";
import PasswordChangeForm from "@/components/PasswordChangeForm";
import EmailChangeForm from "@/components/EmailChangeForm";
import PostsList from "@/components/PostsList";
import CommentsList from "@/components/CommentsList";
import LikedPostsList from "@/components/LikedPostsList";
import TabNavigation from "@/components/TabNavigation";
import { useUserPageData } from "@/hooks/useUserPageData";
import { useAuth } from "../context/UserContext";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, USER, MAIN, BOARD } from "../../configs/host-config";

const UserMyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [currentPage, setCurrentPage] = useState(0); // 0부터 시작하도록 변경
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
        phone: formData.phone,
        address: formData.address,
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
  const [likedPosts, setLikedPosts] = useState([]);
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
      case "likes":
        data = likedPosts;
        break;
      default:
        return [];
    }
    // data가 배열이 아니면 빈 배열 반환
    if (!Array.isArray(data)) return [];
    return data; // slice 제거
  };

  const getTotalPages = () => {
    let totalItems = 0;
    switch (activeTab) {
      case "posts":
        totalItems = myPosts.length;
        break;
      case "comments":
        totalItems = myComments.length;
        break;
      case "likes":
        totalItems = likedPosts.length;
        break;
      default:
        totalItems = 0;
    }
    return Math.ceil(totalItems / itemsPerPage);
  };

  // 게시판별 내 게시물 데이터 가져오기
  const fetchMyPostsByCategory = async (category) => {
    if (!token) return;

    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}${BOARD}/mypage/${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            size: itemsPerPage,
          },
        }
      );

      console.log(`${category} 게시판 내 게시물 응답:`, response);
      // result가 배열이거나, result.content가 배열인 경우만 저장
      setMyPosts(
        Array.isArray(response.data.result)
          ? response.data.result
          : Array.isArray(response.data.result?.content)
          ? response.data.result.content
          : []
      );
      // totalPages도 저장
      if (
        response.data.result &&
        typeof response.data.result.totalPages === "number"
      ) {
        setTotalPages(response.data.result.totalPages);
      } else {
        setTotalPages(1);
      }
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
      case "likes":
        // TODO: 좋아요한 게시글 데이터 가져오기
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
                  setCurrentPage(0);
                  // fetchMyPostsByCategory 호출 제거
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

          <PostsList category={boardCategoryMap[selectedBoard]} />
        </div>
      );
    }

    if (activeTab === "comments") {
      return <CommentsList />;
    }

    if (activeTab === "likes") {
      return <LikedPostsList posts={displayData} />;
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
                setCurrentPage(0);
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

            {/* 페이지네이션 (프로필 탭이 아닐 때만 표시) */}
            {activeTab !== "profile" && getTotalPages() > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
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
                              onClick={() => setCurrentPage(page)}
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
                        onClick={() =>
                          setCurrentPage(
                            Math.min(getTotalPages(), currentPage + 1)
                          )
                        }
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
