import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminCreateModal from "@/components/AdminCreateModal";
import AdminDeleteModal from "@/components/AdminDeleteModal";
import AdminEditModal from "../components/AdminEditModal";

const AdminManagerManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  // 임시 관리자 데이터
  const managers = [
    {
      id: 1,
      name: "이메일",
      email: "권한(셀렉트박스)",
      phone: "이름",
      role: "전화번호",
      status: "활성화여부(셀렉트박스)",
      count: "수정",
      action: "삭제",
    },
    {
      id: 2,
      name: "이메일",
      email: "권한(셀렉트박스)",
      phone: "이름",
      role: "전화번호",
      status: "활성화여부",
      count: "수정",
      action: "삭제",
    },
    {
      id: 3,
      name: "이메일",
      email: "권한(셀렉트박스)",
      phone: "이름",
      role: "전화번호",
      status: "활성화여부",
      count: "수정",
      action: "삭제",
    },
    {
      id: 4,
      name: "이메일",
      email: "권한(셀렉트박스)",
      phone: "이름",
      role: "전화번호",
      status: "활성화여부",
      count: "수정",
      action: "삭제",
    },
    {
      id: 5,
      name: "이메일",
      email: "권한(셀렉트박스)",
      phone: "이름",
      role: "전화번호",
      status: "활성화여부",
      count: "수정",
      action: "삭제",
    },
    {
      id: 6,
      name: "이메일",
      email: "권한(셀렉트박스)",
      phone: "이름",
      role: "전화번호",
      status: "활성화여부",
      count: "수정",
      action: "삭제",
    },
    {
      id: 7,
      name: "이메일",
      email: "권한(셀렉트박스)",
      phone: "이름",
      role: "전화번호",
      status: "활성화여부",
      count: "수정",
      action: "삭제",
    },
    {
      id: 8,
      name: "이메일",
      email: "권한(셀렉트박스)",
      phone: "이름",
      role: "전화번호",
      status: "활성화여부",
      count: "수정",
      action: "삭제",
    },
  ];

  const handleEdit = (manager) => {
    setSelectedManager(manager);
    setIsEditModalOpen(true);
  };

  const handleDelete = (manager) => {
    setSelectedManager(manager);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="ml-80 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">관리자 관리</h1>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsCreateModalOpen(true)}
            >
              관리자 등록
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* 관리자 목록 */}
            <div className="divide-y divide-gray-200">
              {managers.map((manager) => (
                <div key={manager.id} className="p-4">
                  <div className="grid grid-cols-7 gap-4 items-center">
                    <div className="text-sm text-gray-900">{manager.name}</div>
                    <div className="text-sm">
                      <Select defaultValue="총괄">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="총괄">총괄</SelectItem>
                          <SelectItem value="콘텐츠">콘텐츠</SelectItem>
                          <SelectItem value="고객센터">고객센터</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-gray-900">{manager.phone}</div>
                    <div className="text-sm text-gray-900">{manager.role}</div>
                    <div className="text-sm">
                      <Select defaultValue="활성">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="활성">활성</SelectItem>
                          <SelectItem value="비활성">비활성</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(manager)}
                      >
                        수정
                      </Button>
                    </div>
                    <div className="text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(manager)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AdminCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <AdminDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        manager={selectedManager}
      />

      <AdminEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        manager={selectedManager}
      />
    </div>
  );
};

export default AdminManagerManagement;
