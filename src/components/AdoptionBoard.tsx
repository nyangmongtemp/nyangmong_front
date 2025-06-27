
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar } from 'lucide-react';

const AdoptionBoard = () => {
  const adoptionPosts = [
    {
      id: 1,
      title: "골든리트리버 분양합니다",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "서울 강남구",
      age: "2개월",
      gender: "수컷",
      price: "50만원",
      date: "2024.06.20"
    },
    {
      id: 2,
      title: "페르시안 고양이 분양",
      image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "부산 해운대구",
      age: "3개월",
      gender: "암컷",
      price: "30만원",
      date: "2024.06.21"
    },
    {
      id: 3,
      title: "코리안숏헤어 분양",
      image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "대구 수성구",
      age: "4개월",
      gender: "수컷",
      price: "무료분양",
      date: "2024.06.22"
    },
    {
      id: 4,
      title: "포메라니안 분양합니다",
      image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "인천 남동구",
      age: "2개월",
      gender: "암컷",
      price: "80만원",
      date: "2024.06.23"
    },
    {
      id: 5,
      title: "래브라도 분양",
      image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: "광주 서구",
      age: "3개월",
      gender: "수컷",
      price: "60만원",
      date: "2024.06.24"
    }
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">분양 게시판</h2>
        <button className="text-orange-500 hover:text-orange-600 font-medium">
          더보기 →
        </button>
      </div>
      
      <div className="space-y-4">
        {adoptionPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex">
              <div className="relative w-32 h-24 flex-shrink-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                {post.price === "무료분양" && (
                  <Badge className="absolute top-1 left-1 bg-green-500 hover:bg-green-500 text-xs">
                    무료분양
                  </Badge>
                )}
                <button className="absolute top-1 right-1 p-1 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <Heart className="h-3 w-3 text-gray-600" />
                </button>
              </div>
              <CardContent className="flex-1 p-4">
                <h3 className="font-bold text-base mb-2 line-clamp-1">{post.title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3 w-3" />
                    <span>{post.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>나이: {post.age}</span>
                    <span>성별: {post.gender}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-600">{post.price}</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AdoptionBoard;
