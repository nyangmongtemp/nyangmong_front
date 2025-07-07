import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { API_BASE_URL, USER } from "../../configs/host-config";

const UserMyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { token, email } = useAuth();

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
      const formDataToSend = new FormData();
      formDataToSend.append('nickname', formData.nickname);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      
      if (formData.profileImageBlob) {
        formDataToSend.append('profileImage', formData.profileImageBlob);
      }

      const response = await axiosInstance.put(
        `${API_BASE_URL}${USER}/profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("프로필 업데이트 성공:", response);
      alert("프로필이 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      alert("프로필 업데이트에 실패했습니다.");
    }
  };

  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

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

    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
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
          <PasswordChangeForm />
          <EmailChangeForm currentEmail={formData.email} />
        </div>
      );
    }

    if (activeTab === "posts") {
      return <PostsList posts={displayData} />;
    }

    if (activeTab === "comments") {
      return <CommentsList comments={displayData} />;
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
              setActiveTab={setActiveTab}
              setCurrentPage={setCurrentPage}
            />

            {/* 탭 내용 */}
            {renderTabContent()}

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
    </div>
  );
};

export default UserMyPage;
