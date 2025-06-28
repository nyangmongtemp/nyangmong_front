
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Lock, Calendar, Heart, MessageCircle, FileText, Star } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const UserMyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: "홍길동",
    email: "user@example.com",
    phone: "010-1234-5678",
    password: "",
    confirmPassword: "",
    joinDate: "2024-01-15",
  });

  // 더미 데이터
  const myPosts = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    title: `내가 작성한 게시글 ${i + 1}`,
    category: ["자유게시판", "질문게시판", "후기게시판"][i % 3],
    date: `2024-06-${String(20 - (i % 20)).padStart(2, '0')}`,
    views: Math.floor(Math.random() * 100) + 10,
    likes: Math.floor(Math.random() * 20),
    comments: Math.floor(Math.random() * 15),
  }));

  const myComments = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    postTitle: `댓글을 단 게시글 ${i + 1}`,
    comment: `이것은 제가 작성한 댓글입니다. ${i + 1}번째 댓글입니다.`,
    date: `2024-06-${String(25 - (i % 25)).padStart(2, '0')}`,
  }));

  const likedPosts = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    title: `좋아요한 게시글 ${i + 1}`,
    author: `작성자${i + 1}`,
    date: `2024-06-${String(15 - (i % 15)).padStart(2, '0')}`,
    likes: Math.floor(Math.random() * 50) + 5,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log("수정된 정보:", formData);
    alert("정보가 수정되었습니다.");
  };

  const getDisplayData = () => {
    let data = [];
    switch (activeTab) {
      case "posts":
        data = myPosts;
        break;
      case "comments":
        data = myComments;
        break;
      case "likes":
        data = likedPosts;
        break;
      default:
        return [];
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = () => {
    let totalItems = 0;
    switch (activeTab) {
      case "posts":
        totalItems = myPosts.length;
        break;
      case "comments":
        totalItems = myComments.length;
        break;
      case "likes":
        totalItems = likedPosts.length;
        break;
      default:
        totalItems = 0;
    }
    return Math.ceil(totalItems / itemsPerPage);
  };

  const renderTabContent = () => {
    const displayData = getDisplayData();
    
    if (activeTab === "profile") {
      return (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50">
            <CardTitle className="text-center text-gray-800 text-xl">
              프로필 정보 수정
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  이름
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  이메일
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  전화번호
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  새 비밀번호 (변경 시 입력)
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  비밀번호 확인
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  가입일
                </Label>
                <Input
                  value={formData.joinDate}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500"
                >
                  정보 수정하기
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      );
    }

    if (activeTab === "posts") {
      return (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-pink-50">
            <CardTitle className="text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              내가 작성한 게시글 ({myPosts.length}개)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {displayData.map((post) => (
                <div
                  key={post.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{post.date}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2 hover:text-orange-600 transition-colors">
                    {post.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>조회 {post.views}</span>
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {post.likes}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (activeTab === "comments") {
      return (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="text-gray-800 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              내가 작성한 댓글 ({myComments.length}개)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {displayData.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {comment.postTitle}
                    </h4>
                    <span className="text-xs text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (activeTab === "likes") {
      return (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-red-50">
            <CardTitle className="text-gray-800 flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              좋아요한 게시글 ({likedPosts.length}개)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {displayData.map((post) => (
                <div
                  key={post.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">by {post.author}</span>
                    <span className="text-xs text-gray-500">{post.date}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2 hover:text-pink-600 transition-colors">
                    {post.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <Heart className="w-3 h-3 mr-1 text-red-500" />
                    <span>{post.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <div className="w-80 flex-shrink-0">
          <Sidebar />
        </div>
        
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* 뒤로가기 버튼 */}
            <div className="mb-6">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>뒤로가기</span>
              </button>
            </div>

            {/* 페이지 제목 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">마이페이지</h1>
              <p className="text-gray-600">내 정보를 확인하고 관리하세요.</p>
            </div>

            {/* 탭 메뉴 */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: "profile", label: "프로필 정보", icon: User },
                  { id: "posts", label: "내 게시글", icon: FileText },
                  { id: "comments", label: "내 댓글", icon: MessageCircle },
                  { id: "likes", label: "좋아요", icon: Heart },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 탭 내용 */}
            {renderTabContent()}

            {/* 페이지네이션 (프로필 탭이 아닐 때만 표시) */}
            {activeTab !== "profile" && getTotalPages() > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: getTotalPages() }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === getTotalPages() || 
                        Math.abs(page - currentPage) <= 2
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <PaginationItem>
                              <span className="px-4 py-2">...</span>
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink 
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                        className={currentPage === getTotalPages() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMyPage;
