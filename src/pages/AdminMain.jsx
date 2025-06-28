import React from "react";
import Header from "@/components/Header";
import AdminSidebar from "@/components/AdminSidebar";

const AdminMain = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="ml-80 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            관리자 대시보드
          </h1>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                강원빈님 앞에 보세요
              </h2>
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">냥몽 관리자페이지</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
