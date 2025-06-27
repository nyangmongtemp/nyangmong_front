
import React from "react";
import { MapPin } from "lucide-react";

const MapComponent = ({ locations, selectedLocation }) => {
  return (
    <div className="w-full h-full relative bg-gray-100 flex items-center justify-center">
      {/* 정적 지도 배경 이미지 */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
        <div className="w-full h-full relative overflow-hidden">
          {/* 서울 지도 스타일 배경 */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* 한강 표현 */}
              <path
                d="M50 150 Q200 120 350 180"
                stroke="#4A90E2"
                strokeWidth="8"
                fill="none"
                opacity="0.6"
              />
              {/* 도로망 표현 */}
              <line x1="0" y1="100" x2="400" y2="100" stroke="#888" strokeWidth="2" opacity="0.4" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="#888" strokeWidth="2" opacity="0.4" />
              <line x1="100" y1="0" x2="100" y2="300" stroke="#888" strokeWidth="2" opacity="0.4" />
              <line x1="200" y1="0" x2="200" y2="300" stroke="#888" strokeWidth="2" opacity="0.4" />
              <line x1="300" y1="0" x2="300" y2="300" stroke="#888" strokeWidth="2" opacity="0.4" />
            </svg>
          </div>
          
          {/* 위치 마커들 */}
          {locations.map((location, index) => (
            <div
              key={location.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                selectedLocation?.id === location.id ? 'scale-125 z-10' : 'hover:scale-110'
              }`}
              style={{
                left: `${20 + (index % 4) * 20 + Math.random() * 10}%`,
                top: `${20 + Math.floor(index / 4) * 25 + Math.random() * 10}%`,
              }}
            >
              <div className={`relative ${selectedLocation?.id === location.id ? 'animate-bounce' : ''}`}>
                <MapPin 
                  className={`h-8 w-8 ${
                    selectedLocation?.id === location.id 
                      ? 'text-red-500' 
                      : 'text-orange-500'
                  } drop-shadow-lg cursor-pointer hover:text-red-500 transition-colors`}
                />
                {selectedLocation?.id === location.id && (
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-lg border text-sm font-medium whitespace-nowrap z-20">
                    <div className="text-gray-900">{location.name}</div>
                    <div className="text-gray-600 text-xs">{location.address}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 지도 정보 오버레이 */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
        <div className="text-sm font-medium text-gray-700">서울특별시</div>
        <div className="text-xs text-gray-500">총 {locations.length}개 위치</div>
      </div>
      
      {/* 범례 */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="h-4 w-4 text-orange-500" />
          <span className="text-gray-700">일반 위치</span>
        </div>
        <div className="flex items-center space-x-2 text-sm mt-1">
          <MapPin className="h-4 w-4 text-red-500" />
          <span className="text-gray-700">선택된 위치</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
