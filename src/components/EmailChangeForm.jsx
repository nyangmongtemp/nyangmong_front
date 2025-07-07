
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

const EmailChangeForm = ({ currentEmail }) => {
  const [formData, setFormData] = useState({
    newEmail: "",
    verificationCode: "",
  });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

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
      // 이메일 인증 코드 발송 API 호출
      setIsEmailSent(true);
      alert("인증 코드가 새 이메일로 발송되었습니다.");
    } catch (error) {
      console.error("이메일 발송 실패:", error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      // 인증 코드 확인 API 호출
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

    try {
      // 이메일 변경 API 호출
      console.log("이메일 변경:", formData);
      alert("이메일이 성공적으로 변경되었습니다.");
      setFormData({
        newEmail: "",
        verificationCode: "",
      });
      setIsEmailSent(false);
      setIsCodeVerified(false);
    } catch (error) {
      console.error("이메일 변경 실패:", error);
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="newEmail" className="text-sm font-medium flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              새 이메일
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

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500"
              disabled={!isCodeVerified}
            >
              이메일 변경하기
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailChangeForm;
