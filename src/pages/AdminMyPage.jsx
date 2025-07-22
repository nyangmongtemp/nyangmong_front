import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import EmailChangeModal from "../components/EmailChangeModal";
import PasswordChangeModal from "../components/PasswordChangeModal";

// JWT 디코딩 함수 (jwt-decode 없이 직접 구현)
function parseJwt(token) {
  if (!token) return {};
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
}

const AdminMyPage = () => {
  const navigate = useNavigate();

  // 세션스토리지에서 관리자 정보 가져오기
  const adminEmail = sessionStorage.getItem("adminEmail") || "";
  const adminName = sessionStorage.getItem("adminName") || "";
  const adminRole = sessionStorage.getItem("adminRole") || "";
  const adminToken = sessionStorage.getItem("adminToken") || "";

  // 토큰에서 adminId, role, email 추출
  const { adminId = "", role = "", email = "" } = parseJwt(adminToken);

  const [formData, setFormData] = useState({
    adminId: adminId,
    name: adminName,
    email: adminEmail || email,
    phone: "", // 별도 API 필요시 더미 유지
    password: "",
    confirmPassword: "",
    role: adminRole || role,
    isFirst: "", // 최초 로그인 여부는 별도 값 필요시 추가
    number: "", // 인증번호
  });

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [pwModalOpen, setPwModalOpen] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      adminId: adminId,
      name: adminName,
      email: adminEmail || email,
      role: adminRole || role,
    }));
    // eslint-disable-next-line
  }, [adminId, adminName, adminEmail, adminRole, email, role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 이메일 변경 성공 시 로그아웃 및 세션스토리지 비우기
  const handleEmailChangeSuccess = (newEmail) => {
    sessionStorage.clear();
    window.location.href = "/admin/login";
  };
  // 비밀번호 변경 성공 시 안내 (추후 AlertDialog 등으로 안내 가능)
  const handlePwChangeSuccess = () => {
    alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인 해주세요.");
    sessionStorage.clear();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <AdminSidebar />
      <div className="w-full max-w-md">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>뒤로가기</span>
          </button>
        </div>

        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50">
            <CardTitle className="text-center text-gray-800 text-xl">
              마이페이지
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form className="space-y-4">
              {/* 권한 (읽기전용) */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  권한
                </Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* 이름 (읽기전용) */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  이름
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* 이메일 (수정가능) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  이메일
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-gray-300"
                />
              </div>
              {/* 전화번호 (수정가능) */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  전화번호
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border-gray-300"
                />
              </div>

              {/* 최초 로그인 여부 (읽기전용, 값 없으면 숨김) */}
              {formData.isFirst && (
                <div className="space-y-2">
                  <Label htmlFor="isFirst" className="text-sm font-medium">
                    최초 로그인 여부
                  </Label>
                  <Input
                    id="isFirst"
                    name="isFirst"
                    value={formData.isFirst}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              )}
              {/* 이메일 변경 버튼 */}
              <div className="pt-4">
                <Button
                  type="button"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => setEmailModalOpen(true)}
                >
                  이메일 변경하기
                </Button>
              </div>
              {/* 비밀번호 변경 버튼 */}
              <div className="pt-4">
                <Button
                  type="button"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => setPwModalOpen(true)}
                >
                  비밀번호 변경하기
                </Button>
              </div>
              {/* 수정하기 버튼 */}
              <div className="pt-4">
                <Button
                  type="button"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => setPwModalOpen(true)}
                >
                  수정하기
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        {/* 이메일 변경 모달 */}
        <EmailChangeModal
          open={emailModalOpen}
          onOpenChange={setEmailModalOpen}
          onSuccess={handleEmailChangeSuccess}
        />
        {/* 비밀번호 변경 모달 */}
        <PasswordChangeModal
          open={pwModalOpen}
          onOpenChange={setPwModalOpen}
          email={formData.email}
          onSuccess={handlePwChangeSuccess}
        />
      </div>
    </div>
  );
};

export default AdminMyPage;
