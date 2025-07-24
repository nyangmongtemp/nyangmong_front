import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAdmin } from "../context/AdminContext";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, ADMIN } from "../../configs/host-config";

const AdminManagerManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [managers, setManagers] = useState([]); // 실제 데이터로 대체
  const { role, isLoggedIn } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem("adminRole");
    const forceEmailChange = sessionStorage.getItem("forceEmailChange");
    if (forceEmailChange) {
      alert("이메일 변경을 완료해야 다른 기능을 이용할 수 있습니다.");
      navigate("/admin/mypage", { replace: true });
      return;
    }
    if (role !== "BOSS") {
      alert("권한이 없습니다.");
      navigate("/admin", { replace: true });
      return;
    }
  }, [navigate]);

  // 관리자 목록 조회
  useEffect(() => {
    const role = sessionStorage.getItem("adminRole");
    if (role !== "BOSS") return; // BOSS가 아니면 목록조회 실행 안함
    const fetchManagers = async () => {
      try {
        const token = sessionStorage.getItem("adminToken");
        const res = await axiosInstance.get(`${API_BASE_URL}${ADMIN}/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setManagers(res.data.content || []);
      } catch (error) {
        alert("관리자 목록을 불러오지 못했습니다.");
      }
    };
    fetchManagers();
  }, []);

  // DEBUG: 콘솔에 현재 role, isLoggedIn 출력
  console.log(
    "AdminManagerManagement: role =",
    role,
    "isLoggedIn =",
    isLoggedIn
  );

  const handleEdit = (manager) => {
    setSelectedManager(manager);
    setIsEditModalOpen(true);
  };

  const handleDelete = (manager) => {
    setSelectedManager(manager);
    setIsDeleteModalOpen(true);
  };

  // 드롭다운 변경 핸들러 추가
  const handleRoleOrActiveChange = async (adminId, newRole, newActive) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      await axiosInstance.patch(
        `${API_BASE_URL}${ADMIN}/role-modify`,
        {
          adminId,
          role: newRole,
          active: newActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("권한/활성화 상태가 수정되었습니다.");
      setManagers((prev) =>
        prev.map((m) =>
          m.adminId === adminId ? { ...m, role: newRole, active: newActive } : m
        )
      );
    } catch (error) {
      alert("수정에 실패했습니다.");
    }
  };

  // 관리자 등록 버튼 노출 조건: 세션스토리지의 adminRole이 BOSS
  const isBoss = isLoggedIn && sessionStorage.getItem("adminRole") === "BOSS";

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
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {managers.map((manager) => (
                  <div
                    key={manager.adminId}
                    className="flex flex-col bg-white border rounded-lg shadow p-5 h-full"
                  >
                    <div className="mb-2 font-semibold text-gray-800">
                      {manager.name}
                    </div>
                    <div className="mb-2 text-gray-600">{manager.phone}</div>
                    <div className="mb-2">
                      <Select
                        defaultValue={manager.role}
                        onValueChange={(value) =>
                          handleRoleOrActiveChange(
                            manager.adminId,
                            value,
                            manager.active
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BOSS">BOSS</SelectItem>
                          <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                          <SelectItem value="CONTENT">CONTENT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mb-2">
                      <Select
                        defaultValue={manager.active ? "활성" : "비활성"}
                        onValueChange={(value) =>
                          handleRoleOrActiveChange(
                            manager.adminId,
                            manager.role,
                            value === "활성"
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="활성">활성</SelectItem>
                          <SelectItem value="비활성">비활성</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      className="mt-auto w-full"
                      onClick={() => handleEdit(manager)}
                    >
                      수정
                    </Button>
                  </div>
                ))}
              </div>
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
