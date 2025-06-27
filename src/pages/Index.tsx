
import React from 'react';
import Header from '@/components/Header';
import PetShowcase from '@/components/PetShowcase';
import EventBanner from '@/components/EventBanner';
import AdoptionBoard from '@/components/AdoptionBoard';
import RecentPosts from '@/components/RecentPosts';
import Sidebar from '@/components/Sidebar';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 영역 */}
          <div className="lg:col-span-3 space-y-8">
            {/* 펫 자랑 섹션 */}
            <PetShowcase />

            {/* 행사 배너 */}
            <EventBanner />

            {/* 분양 게시판 */}
            <AdoptionBoard />

            {/* 최근 게시물 */}
            <RecentPosts />
          </div>

          {/* 사이드바 영역 (데스크톱에서만 표시) */}
          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">냥</span>
              </div>
              <p className="font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                냥몽 - 반려동물과 함께하는 따뜻한 커뮤니티
              </p>
            </div>
            <p className="text-sm">© 2024 냥몽. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
