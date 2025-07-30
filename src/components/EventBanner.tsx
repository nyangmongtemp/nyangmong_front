import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, MAIN } from "../../configs/host-config";

const EventBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState([]); // 광고 배너 상태 추가

  // 광고 배너 목록 API 연동
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axiosInstance.get(
          `${API_BASE_URL}${MAIN}/screen/banner/list`
        );
        // order 오름차순 정렬
        const sorted = (res.data.result || []).sort(
          (a, b) => a.order - b.order
        );
        setBanners(sorted);
        setCurrentSlide(0); // 새로 받아오면 첫 슬라이드로
      } catch (error) {
        setBanners([]);
        console.error("광고 배너 불러오기 실패:", error);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">배너 정보</h2>
      <Card className="relative overflow-hidden h-64 bg-gradient-to-r from-orange-100 to-pink-100">
        <CardContent className="p-0 h-full">
          {banners.length > 0 ? (
            <div className="relative h-full">
              <img
                src={banners[currentSlide].image}
                alt="광고"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
              <div className="absolute inset-0 flex items-center justify-between p-6">
                <div className="text-white max-w-lg">
                  <h3 className="text-3xl font-bold mb-2">
                    {banners[currentSlide].title || "이벤트"}
                  </h3>
                  <p className="text-gray-200 mb-4">
                    {banners[currentSlide].description ||
                      "자세한 내용을 확인해보세요"}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {banners[currentSlide].location || "위치 정보"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{banners[currentSlide].period || "기간 정보"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
              광고 배너가 없습니다.
            </div>
          )}

          {banners.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                disabled={banners.length <= 1}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                disabled={banners.length <= 1}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default EventBanner;
