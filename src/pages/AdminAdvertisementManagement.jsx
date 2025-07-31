import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import AdminSidebar from "../components/AdminSidebar";
import AdvertisementDetailModal from "../components/AdvertisementDetailModal";
import AdvertisementCreateModal from "../components/AdvertisementCreateModal";
import AdvertisementModifyModal from "../components/AdvertisementModifyModal";
import { useAdmin } from "../context/AdminContext";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, ADMIN } from "../../configs/host-config";

const AdminAdvertisementManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("id_asc");
  const [displayCount, setDisplayCount] = useState();
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { role, isLoggedIn } = useAdmin();
  const [showActiveOnly, setShowActiveOnly] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // 광고 목록 조회 함수
  const fetchAds = async (page = 0) => {
    const role = sessionStorage.getItem("adminRole");
    if (role !== "BOSS") return;

    const token = sessionStorage.getItem("adminToken");

    const requestBody = {
      title: searchTerm,
      active: showActiveOnly === null ? null : showActiveOnly,
      startDate: startDate && startDate !== "" ? startDate : null,
      endDate: endDate && endDate !== "" ? endDate : null,
      sort: sortOrder,
    };

    const requestParams = {
      page: page + 1,
      size: 10,
    };

    console.log("📤 요청 파라미터:", { ...requestBody, ...requestParams });

    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}${ADMIN}/ads/search`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: requestParams,
        }
      );

      const { content, totalPages, number } = response.data.result;

      // ✅ 응답 데이터 정확히 반영
      setAds(content);
      setCurrentPage(number);
      setTotalPages(totalPages);

      console.log("✅ 서버 응답:", response.data);
    } catch (error) {
      console.error("❌ 광고 목록 조회 실패", error);
      alert("광고 목록을 불러오지 못했습니다.");
    }
  };

  // 검색어, 정렬, 활성화, 날짜 변경 로그
  useEffect(() => {
    console.log("🔄 필터 변경 감지됨:", {
      searchTerm,
      sortOrder,
      showActiveOnly,
      startDate,
      endDate,
    });
    fetchAds(0);
  }, [searchTerm, showActiveOnly, sortOrder, startDate, endDate]);
  // 임시로 클라이언트 필터링 (서버 필터링 문제 시 사용)
  const filteredAds = showActiveOnly
    ? ads.filter((ad) => ad.active === true)
    : ads;

  // 모달 상태 및 선택 광고 상태
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  const handleDetailClick = (ad) => {
    setSelectedAd(ad);
    setIsDetailModalOpen(true);
  };

  const handleAdUpdate = (updatedAd) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad))
    );
  };

  const handleAdCreate = (newAd) => {
    const ad = {
      id: Date.now(),
      order: ads.length + 1,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      ...newAd,
    };
    setAds((prev) => [...prev, ad]);
  };

  const handleAdDelete = (adId) => {
    setAds((prev) => prev.filter((ad) => ad.id !== adId));
  };

  const handleOrderUpdate = (newOrder) => {
    setAds(newOrder);
  };

  const handlePageChange = (page) => {
    fetchAds(page);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-80">
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">광고 관리</h1>
            </div>

            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="text-gray-800 font-medium">
                노출 광고 수:{" "}
                <span className="font-bold">{filteredAds.length}</span>개
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">광고 개수 변경</span>
                <Input
                  type="number"
                  value={displayCount}
                  onChange={(e) => setDisplayCount(e.target.value)}
                  className="w-24"
                />
                <Button
                  variant="default"
                  onClick={() => alert(`노출 개수: ${displayCount} 적용됨`)}
                >
                  적용
                </Button>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                {/* 🔍 상단 필터 영역 */}
                <div className="flex justify-between items-center mb-4 gap-2">
                  {/* 🔍 왼쪽: 검색 + 활성화 토글 */}
                  <div className="flex gap-2 flex-1">
                    <Input
                      placeholder="검색어 입력"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-grow"
                    />
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => fetchAds(0)}
                    >
                      검색
                    </Button>
                    <Select
                      onValueChange={(value) =>
                        setShowActiveOnly(
                          value === "true"
                            ? true
                            : value === "false"
                            ? false
                            : null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="전체 상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">전체</SelectItem>
                        <SelectItem value="true">활성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 📅 오른쪽: 날짜 필터 */}
                  <div className="flex gap-2 items-center">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-36"
                    />
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-36"
                    />
                  </div>
                </div>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="ml-4 w-40">
                    <SelectValue placeholder="정렬조건" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createAt_desc">
                      생성일자 최신순
                    </SelectItem>
                    <SelectItem value="createAt_asc">
                      생성일자 오래된순
                    </SelectItem>
                    <SelectItem value="id_desc">아이디 내림차순</SelectItem>
                    <SelectItem value="id_asc">아이디 오름차순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-700">
                <div>광고 아이디</div>
                <div>제목</div>
                <div>생성일</div>
                <div>수정일</div>
                <div>필수노출</div>
                <div>활성화</div>
                <div className="text-right">관리</div>
              </div>
            </div>

            <div className="px-4 space-y-2">
              {filteredAds.map((ad) => (
                <div
                  key={ad.id}
                  className="grid grid-cols-7 gap-4 items-center border-b py-2 text-sm"
                >
                  <div>{ad.id}</div>
                  <div>{ad.title}</div>
                  <div>{new Date(ad.createdAt).toLocaleDateString()}</div>
                  <div>{new Date(ad.updatedAt).toLocaleDateString()}</div>
                  <div>{ad.confirmed ? "예" : "아니오"}</div>
                  <div>{ad.active ? "활성" : "비활성"}</div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedAd(ad);
                        setIsModifyModalOpen(true);
                      }}
                    >
                      수정
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDetailClick(ad)}
                    >
                      상세 보기
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={i === currentPage ? "default" : "outline"}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <div className="flex justify-end px-4 py-6">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                광고 등록하기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 모달들 */}
      <AdvertisementDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        adId={selectedAd?.id}
        onUpdate={handleAdUpdate}
        onDelete={handleAdDelete}
      />

      <AdvertisementCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleAdCreate}
      />

      <AdvertisementModifyModal
        isOpen={isModifyModalOpen}
        onClose={() => setIsModifyModalOpen(false)}
        ad={selectedAd}
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  );
};

export default AdminAdvertisementManagement;
