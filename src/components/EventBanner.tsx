
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';

const EventBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const events = [
    {
      id: 1,
      title: "2024 펫 페스티벌",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      location: "서울 한강공원",
      period: "2024.07.15 - 2024.07.17",
      description: "반려동물과 함께하는 즐거운 축제"
    },
    {
      id: 2,
      title: "반려동물 건강검진 캠페인",
      image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      location: "전국 동물병원",
      period: "2024.07.01 - 2024.07.31",
      description: "우리 아이 건강을 위한 무료 검진"
    },
    {
      id: 3,
      title: "펫 용품 할인 박람회",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      location: "코엑스 전시장",
      period: "2024.08.10 - 2024.08.12",
      description: "펫 용품 최대 50% 할인 혜택"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [events.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">펫 행사 정보</h2>
      <Card className="relative overflow-hidden h-64 bg-gradient-to-r from-orange-100 to-pink-100">
        <CardContent className="p-0 h-full">
          <div className="relative h-full">
            <img
              src={events[currentSlide].image}
              alt={events[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
            <div className="absolute inset-0 flex items-center justify-between p-6">
              <div className="text-white max-w-lg">
                <h3 className="text-3xl font-bold mb-2">{events[currentSlide].title}</h3>
                <p className="text-gray-200 mb-4">{events[currentSlide].description}</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{events[currentSlide].location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{events[currentSlide].period}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default EventBanner;
