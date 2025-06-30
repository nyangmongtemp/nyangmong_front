
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminPolicyManagement = () => {
  const navigate = useNavigate();

  const handleCreatePolicy = () => {
    navigate('/admin/policy/create');
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
            <span>버전</span>
            <span>제목</span>
            <span>작성자</span>
            <span>생성일자</span>
          </div>
        </div>
        
        <div className="px-4 py-3">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <span>v.1</span>
            <span>작성본부(2025-05-15)</span>
            <span>도진호</span>
            <span>2015-05-15</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleCreatePolicy}
          className="bg-blue-600 hover:bg-blue-700"
        >
          신규 방침 생성
        </Button>
      </div>
    </div>
  );
};

export default AdminPolicyManagement;
