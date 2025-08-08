import React, { useState } from "react";
import { Menu, MapPin, ChevronDown, User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import MobileSidebar from "@/components/MobileSidebar";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const categories = [
    { name: "분양게시판", href: "/adoption" },
    {
      name: "정보게시판",
      href: "/",
      submenu: [
        { name: "질문게시판", href: "/board/question" },
        { name: "우리아이 소개 게시판", href: "/board/introduction" },
        { name: "후기게시판", href: "/board/review" },
      ],
    },
    { name: "자유게시판", href: "/board/free" },
    { name: "행사게시판", href: "/board/event" },
    { name: "지도", href: "/map", icon: MapPin },
  ];

  const handleLogin = (email, password) => {
    if (email === "test1" && password === "test1234") {
      setIsLoggedIn(true);
      setCurrentUser({ id: "test1", name: "test1" });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <header className="bg-white shadow-sm border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
                <img
                  src="https://nyangmong-prod-images.s3.ap-northeast-2.amazonaws.com/f94dedc4-8303-4681-90af-d29329d81185_profile.jpg"
                  alt="냥몽 로고"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                냥몽
              </h1>
            </button>
          </div>

          <nav className="hidden lg:flex space-x-6">
            {categories.map((category) =>
              category.submenu ? (
                <DropdownMenu key={category.name}>
                  <DropdownMenuTrigger className="text-gray-700 hover:text-orange-500 transition-colors font-medium flex items-center space-x-1">
                    <span>{category.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border border-orange-200 shadow-lg z-50">
                    {category.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.name}>
                        <a
                          href={subItem.href}
                          className="text-gray-700 hover:text-orange-500"
                        >
                          {subItem.name}
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  key={category.name}
                  onClick={() =>
                    category.href !== "#" && navigate(category.href)
                  }
                  className="text-gray-700 hover:text-orange-500 transition-colors font-medium flex items-center space-x-1"
                >
                  {category.icon && <category.icon className="h-4 w-4" />}
                  <span>{category.name}</span>
                </button>
              )
            )}
          </nav>
          {/* 모바일 메뉴 (사이드바가 사라질 때 보임) */}
          <div className="block lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 rounded-md hover:bg-orange-50">
                  <Menu className="h-6 w-6 text-gray-700" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <MobileSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
