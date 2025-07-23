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
import AdvertisementModifyModal from "../components/AdvertisementModifyModal";

const AdminAdvertisementManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("createdAt_desc");
  const [displayCount, setDisplayCount] = useState();

  const [ads, setAds] = useState([
    { id: 1, title: "광고 1", createdAt: "2025-07-01", updatedAt: "2025-07-10", confirmed: "false", active: "true" },
    { id: 2, title: "광고 2", createdAt: "2025-07-02", updatedAt: "2025-07-11", confirmed: "false", active: "true" },
    { id: 3, title: "광고 3", createdAt: "2025-07-03", updatedAt: "2025-07-12", confirmed: "false", active: "true" },
    { id: 4, title: "광고 4", createdAt: "2025-07-03", updatedAt: "2025-07-12", confirmed: "false", active: "true" },
    { id: 5, title: "광고 5", createdAt: "2025-07-03", updatedAt: "2025-07-12", confirmed: "false", active: "true" },
    { id: 6, title: "광고 6", createdAt: "2025-07-03", updatedAt: "2025-07-12", confirmed: "false", active: "true" },
    { id: 7, title: "광고 7", createdAt: "2025-07-03", updatedAt: "2025-07-12", confirmed: "false", active: "true" },
  ]);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  const handleDetailClick = (ad) => {
    setSelectedAd(ad);
    setIsDetailModalOpen(true);
  };

  const handleAdUpdate = (updatedAd) => {
    setAds((prev) => prev.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)));
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
                노출 광고 수: <span className="font-bold">{ads.length}</span>개
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
              {ads
                .filter((ad) =>
                  (ad.title || "").toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((ad) => (
                  <div
                    key={ad.id}
                    className="grid grid-cols-7 gap-4 items-center border-b py-2 text-sm"
                  >
                    <div>{ad.id}</div>
                    <div>{ad.title}</div>
                    <div>{ad.createdAt}</div>
                    <div>{ad.updatedAt}</div>
                    <div>{ad.confirmed}</div>
                    <div>{ad.active}</div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAd(ad);
                          setIsModifyModalOpen(true); // 수정 모달 열기
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

      {/* 모달 */}
      <AdvertisementDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        ad={selectedAd}
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
        ad={selectedAd} // 배열이 아니라 선택된 광고만 전달
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  );
};

export default AdminAdvertisementManagement;