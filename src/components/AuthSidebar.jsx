import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/UserContext";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, USER } from "../../configs/host-config";

const AuthSidebar = () => {
  const { token, isLoggedIn, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isLoggedIn) {
        // 로그인 요청
        const response = await axiosInstance.post(
          `${API_BASE_URL}${USER}/login`,
          {
            email,
            password,
          }
        );

        // 예시: useAuth에서 로그인 처리 (토큰 저장 등)
        user.login(response.data);
      } else {
        // 회원가입 요청
        const response = await axios.post(`${API_BASE_URL}${USER}/craete`, {
          email,
          password,
        });

        // 회원가입 후 로그인 페이지로 전환
        setIsLogin(true);
      }
    } catch (error) {
      console.error("요청 실패", error.response?.data || error.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-blue-50">
          <CardTitle className="text-center text-gray-800">
            {isLoggedIn ? "로그인" : "회원가입"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <form className="space-y-4">
            {!isLoggedIn && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  이름
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="이름을 입력하세요"
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                이메일
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="pl-10"
                />
              </div>
            </div>

            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              {isLoggedIn ? "로그인" : "회원가입"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isLoggedIn ? "회원가입하기" : "로그인하기"}
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-orange-50">
          <CardTitle className="text-center text-gray-800">펫 등록</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-gray-600 text-center mb-4">
            우리 펫을 자랑해보세요!
          </p>
          <Button
            variant="outline"
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            펫 등록하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthSidebar;
