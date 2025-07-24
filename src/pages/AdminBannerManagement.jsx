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

const AdminBannerManagement = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const forceEmailChange = sessionStorage.getItem("forceEmailChange");
    if (forceEmailChange) {
      alert("이메일 변경을 완료해야 다른 기능을 이용할 수 있습니다.");
      navigate("/admin/mypage", { replace: true });
      return;
    }
  }, [navigate]);

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
      ...newBanner,
      type: "custom",
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
              <h1 className="text-2xl font-bold text-gray-900">배너 관리</h1>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      className="flex items-center space-x-4"
                    >
                      <Input value={banner.name} readOnly className="flex-1" />
                      {banner.type === "custom" && (
                        <Input
                          placeholder="삭제"
                          className="w-16 text-center"
                          readOnly
                        />
                      )}
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
                    {selectedBanner ? (
                      <img
                        src={selectedBanner.imageUrl}
                        alt={selectedBanner.name}
                        className="max-w-full max-h-full object-contain"
                      />
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
    </div>
  );
};

export default AdminBannerManagement;
