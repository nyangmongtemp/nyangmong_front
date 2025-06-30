
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminSidebar from "../components/AdminSidebar";
import BannerDetailModal from "../components/BannerDetailModal";
import BannerCreateModal from "../components/BannerCreateModal";

const AdminBannerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const banners = [
    {
      id: 1,
      title: "기본 배너",
      description: "추가 배너",
      status: "상세 보기"
    },
    {
      id: 2,
      title: "추가 배너",
      description: "상세 보기",
      status: "상세 보기"
    },
    {
      id: 3,
      title: "추가 배너",
      description: "상세 보기",
      status: "상세 보기"
    },
    {
      id: 4,
      title: "추가 배너",
      description: "상세 보기",
      status: "상세 보기"
    }
  ];

  const handleDetailClick = (banner) => {
    setSelectedBanner(banner);
    setIsDetailModalOpen(true);
  };

  const filteredBanners = banners.filter(banner =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-80">
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">배너 관리</h1>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="border rounded-lg px-4 py-3">
                    <span className="text-gray-700">기본 배너</span>
                  </div>
                  <div className="border rounded-lg px-4 py-3">
                    <span className="text-gray-700">상세 보기</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Input
                      placeholder="공사 배너"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline"
                      onClick={() => handleDetailClick(banners[0])}
                    >
                      상세 보기
                    </Button>
                  </div>

                  {filteredBanners.map((banner) => (
                    <div key={banner.id} className="flex items-center space-x-4">
                      <Input
                        placeholder="추가 배너"
                        defaultValue={banner.title === "기본 배너" ? "" : banner.title}
                        className="flex-1"
                      />
                      <Input
                        placeholder="상세"
                        className="w-20"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => handleDetailClick(banner)}
                      >
                        상세 보기
                      </Button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="bg-gray-50 border rounded-lg h-64 flex items-center justify-center">
                    <span className="text-gray-500">배너 이미지</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline">
                  순서 수정하기
                </Button>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  배너 등록하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BannerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        banner={selectedBanner}
      />

      <BannerCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default AdminBannerManagement;
