import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

const MyPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "홍길동", // 수정 불가능한 기본값
    email: "user@example.com", // 기본값으로 설정
    phone: "010-0000-0000",
    password: "",
    confirmPassword: "",
    role: "사용자", // 수정 불가능한 기본값
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log("수정된 정보:", formData);
    alert("정보가 수정되었습니다.");
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이름 (수정 불가) */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  이름 (펠트)
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* 이메일 (수정 가능) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  이메일 (수정가능)
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

              {/* 전화번호 (수정 가능) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  전화번호 (수정가능)
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

              {/* 비밀번호 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  비밀번호 (변경 시 입력)
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border-gray-300"
                />
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  비밀번호 확인 (변경 시 입력)
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="border-gray-300"
                />
              </div>

              {/* 권한 (수정 불가) */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  나의 권한 확인 (수정 불가)
                </Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* 수정하기 버튼 */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  수정하기
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyPage;
