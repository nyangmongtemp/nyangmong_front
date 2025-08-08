import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  // 관리자 페이지에서는 푸터를 표시하지 않음
  if (location.pathname.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* 로고 및 회사 정보 */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">사랑스러운 공유 공간</h3>
            <p className="text-gray-300 text-sm">
              반려동물과 함께하는 따뜻한 커뮤니티
            </p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-700 mt-6 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-2 md:mb-0">
              © 2024 사랑스러운 공유 공간. All rights reserved.
            </p>
            <div className="flex space-x-4"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
