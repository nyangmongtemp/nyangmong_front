import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, USER } from "../../configs/host-config";
import { useNavigate } from "react-router-dom";

const PasswordResetForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
  });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendEmail = async () => {
    if (!formData.email) {
      alert("이메일 주소를 입력해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}${USER}/forget/${formData.email}`
      );
      console.log(response);

      setIsEmailSent(true);
      alert("인증 코드가 이메일로 발송되었습니다.");
    } catch (error) {
      console.error("이메일 발송 실패:", error);
      alert(error.response?.message);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}${USER}/forget/auth`,
        {
          email: formData.email,
          authCode: formData.verificationCode,
        }
      );
      setIsCodeVerified(true);
      console.log(response);

      alert("임시비밀번호가 이메일로 전송되었습니다.");
    } catch (error) {
      alert(error.response?.message);
      console.error("인증 실패:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isCodeVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    try {
      // 임시 비밀번호 발급 API 호출
      console.log("임시 비밀번호 발급:", formData);
      alert("임시 비밀번호가 이메일로 발송되었습니다.");
      onClose();
    } catch (error) {
      alert(error.response?.message);
      console.error("임시 비밀번호 발급 실패:", error);
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="text-center text-gray-800 text-xl flex items-center justify-center">
          <Lock className="w-5 h-5 mr-2" />
          비밀번호 찾기
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium flex items-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              이메일 주소
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border-gray-300"
              placeholder="가입한 이메일 주소를 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              이메일 인증
            </Label>
            <Input
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              placeholder="인증 코드 입력"
              className="border-gray-300"
              disabled={!isEmailSent}
            />
            <div className="flex space-x-2 pt-2">
              <Button
                type="button"
                onClick={handleSendEmail}
                disabled={isEmailSent || !formData.email}
                className="bg-purple-500 hover:bg-purple-600 whitespace-nowrap"
              >
                {isEmailSent ? "발송완료" : "인증발송"}
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

          {/* <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500"
              disabled={!isCodeVerified}
            >
              임시 비밀번호 발급
            </Button>
          </div> */}
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordResetForm;
