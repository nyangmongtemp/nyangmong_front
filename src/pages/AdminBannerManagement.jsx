import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminSidebar from "../components/AdminSidebar";
import BannerDetailModal from "../components/BannerDetailModal";
import BannerCreateModal from "../components/BannerCreateModal";
import BannerOrderModal from "../components/BannerOrderModal";
import { useAdmin } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { ADMIN, API_BASE_URL } from "../../configs/host-config";
import { Dialog } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminBannerManagement = () => {
  const bannerUrl = `${API_BASE_URL}${ADMIN}/banner`;
  const navigate = useNavigate();
  const token = sessionStorage.getItem("adminToken");
  useEffect(() => {
    const forceEmailChange = sessionStorage.getItem("forceEmailChange");
    if (forceEmailChange) {
      alert("이메일 변경을 완료해야 다른 기능을 이용할 수 있습니다.");
      navigate("/admin/mypage", { replace: true });
      return;
    }
    const role = sessionStorage.getItem("adminRole");

    if (role !== "BOSS" && role !== "CONTENT") {
      alert("접근 권한이 없습니다.");
      // 권한 없으면 메인 화면으로 이동
      navigate("/admin/", { replace: true });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!token) return;
    // 페이지가 렌더링될 때 배너 리스트를 불러옴 (axios 사용)
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${bannerUrl}/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // result 배열을 order 오름차순으로 정렬해서 setBanners
        const sortedBanners = response.data.result.sort(
          (a, b) => a.order - b.order
        );
        setBanners(sortedBanners);
        console.log("배너 리스트 응답:", response.data);
      } catch (error) {
        console.error("배너 리스트 요청 에러:", error);
      }
    };
    fetchBanners();
  }, [bannerUrl, token]);

  const [bannerCount, setBannerCount] = useState(0);
  const [isCountModalOpen, setIsCountModalOpen] = useState(false);
  const [editCount, setEditCount] = useState(3);

  useEffect(() => {
    if (!token) return;
    // 배너 개수 요청
    const fetchBannerCount = async () => {
      try {
        const response = await axios.get(`${bannerUrl}/count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("배너 개수 응답:", response.data);
        setBannerCount(response.data);
        setEditCount(response.data); // 모달 열 때 초기값 세팅
      } catch (error) {
        console.error("배너 개수 요청 에러:", error);
      }
    };
    fetchBannerCount();
  }, [bannerUrl, token]);

  const [banners, setBanners] = useState([
    {
      id: 1,
      name: "기본 배너",
      type: "default",
      imageUrl:
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
    },
    {
      id: 2,
      name: "행사 배너",
      type: "event",
      imageUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
    },
    {
      id: 3,
      name: "추가된 배너",
      type: "custom",
      imageUrl:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    },
    {
      id: 4,
      name: "추가된 배너",
      type: "custom",
      imageUrl:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
    },
    {
      id: 5,
      name: "추가된 배너",
      type: "custom",
      imageUrl:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
    },
  ]);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isExposeModalOpen, setIsExposeModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchPage, setSearchPage] = useState(0);
  const [searchResult, setSearchResult] = useState(null);

  const handleDetailClick = async (banner) => {
    try {
      const response = await axios.get(
        `${bannerUrl}/detail/${banner.bannerId || banner.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("배너 상세 응답:", response.data);
      setSelectedBanner(response.data.result); // 상세 응답의 result를 저장
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("배너 상세 요청 에러:", error);
    }
  };

  const handleBannerUpdate = async (updatedBanner) => {
    try {
      const formData = new FormData();
      console.log(updatedBanner);

      formData.append(
        "banner",
        new Blob(
          [
            JSON.stringify({
              bannerId: updatedBanner.bannerId || updatedBanner.id,
              title: updatedBanner.title || updatedBanner.name,
            }),
          ],
          { type: "application/json" }
        )
      );
      // 이미지가 변경된 경우에만 thumbnailImage 추가
      if (updatedBanner.thumbnailImageFile) {
        formData.append("thumbnailImage", updatedBanner.thumbnailImageFile);
      }
      const response = await axios.patch(`${bannerUrl}/modify`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("배너 수정 응답:", response.data);
      // 성공 시 배너 목록 갱신 등 추가 작업 필요시 여기에
    } catch (error) {
      console.error("배너 수정 요청 에러:", error);
    }
  };

  const handleBannerCreate = async (newBanner) => {
    try {
      const formData = new FormData();
      formData.append(
        "banner",
        new Blob(
          [
            JSON.stringify({
              title: newBanner.title,
            }),
          ],
          { type: "application/json" }
        )
      );
      formData.append("thumbnailImage", newBanner.thumbnailImageFile);
      const response = await axios.post(`${bannerUrl}/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("배너 등록 응답:", response.data);
      // 성공 시 배너 목록 갱신 등 추가 작업 필요시 여기에
    } catch (error) {
      console.error("배너 등록 요청 에러:", error);
    }
  };

  const handleBannerDelete = async (bannerId) => {
    try {
      const response = await axios.delete(`${bannerUrl}/delete/${bannerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        alert("배너 삭제가 완료되었습니다");
        setBanners((prev) =>
          prev.filter((banner) => (banner.bannerId || banner.id) !== bannerId)
        );
      }
    } catch (error) {
      console.error("배너 삭제 요청 에러:", error);
    }
  };

  const handleOrderUpdate = async (orderList) => {
    try {
      const response = await axios.patch(`${bannerUrl}/order`, orderList, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("배너 순서 수정 응답:", response.data);
      // 성공 시 배너 목록 갱신 등 추가 작업 필요시 여기에
    } catch (error) {
      console.error("배너 순서 수정 요청 에러:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-80">
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-between">
                <span>
                  배너 관리{" "}
                  <span className="text-base font-normal text-gray-500">
                    (노출 가능 배너 개수 : {bannerCount})
                  </span>
                </span>
                <button
                  className="ml-4 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm"
                  onClick={() => setIsCountModalOpen(true)}
                >
                  개수 변경하기
                </button>
              </h1>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  {banners.map((banner) => (
                    <div
                      key={banner.bannerId || banner.id}
                      className="flex items-center space-x-4"
                    >
                      <Input
                        value={banner.title || banner.name}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => handleDetailClick(banner)}
                      >
                        상세 보기
                      </Button>
                      {!banner.basic && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleBannerDelete(banner.bannerId || banner.id)
                          }
                        >
                          삭제
                        </Button>
                      )}
                      {banner.basic && (
                        <span className="text-xs text-gray-400">기본 배너</span>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="bg-gray-50 border rounded-lg h-64 flex items-center justify-center relative">
                    {banners.length > 0 ? (
                      <>
                        <button
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1 shadow"
                          onClick={() =>
                            setCurrentBannerIndex(
                              (prev) =>
                                (prev - 1 + banners.length) % banners.length
                            )
                          }
                          disabled={banners.length <= 1}
                        >
                          ◀
                        </button>
                        <div className="flex flex-col items-center w-full h-full justify-center">
                          <img
                            src={
                              banners[currentBannerIndex].thumbnailImage ||
                              banners[currentBannerIndex].image
                            }
                            alt={
                              banners[currentBannerIndex].title ||
                              banners[currentBannerIndex].name
                            }
                            className="max-w-full max-h-40 object-contain mb-2"
                          />
                          <span className="text-gray-900 font-semibold">
                            {banners[currentBannerIndex].title ||
                              banners[currentBannerIndex].name}
                          </span>
                        </div>
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1 shadow"
                          onClick={() =>
                            setCurrentBannerIndex(
                              (prev) => (prev + 1) % banners.length
                            )
                          }
                          disabled={banners.length <= 1}
                        >
                          ▶
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500">배너 이미지</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsOrderModalOpen(true)}
                >
                  순서 수정하기
                </Button>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  배너 등록하기
                </Button>
              </div>
              {bannerCount > banners.length && (
                <div className="flex justify-end mt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setIsExposeModalOpen(true)}
                  >
                    배너 노출
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BannerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        banner={selectedBanner}
        onUpdate={handleBannerUpdate}
        onDelete={handleBannerDelete}
      />

      <BannerCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleBannerCreate}
      />

      <BannerOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        banners={banners}
        onOrderUpdate={handleOrderUpdate}
      />

      {/* 배너 개수 변경 모달 */}
      <Dialog open={isCountModalOpen} onOpenChange={setIsCountModalOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>노출 배너 개수 변경</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center space-x-4 my-4">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-lg"
              onClick={() => setEditCount((prev) => Math.max(3, prev - 1))}
              disabled={editCount <= 3}
            >
              -
            </button>
            <span className="text-xl font-bold w-8 text-center">
              {editCount}
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-lg"
              onClick={() => setEditCount((prev) => Math.min(8, prev + 1))}
              disabled={editCount >= 8}
            >
              +
            </button>
          </div>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={async () => {
                try {
                  const response = await axios.patch(
                    `${bannerUrl}/count/${editCount}`,
                    null,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  console.log("배너 개수 변경 응답:", response.data);
                  setBannerCount(editCount);
                  setIsCountModalOpen(false);
                } catch (error) {
                  console.error("배너 개수 변경 요청 에러:", error);
                }
              }}
            >
              변경하기
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 배너 노출 모달 */}
      <Dialog open={isExposeModalOpen} onOpenChange={setIsExposeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>배너 노출시킬 게시글 검색</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2 my-4">
            <input
              type="text"
              className="border rounded px-2 py-1 flex-1"
              placeholder="제목을 입력하세요"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Button
              onClick={async () => {
                try {
                  const response = await axios.get(`${bannerUrl}/search`, {
                    params: {
                      keyword: searchKeyword,
                      page: searchPage,
                    },
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  setSearchResult(response.data);
                  console.log("배너 노출 검색 응답:", response.data);
                } catch (error) {
                  console.error("배너 노출 검색 요청 에러:", error);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              검색
            </Button>
          </div>
          {/* 검색 결과 및 페이징 */}
          {searchResult && searchResult.result && (
            <div>
              <div className="space-y-2 mb-4">
                {searchResult.result.content &&
                searchResult.result.content.length > 0 ? (
                  searchResult.result.content.map((item) => (
                    <div
                      key={item.bannerId}
                      className="flex items-center space-x-4 p-2 border rounded"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-10 object-cover rounded"
                      />
                      <span className="font-medium">{item.title}</span>
                      {item.order === null && (
                        <Button
                          className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                          onClick={async () => {
                            try {
                              const response = await axios.patch(
                                `${bannerUrl}/enroll/${item.bannerId}`,
                                null,
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              );
                              console.log(
                                "배너 노출 등록 응답:",
                                response.data
                              );
                              if (
                                response.data &&
                                response.data.result === true
                              ) {
                                alert("배너가 노출되었습니다");
                                setIsExposeModalOpen(false);
                              }
                            } catch (error) {
                              console.error("배너 노출 등록 요청 에러:", error);
                            }
                          }}
                        >
                          노출하기
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">검색 결과가 없습니다.</div>
                )}
              </div>
              {searchResult.result.totalElements > 5 && (
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const newPage = Math.max(
                        0,
                        searchResult.result.number - 1
                      );
                      setSearchPage(newPage);
                      try {
                        const response = await axios.get(
                          `${bannerUrl}/search`,
                          {
                            params: {
                              keyword: searchKeyword,
                              page: newPage,
                            },
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                        setSearchResult(response.data);
                        console.log("배너 노출 검색 응답:", response.data);
                      } catch (error) {
                        console.error("배너 노출 검색 요청 에러:", error);
                      }
                    }}
                    disabled={searchResult.result.first}
                  >
                    이전
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const newPage = searchResult.result.number + 1;
                      setSearchPage(newPage);
                      try {
                        const response = await axios.get(
                          `${bannerUrl}/search`,
                          {
                            params: {
                              keyword: searchKeyword,
                              page: newPage,
                            },
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                        setSearchResult(response.data);
                        console.log("배너 노출 검색 응답:", response.data);
                      } catch (error) {
                        console.error("배너 노출 검색 요청 에러:", error);
                      }
                    }}
                    disabled={searchResult.result.last}
                  >
                    다음
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBannerManagement;
