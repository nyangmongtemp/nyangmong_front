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
  const [tempChanges, setTempChanges] = useState({}); // 임시 변경사항 저장
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

  const handleEdit = async (manager) => {
    const changes = tempChanges[manager.adminId];

    // 임시 변경사항이 있으면 확인 얼럿
    if (
      changes &&
      (changes.role !== undefined || changes.active !== undefined)
    ) {
      const confirmMessage =
        `다음 변경사항을 저장하시겠습니까?\n` +
        `${
          changes.role !== undefined
            ? `권한: ${manager.role} → ${changes.role}\n`
            : ""
        }` +
        `${
          changes.active !== undefined
            ? `활성화: ${manager.active ? "활성" : "비활성"} → ${
                changes.active ? "활성" : "비활성"
              }`
            : ""
        }`;

      if (window.confirm(confirmMessage)) {
        await handleSaveChanges(manager);
      }
    } else {
      // 기존 수정 모달 열기
      setSelectedManager(manager);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (manager) => {
    setSelectedManager(manager);
    setIsDeleteModalOpen(true);
  };

  // 드롭다운 변경 핸들러 수정 - 임시 저장만
  const handleRoleOrActiveChange = (adminId, field, value) => {
    setTempChanges((prev) => ({
      ...prev,
      [adminId]: {
        ...prev[adminId],
        [field]: value,
      },
    }));
  };

  // 수정 버튼 클릭 핸들러
  const handleSaveChanges = async (manager) => {
    const changes = tempChanges[manager.adminId];
    if (!changes) {
      alert("변경사항이 없습니다.");
      return;
    }

    try {
      const token = sessionStorage.getItem("adminToken");
      await axiosInstance.patch(
        `${API_BASE_URL}${ADMIN}/role-modify`,
        {
          adminId: manager.adminId,
          role: changes.role || manager.role,
          active:
            changes.active !== undefined ? changes.active : manager.active,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("권한/활성화 상태가 수정되었습니다.");

      // 성공 시 로컬 상태 업데이트
      setManagers((prev) =>
        prev.map((m) =>
          m.adminId === manager.adminId
            ? {
                ...m,
                role: changes.role || m.role,
                active:
                  changes.active !== undefined ? changes.active : m.active,
              }
            : m
        )
      );

      // 임시 변경사항 제거
      setTempChanges((prev) => {
        const newChanges = { ...prev };
        delete newChanges[manager.adminId];
        return newChanges;
      });
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
            {/* 관리자 목록 테이블 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이름
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      전화번호
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      권한
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      활성화 상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      수정
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {managers.map((manager) => (
                    <tr key={manager.adminId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {manager.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {manager.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Select
                          defaultValue={manager.role}
                          value={
                            tempChanges[manager.adminId]?.role || manager.role
                          }
                          onValueChange={(value) =>
                            handleRoleOrActiveChange(
                              manager.adminId,
                              "role",
                              value
                            )
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BOSS">BOSS</SelectItem>
                            <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                            <SelectItem value="CONTENT">CONTENT</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Select
                          defaultValue={manager.active ? "활성" : "비활성"}
                          value={
                            tempChanges[manager.adminId]?.active !== undefined
                              ? tempChanges[manager.adminId].active
                                ? "활성"
                                : "비활성"
                              : manager.active
                              ? "활성"
                              : "비활성"
                          }
                          onValueChange={(value) =>
                            handleRoleOrActiveChange(
                              manager.adminId,
                              "active",
                              value === "활성"
                            )
                          }
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="활성">활성</SelectItem>
                            <SelectItem value="비활성">비활성</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(manager)}
                        >
                          수정
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
