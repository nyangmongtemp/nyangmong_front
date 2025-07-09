import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../context/UserContext";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, USER } from "../../configs/host-config";
import { useNavigate } from "react-router-dom";

const PasswordChangeForm = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isSending, setIsSending] = useState(false); // 추가

  const { isLoggedIn, logout, token, email } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendEmail = async () => {
    // 이메일 인증 코드 발송 API 호출
    try {
      setIsSending(true);
      setIsEmailSent(true);
      const res = await axiosInstance.get(
        `${API_BASE_URL}${USER}/new-password-req`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
    } catch (error) {
      console.error("이메일 발송 실패:", error);
      setIsEmailSent(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    // 인증 코드 확인 API 호출
    try {
      const res = await axiosInstance.post(
        `${API_BASE_URL}${USER}/verify-new-password`,
        {
          authCode: formData.verificationCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);

      setIsCodeVerified(true);
      alert("인증이 완료되었습니다.");
    } catch (error) {
      console.error("인증 실패:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isCodeVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await axiosInstance.patch(
        `${API_BASE_URL}${USER}/modify-password`,
        {
          password: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);

      console.log("비밀번호 변경:", formData);
      alert("비밀번호가 성공적으로 변경되었습니다.");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        verificationCode: "",
      });
      setIsEmailSent(false);
      setIsCodeVerified(false);
      logout();
      navigate("/");
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardTitle className="text-center text-gray-800 text-xl">
          비밀번호 변경
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              이메일 인증
            </Label>
            <div className="flex space-x-2">
              <Input
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                placeholder="인증 코드 입력"
                className="border-gray-300"
                disabled={!isEmailSent}
              />
              <Button
                type="button"
                onClick={handleSendEmail}
                disabled={isEmailSent}
                className="bg-orange-500 hover:bg-orange-600 whitespace-nowrap"
              >
                {isSending
                  ? "발송중..."
                  : isEmailSent
                  ? "발송완료"
                  : "인증발송"}
              </Button>
              {isEmailSent && !isCodeVerified && (
                <Button
                  type="button"
                  onClick={handleVerifyCode}
                  className="bg-green-500 hover:bg-green-600 whitespace-nowrap"
                >
                  인증확인
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="text-sm font-medium flex items-center"
            >
              <Lock className="w-4 h-4 mr-2" />새 비밀번호
            </Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="border-gray-300"
              placeholder="새 비밀번호를 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium flex items-center"
            >
              <Lock className="w-4 h-4 mr-2" />새 비밀번호 확인
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="border-gray-300"
              placeholder="새 비밀번호를 다시 입력하세요"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-400 to-orange-400 hover:from-red-500 hover:to-orange-500"
              disabled={!isCodeVerified}
            >
              비밀번호 변경하기
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordChangeForm;
