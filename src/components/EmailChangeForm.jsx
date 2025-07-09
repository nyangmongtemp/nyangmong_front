import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, USER } from "../../configs/host-config";
import { useAuth } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const EmailChangeForm = ({ currentEmail }) => {
  const [formData, setFormData] = useState({
    newEmail: "",
    verificationCode: "",
  });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isSending, setIsSending] = useState(false); // 추가

  const { token, isLoggedIn, logout } = useAuth();

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendEmail = async () => {
    if (!formData.newEmail) {
      alert("새 이메일 주소를 입력해주세요.");
      return;
    }

    try {
      setIsSending(true);
      const res = await axiosInstance.get(
        `${API_BASE_URL}${USER}/modify-email?newEmail=${formData.newEmail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);

      setIsEmailSent(true);
    } catch (error) {
      console.error("이메일 발송 실패:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axiosInstance.patch(
        `${API_BASE_URL}${USER}/verify-new-email`,
        {
          email: formData.newEmail,
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
      alert("이메일 변경이 완료되었습니다.");
      logout();
      navigate("/");
    } catch (error) {
      console.error("인증 실패:", error);
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle className="text-center text-gray-800 text-xl">
          이메일 변경
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            현재 이메일
          </Label>
          <Input
            value={currentEmail}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="newEmail"
            className="text-sm font-medium flex items-center"
          >
            <Mail className="w-4 h-4 mr-2" />새 이메일
          </Label>
          <Input
            id="newEmail"
            name="newEmail"
            type="email"
            value={formData.newEmail}
            onChange={handleInputChange}
            className="border-gray-300"
            placeholder="새 이메일 주소를 입력하세요"
          />
        </div>

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
              disabled={isEmailSent || !formData.newEmail}
              className="bg-blue-500 hover:bg-blue-600 whitespace-nowrap"
            >
              {isSending ? "발송중..." : isEmailSent ? "발송완료" : "인증발송"}
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
      </CardContent>
    </Card>
  );
};

export default EmailChangeForm;
