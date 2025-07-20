import React, { useState } from "react";
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
import AdvertisementOrderModal from "../components/AdvertisementOrderModal";

const AdminAdvertisementManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("createdAt_desc");

  const [banners, setBanners] = useState([
    {
      id: 1,
      order: 1,
      name: "기본 배너",
      createdAt: "2025-07-01",
      updatedAt: "2025-07-10",
      imageUrl:
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
    },
    {
      id: 2,
      order: 2,
      name: "추기된 배너",
      createdAt: "2025-07-02",
      updatedAt: "2025-07-11",
      imageUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
    },
    {
      id: 3,
      order: 3,
      name: "추가된 배너1",
      createdAt: "2025-07-03",
      updatedAt: "2025-07-12",
      imageUrl:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    },
    {
      id: 4,
      order: 4,
      name: "추가된 배너2",
      createdAt: "2025-07-04",
      updatedAt: "2025-07-13",
      imageUrl:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
    },
    {
      id: 5,
      order: 5,
      name: "추가된 배너3",
      createdAt: "2025-07-05",
      updatedAt: "2025-07-14",
      imageUrl:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
    },
  ]);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const handleDetailClick = (banner) => {
    setSelectedBanner(banner);
    setIsDetailModalOpen(true);
  };

  const handleBannerUpdate = (updatedBanner) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === updatedBanner.id ? updatedBanner : banner
      )
    );
  };

  const handleBannerCreate = (newBanner) => {
    const banner = {
      id: Date.now(),
      order: banners.length + 1,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      ...newBanner,
    };
    setBanners((prev) => [...prev, banner]);
  };

  const handleBannerDelete = (bannerId) => {
    setBanners((prev) => prev.filter((banner) => banner.id !== bannerId));
  };

  const handleOrderUpdate = (newOrder) => {
    setBanners(newOrder);
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

            {/* 검색 및 정렬 영역 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">

                {/* 검색창 + 버튼 */}
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Input
                    placeholder="검색어 입력"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700">검색</Button>
                </div>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="ml-4 w-40">
                    <SelectValue placeholder="정렬조건" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt_desc">생성일자 최신순</SelectItem>
                    <SelectItem value="createdAt_asc">생성일자 오래된순</SelectItem>
                    <SelectItem value="order_desc">순서 내림차순</SelectItem>
                    <SelectItem value="order_asc">순서 오름차순</SelectItem>
                    <SelectItem value="id_desc">아이디 내림차순</SelectItem>
                    <SelectItem value="id_asc">아이디 오름차순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                <div>광고 아이디</div>
                <div>순서</div>
                <div>제목</div>
                <div>생성일</div>
                <div>수정일</div>
                <div className="text-right">관리</div>
              </div>
            </div>


            {/* 리스트 */}
            <div className="px-4 space-y-2">
              {banners
                .filter((banner) =>
                  banner.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((banner) => (
                  <div
                    key={banner.id}
                    className="grid grid-cols-6 gap-4 items-center border-b py-2 text-sm"
                  >
                    <div>{banner.id}</div>
                    <div>{banner.order}</div>
                    <div>{banner.name}</div>
                    <div>{banner.createdAt}</div>
                    <div>{banner.updatedAt}</div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleBannerDelete(banner.id)}
                      >
                        삭제하기
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDetailClick(banner)}
                      >
                        상세 보기
                      </Button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-between px-4 py-6">
              <Button variant="outline" onClick={() => setIsOrderModalOpen(true)}>
                순서 수정하기
              </Button>
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

      <AdvertisementDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        banner={selectedBanner}
        onUpdate={handleBannerUpdate}
        onDelete={handleBannerDelete}
      />

      <AdvertisementCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleBannerCreate}
      />

      <AdvertisementOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        banners={banners}
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  );
};

export default AdminAdvertisementManagement;