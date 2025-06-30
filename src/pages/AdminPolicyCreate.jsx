
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminPolicyCreate = () => {
  const navigate = useNavigate();
  const [policyData, setPolicyData] = useState({
    title: "",
    content: ""
  });

  const handleSubmit = () => {
    // 정책 저장 로직
    console.log("정책 저장:", policyData);
    navigate('/admin/support');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-80">
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">제목 입력 칸</h1>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <Input
                  placeholder="제목 입력"
                  value={policyData.title}
                  onChange={(e) => setPolicyData({...policyData, title: e.target.value})}
                  className="w-full"
                />
              </div>

              <div className="border rounded-lg p-4 min-h-[400px] bg-gray-50">
                <div className="text-center py-8">
                  <p className="text-gray-600 text-lg">텍스트 에디터</p>
                  <p className="text-gray-500 text-sm mt-2">
                    (이용약관처럼 기존 내용을 불러올 필요 X)
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  등록하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPolicyCreate;
