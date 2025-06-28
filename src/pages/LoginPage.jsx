import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

const LoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 로그인, 2: 2차 인증
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    verificationCode: "",
  });
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    // 로그인 성공 후 2차 인증 단계로 이동
    setStep(2);
  };

  const handleSendVerificationCode = () => {
    // 백엔드로 인증번호 발송 요청
    console.log("인증번호 발송 요청");
    setIsCodeSent(true);
    alert("인증번호가 이메일로 발송되었습니다.");
  };

  const handleVerification = (e) => {
    e.preventDefault();
    if (!formData.verificationCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }
    // 인증 성공 후 관리자 페이지로 이동
    console.log("2차 인증 완료");
    navigate("/admin");
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
          <CardHeader className="bg-gradient-to-r from-blue-50 to-gray-50">
            <CardTitle className="text-center text-gray-800 text-xl">
              로그인
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {step === 1 ? (
              // 1단계: 로그인
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id" className="text-sm font-medium">
                    아이디
                  </Label>
                  <Input
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    className="border-gray-300"
                    placeholder="아이디를 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    비밀번호
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-gray-300"
                    placeholder="비밀번호를 입력하세요"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    로그인
                  </Button>
                </div>
              </form>
            ) : (
              // 2단계: 2차 인증
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    2차인증 번호
                  </h3>
                  <p className="text-sm text-gray-600">
                    등록된 이메일로 인증번호를 발송해드립니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="verificationCode"
                    className="text-sm font-medium"
                  >
                    인증번호 입력
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="verificationCode"
                      name="verificationCode"
                      value={formData.verificationCode}
                      onChange={handleInputChange}
                      className="border-gray-300"
                      placeholder="인증번호 6자리"
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      onClick={handleSendVerificationCode}
                      className="bg-gray-500 hover:bg-gray-600 whitespace-nowrap"
                      disabled={isCodeSent}
                    >
                      {isCodeSent ? "발송완료" : "인증번호 발송"}
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleVerification}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    로그인 버튼
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
