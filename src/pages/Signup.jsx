import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, USER } from "../../configs/host-config";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToMarketing: false,
  });

  const [authCodeSent, setAuthCodeSent] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [inputAuthCode, setInputAuthCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // 입력 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 체크박스 처리 수정
  const handleCheckboxChange = (name) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // 인증코드 발송 버튼 클릭 시
  const handleSendAuthCode = async (e) => {
    try {
      const res = await axiosInstance.get(
        `${API_BASE_URL}${USER}/verify-email?email=${formData.email}`
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  // 인증하기 버튼 클릭 시
  const handleVerifyCode = async (e) => {
    try {
      const res = await axiosInstance.post(
        `${API_BASE_URL}${USER}/verify-code`,
        {
          email: formData.email,
          authCode: inputAuthCode,
        }
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("회원가입 데이터:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 뒤로 가기 */}
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>메인으로 돌아가기</span>
          </Link>
        </div>

        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">냥</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              냥몽
            </h1>
          </div>
          <p className="text-gray-600">
            반려동물과 함께하는 따뜻한 커뮤니티에 가입하세요
          </p>
        </div>

        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-pink-50">
            <CardTitle className="text-center text-gray-800 text-xl">
              회원가입
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  이름
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="이름을 입력하세요"
                    className="pl-10"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* 이메일 입력 */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      이메일
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="이메일을 입력하세요"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isEmailVerified}
                      />
                    </div>
                    {!isEmailVerified && (
                      <Button
                        type="button"
                        onClick={handleSendAuthCode}
                        className="mt-2 text-sm"
                      >
                        인증코드 발송
                      </Button>
                    )}
                  </div>

                  {/* 인증 코드 입력 */}
                  {!isEmailVerified && authCodeSent && (
                    <div className="space-y-2">
                      <Label htmlFor="authCode" className="text-sm font-medium">
                        인증코드
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="authCode"
                          type="text"
                          placeholder="인증코드를 입력하세요"
                          value={inputAuthCode}
                          onChange={(e) => setInputAuthCode(e.target.value)}
                        />
                        <Button type="button" onClick={handleVerifyCode}>
                          인증하기
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>

              {/* 전화번호 */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  전화번호
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="전화번호를 입력하세요"
                    className="pl-10"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* 비밀번호 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  비밀번호
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  비밀번호 확인
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("agreeToTerms")
                    }
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    <span className="text-red-500">*</span> 이용약관에
                    동의합니다
                    <button
                      type="button"
                      className="text-orange-500 hover:underline ml-1"
                    >
                      (보기)
                    </button>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToPrivacy"
                    checked={formData.agreeToPrivacy}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("agreeToPrivacy")
                    }
                  />
                  <Label htmlFor="agreeToPrivacy" className="text-sm">
                    <span className="text-red-500">*</span> 개인정보 처리방침에
                    동의합니다
                    <button
                      type="button"
                      className="text-orange-500 hover:underline ml-1"
                    >
                      (보기)
                    </button>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToMarketing"
                    checked={formData.agreeToMarketing}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("agreeToMarketing")
                    }
                  />
                  <Label htmlFor="agreeToMarketing" className="text-sm">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </Label>
                </div>
              </div>

              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 mt-6"
                disabled={!formData.agreeToTerms || !formData.agreeToPrivacy}
              >
                회원가입
              </Button>
            </form>

            {/* 소셜 회원가입 */}
            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    또는 소셜 계정으로 가입
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400"
                >
                  카카오로 시작하기
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-green-500 hover:bg-green-600 text-white border-green-500"
                >
                  네이버로 시작하기
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                >
                  구글로 시작하기
                </Button>
              </div>
            </div>

            {/* 로그인 링크 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{" "}
                <Link
                  to="/"
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  로그인하기
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
