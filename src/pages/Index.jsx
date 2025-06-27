
import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import PetCarousel from '@/components/PetCarousel';
import PetShowcase from '@/components/PetShowcase';
import CommunityBoard from '@/components/CommunityBoard';
import EventBanner from '@/components/EventBanner';
import RecentPosts from '@/components/RecentPosts';
import AdoptionBoard from '@/components/AdoptionBoard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3 space-y-8">
            <PetCarousel />
            <PetShowcase />
            <EventBanner />
            <AdoptionBoard />
            <RecentPosts />
          </div>
          
          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
