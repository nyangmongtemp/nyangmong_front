import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, ADMIN } from "../../configs/host-config";

const LoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 로그인, 2: 2차 인증
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    verificationCode: "",
  });
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState(""); // 인증 단계에서 사용할 이메일
  const [currentPassword, setCurrentPassword] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // 1단계: 로그인 요청 (이메일 인증번호 발송)
      const response = await axiosInstance.post(
        `${API_BASE_URL}${ADMIN}/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("로그인 응답:", response.data);

      // 인증번호가 응답에 포함되어 있음 (개발용)
      if (response.data.result) {
        alert(
          `인증번호가 이메일로 발송되었습니다.\n개발용 인증번호: ${response.data.result}`
        );
      } else {
        alert("인증번호가 이메일로 발송되었습니다.");
      }

      setCurrentEmail(formData.email);
      setCurrentPassword(formData.password);
      setStep(2);
      setIsCodeSent(true);
    } catch (error) {
      console.error("로그인 실패:", error);

      // 실패 횟수에 따른 알림
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message || "로그인에 실패했습니다.";

        if (errorMessage.includes("차단") || errorMessage.includes("blocked")) {
          alert(
            "로그인 시도가 3회 초과되어 30분간 로그인이 차단되었습니다.\n30분 후에 다시 시도해주세요."
          );
        } else if (
          errorMessage.includes("비밀번호") ||
          errorMessage.includes("password")
        ) {
          alert(
            "비밀번호가 일치하지 않습니다.\n잘못된 시도가 누적되면 30분간 로그인이 차단됩니다."
          );
        } else if (
          errorMessage.includes("회원가입") ||
          errorMessage.includes("not found")
        ) {
          alert("등록되지 않은 이메일입니다.");
        } else {
          alert(`로그인 실패: ${errorMessage}`);
        }
      } else {
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerificationCode = async () => {
    if (!currentEmail) {
      alert("이메일 정보가 없습니다. 다시 로그인해주세요.");
      setStep(1);
      return;
    }

    setIsLoading(true);
    try {
      // 인증번호 재발송 요청
      const response = await axiosInstance.post(
        `${API_BASE_URL}${ADMIN}/login`,
        {
          email: currentEmail,
          password: formData.password,
        }
      );

      if (response.data.result) {
        alert(
          `인증번호가 재발송되었습니다.\n개발용 인증번호: ${response.data.result}`
        );
      } else {
        alert("인증번호가 재발송되었습니다.");
      }
    } catch (error) {
      console.error("인증번호 재발송 실패:", error);

      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message || "인증번호 발송에 실패했습니다.";

        if (errorMessage.includes("차단") || errorMessage.includes("blocked")) {
          alert(
            "인증번호 발송이 3회 초과되어 30분간 차단되었습니다.\n30분 후에 다시 시도해주세요."
          );
        } else {
          alert(`인증번호 발송 실패: ${errorMessage}`);
        }
      } else {
        alert("인증번호 발송 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!formData.verificationCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // 2단계: 인증번호 검증
      const response = await axiosInstance.post(
        `${API_BASE_URL}${ADMIN}/verify-code`,
        {
          email: currentEmail,
          password: currentPassword,
          authCode: formData.verificationCode,
        }
      );

      console.log("인증 성공:", response.data);

      // 로그인 성공 시 세션스토리지에 관리자 정보 저장
      if (response.data.result) {
        const adminData = response.data.result;
        sessionStorage.setItem("adminToken", adminData.token);
        sessionStorage.setItem("adminEmail", adminData.email);
        sessionStorage.setItem("adminName", adminData.name);
        sessionStorage.setItem("adminRole", adminData.role);

        alert("로그인이 완료되었습니다.");
        navigate("/admin");
      }
    } catch (error) {
      console.error("인증 실패:", error);

      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message || "인증에 실패했습니다.";

        if (errorMessage.includes("만료") || errorMessage.includes("expired")) {
          alert("인증번호가 만료되었습니다.\n새로운 인증번호를 발송해주세요.");
          setIsCodeSent(false);
        } else if (
          errorMessage.includes("일치") ||
          errorMessage.includes("match")
        ) {
          alert(
            "인증번호가 일치하지 않습니다.\n잘못된 시도가 누적되면 30분간 로그인이 차단됩니다."
          );
        } else {
          alert(`인증 실패: ${errorMessage}`);
        }
      } else {
        alert("인증 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep(1);
    setIsCodeSent(false);
    setCurrentEmail("");
    setFormData({
      email: "",
      password: "",
      verificationCode: "",
    });
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
              관리자 로그인
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {step === 1 ? (
              // 1단계: 로그인
              <form onSubmit={handleLogin} className="space-y-4">
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
                    placeholder="이메일을 입력하세요"
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
                    disabled={isLoading}
                  >
                    {isLoading ? "처리 중..." : "로그인"}
                  </Button>
                </div>
              </form>
            ) : (
              // 2단계: 2차 인증
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    이메일 인증
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentEmail}로 인증번호를 발송했습니다.
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
                      disabled={isCodeSent || isLoading}
                    >
                      {isLoading
                        ? "처리 중..."
                        : isCodeSent
                        ? "재발송"
                        : "인증번호 발송"}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button
                    onClick={handleVerification}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "인증 중..." : "로그인 완료"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleBackToLogin}
                    variant="outline"
                    className="w-full"
                  >
                    로그인으로 돌아가기
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
