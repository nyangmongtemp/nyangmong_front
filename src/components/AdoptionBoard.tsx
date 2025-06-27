import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar } from "lucide-react";

const AdoptionBoard = () => {
  const adoptionPosts = [
    {
      id: 1,
      title: "골든리트리버 분양합니다",
      image:
        "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "서울 강남구",
      age: "2개월",
      gender: "수컷",
      price: "50만원",
      date: "2024.06.20",
    },
    {
      id: 2,
      title: "페르시안 고양이 분양",
      image:
        "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "부산 해운대구",
      age: "3개월",
      gender: "암컷",
      price: "30만원",
      date: "2024.06.21",
    },
    {
      id: 3,
      title: "코리안숏헤어 분양",
      image:
        "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "대구 수성구",
      age: "4개월",
      gender: "수컷",
      price: "무료분양",
      date: "2024.06.22",
    },
    {
      id: 4,
      title: "포메라니안 분양합니다",
      image:
        "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "인천 남동구",
      age: "2개월",
      gender: "암컷",
      price: "80만원",
      date: "2024.06.23",
    },
    {
      id: 5,
      title: "래브라도 분양",
      image:
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "광주 서구",
      age: "3개월",
      gender: "수컷",
      price: "60만원",
      date: "2024.06.24",
    },
    {
      id: 6,
      title: "래브라도 분양",
      image:
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "광주 서구",
      age: "3개월",
      gender: "수컷",
      price: "60만원",
      date: "2024.06.24",
    },
    {
      id: 7,
      title: "래브라도 분양",
      image:
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "광주 서구",
      age: "3개월",
      gender: "수컷",
      price: "60만원",
      date: "2024.06.24",
    },
    {
      id: 8,
      title: "래브라도 분양",
      image:
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "광주 서구",
      age: "3개월",
      gender: "수컷",
      price: "60만원",
      date: "2024.06.24",
    },
    {
      id: 9,
      title: "래브라도 분양",
      image:
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "광주 서구",
      age: "3개월",
      gender: "수컷",
      price: "60만원",
      date: "2024.06.24",
    },
  ];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 창 크기에 따라 isMobile 값 업데이트
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 조건에 따라 보여줄 포스트 수 결정
  const visiblePosts = isMobile
    ? adoptionPosts.slice(0, 5)
    : adoptionPosts.slice(0, 9);

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">분양 게시판</h2>
        <button className="text-orange-500 hover:text-orange-600 font-medium">
          더보기 →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePosts.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              {post.price === "무료분양" && (
                <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-500 text-xs">
                  무료분양
                </Badge>
              )}
              <button className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white transition-colors">
                <Heart className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-1">
                {post.title}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{post.location}</span>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AdoptionBoard;
