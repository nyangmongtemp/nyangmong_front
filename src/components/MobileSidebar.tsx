
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileSidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showInfoSubmenu, setShowInfoSubmenu] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { name: '분양게시판', href: '#' },
    { 
      name: '정보게시판', 
      href: '#',
      submenu: [
        { name: '질문게시판', href: '#' },
        { name: '우리아이 소개 게시판', href: '#' },
        { name: '후기게시판', href: '#' }
      ]
    },
    { name: '자유게시판', href: '#' },
    { name: '행사게시판', href: '#' },
    { name: '지도', href: '#', icon: MapPin }
  ];

  const handleLogin = () => {
    if (loginData.email === 'test1' && loginData.password === 'test1234') {
      setIsLoggedIn(true);
    } else {
      alert('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ email: '', password: '' });
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="space-y-6 p-4">
      {/* 모바일 네비게이션 */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">메뉴</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <div key={category.name}>
              {category.submenu ? (
                <>
                  <button
                    onClick={() => setShowInfoSubmenu(!showInfoSubmenu)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <span>{category.name}</span>
                    {showInfoSubmenu ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  {showInfoSubmenu && (
                    <div className="ml-4 space-y-1">
                      {category.submenu.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block p-2 rounded-lg hover:bg-orange-50 transition-colors text-sm text-gray-600"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={category.href}
                  className="block p-3 rounded-lg hover:bg-orange-50 transition-colors flex items-center space-x-2"
                >
                  {category.icon && <category.icon className="h-4 w-4" />}
                  <span>{category.name}</span>
                </a>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 로그인 폼 */}
      <Card className="border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-orange-50">
          <CardTitle className="text-center text-gray-800">
            {isLoggedIn ? '내 정보' : '로그인'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoggedIn ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">{loginData.email}</p>
                <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>하트 ❤️ 0</span>
                  <span>랭킹 3672위</span>
                  <span>구독자 0명</span>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                로그아웃
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <div className="space-y-2">
                <Label htmlFor="mobile-email" className="text-sm font-medium">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="mobile-email"
                    type="text"
                    placeholder="아이디를 입력하세요"
                    className="pl-10"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobile-password" className="text-sm font-medium">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="mobile-password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    className="pl-10"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500">
                로그인
              </Button>
              
              <Button 
                type="button"
                onClick={handleSignupClick}
                variant="outline" 
                className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                회원가입
              </Button>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600 text-center">소셜 로그인</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400">
                    카카오 로그인
                  </Button>
                  <Button variant="outline" className="w-full bg-green-500 hover:bg-green-600 text-white border-green-500">
                    네이버 로그인
                  </Button>
                  <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                    구글 로그인
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileSidebar;
