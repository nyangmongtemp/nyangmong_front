
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock } from 'lucide-react';

const AuthSidebar = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="space-y-6">
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-blue-50">
          <CardTitle className="text-center text-gray-800">
            {isLogin ? '로그인' : '회원가입'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <form className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">이름</Label>
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
              <Label htmlFor="email" className="text-sm font-medium">이메일</Label>
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
              <Label htmlFor="password" className="text-sm font-medium">비밀번호</Label>
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
              {isLogin ? '로그인' : '회원가입'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isLogin ? '회원가입하기' : '로그인하기'}
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
          <Button variant="outline" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50">
            펫 등록하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthSidebar;
