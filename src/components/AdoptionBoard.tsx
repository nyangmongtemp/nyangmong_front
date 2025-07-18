import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar } from "lucide-react";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL } from "../../configs/host-config";
import { API_ENDPOINTS } from "../../configs/api-endpoints";

const AdoptionBoard = () => {
  const [adoptionPosts, setAdoptionPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 창 크기에 따라 isMobile 값 업데이트
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // API에서 유기동물 데이터 가져오기
  useEffect(() => {
    const fetchStrayAnimals = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${API_BASE_URL}${API_ENDPOINTS.STRAY_ANIMAL.MAIN}`
        );

        // API 응답을 컴포넌트에서 사용할 형태로 매핑
        const mappedPosts = response.data.map((animal, index) => ({
          id: animal.desertionNo,
          title: `${animal.kindNm} 분양합니다`,
          image: animal.popfile1,
          location: animal.careAddr,
          age: animal.age,
          gender: animal.sexCd === "M" ? "수컷" : "암컷",
          price: "무료분양",
          date: animal.happenDt ? 
            `${animal.happenDt.substring(0, 4)}.${animal.happenDt.substring(4, 6)}.${animal.happenDt.substring(6, 8)}` : 
            "날짜 정보 없음",
          neuterYn: animal.neuterYn,
          careTel: animal.careTel,
        }));

        setAdoptionPosts(mappedPosts);
      } catch (err) {
        console.error("유기동물 데이터 조회 실패:", err);
        setError("유기동물 데이터를 불러오는데 실패했습니다.");
        // 에러 시 기본 데이터 설정
        setAdoptionPosts([
          {
            id: "469569202500525",
            title: "골든 리트리버 분양합니다",
            image: "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2025/07/202507171907953.jpeg",
            location: "세종특별자치시 전동면 미륵당1길 188",
            age: "2022(년생)",
            gender: "수컷",
            price: "무료분양",
            date: "2025.07.17",
            neuterYn: "Y",
            careTel: "010-4435-3720",
          },
          {
            id: "469569202500524",
            title: "믹스견 분양합니다",
            image: "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2025/07/202507152107738.jpeg",
            location: "세종특별자치시 전동면 미륵당1길 188",
            age: "2025(60일미만)(년생)",
            gender: "암컷",
            price: "무료분양",
            date: "2025.07.15",
            neuterYn: "N",
            careTel: "010-4435-3720",
          },
          {
            id: "469569202500523",
            title: "믹스견 분양합니다",
            image: "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2025/07/202507152107439.jpeg",
            location: "세종특별자치시 전동면 미륵당1길 188",
            age: "2025(60일미만)(년생)",
            gender: "수컷",
            price: "무료분양",
            date: "2025.07.15",
            neuterYn: "N",
            careTel: "010-4435-3720",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStrayAnimals();
  }, []);

  // 조건에 따라 보여줄 포스트 수 결정
  const visiblePosts = isMobile
    ? adoptionPosts.slice(0, 5)
    : adoptionPosts.slice(0, 9);

  if (loading) {
    return (
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">분양 게시판</h2>
          <button className="text-orange-500 hover:text-orange-600 font-medium">
            더보기 →
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500">유기동물 데이터를 불러오는 중...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">분양 게시판</h2>
          <button className="text-orange-500 hover:text-orange-600 font-medium">
            더보기 →
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">분양 게시판</h2>
        <button className="text-orange-500 hover:text-orange-600 font-medium">
          더보기 →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {visiblePosts.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-72 object-cover"
              />
              {(post.price === "무료분양" || post.neuterYn === "Y") && (
                <div className="absolute top-2 left-2 flex gap-2 z-10">
                  {post.price === "무료분양" && (
                    <Badge className="bg-green-500 hover:bg-green-500 text-xs">
                      무료분양
                    </Badge>
                  )}
                  {post.neuterYn === "Y" && (
                    <Badge className="bg-blue-500 hover:bg-blue-500 text-xs">
                      중성화
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-1">
                {post.title}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{post.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>나이: {post.age}</span>
                  <span>성별: {post.gender}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-orange-600">
                    {post.price}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                {post.careTel && (
                  <div className="text-xs text-gray-500">
                    연락처: {post.careTel}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AdoptionBoard;
