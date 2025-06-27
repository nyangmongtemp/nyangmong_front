import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Eye, Heart, MessageCircle } from 'lucide-react';
import { Post } from '@/types/post';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Board = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // 샘플 데이터 확장
  const [posts] = useState<Post[]>([
    {
      id: 1,
      title: '안녕하세요! 첫 번째 게시물입니다.',
      content: '게시판 테스트를 위한 첫 번째 게시물입니다. 많은 관심 부탁드립니다.',
      author: '사용자1',
      category: '자유',
      createdAt: '2024-01-15',
      views: 124,
      likes: 8
    },
    {
      id: 2,
      title: '질문이 있습니다',
      content: 'React에 대해서 궁금한 점이 있어서 질문드립니다.',
      author: '개발자',
      category: '질문',
      createdAt: '2024-01-14',
      views: 87,
      likes: 5
    },
    {
      id: 3,
      title: '유용한 정보 공유합니다',
      content: '개발에 도움이 되는 팁을 공유해드립니다.',
      author: '정보왕',
      category: '정보',
      createdAt: '2024-01-13',
      views: 256,
      likes: 15
    }
  ]);

  const categories = ['전체', '자유', '질문', '정보', '공지'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 영역 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 페이지 제목 */}
            <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">자유 게시판</h1>
              <p className="text-gray-600">자유롭게 이야기를 나누는 공간입니다.</p>
            </div>

            {/* 카테고리 & 검색 */}
            <Card className="border-orange-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        className={selectedCategory === category 
                          ? "bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500" 
                          : "border-orange-300 text-orange-600 hover:bg-orange-50"
                        }
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                  <div className="relative flex-1 md:max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="게시물을 검색하세요..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* 글쓰기 버튼 */}
                <div className="flex justify-end mb-4">
                  <Link to="/create-post">
                    <Button className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500">
                      <Edit className="w-4 h-4 mr-2" />
                      글쓰기
                    </Button>
                  </Link>
                </div>

                {/* 게시물 목록 */}
                <div className="space-y-3">
                  {currentPosts.map(post => (
                    <Link key={post.id} to={`/post/${post.id}`}>
                      <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer bg-white">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{post.category}</Badge>
                              <span className="text-sm text-gray-500">{post.author}</span>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-500">{post.createdAt}</span>
                            </div>
                            <h3 className="font-semibold mb-2 hover:text-orange-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 ml-4">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {post.views}
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {post.likes}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">검색 결과가 없습니다.</p>
                  </div>
                )}

                {/* 페이징 */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => setCurrentPage(pageNum)}
                                isActive={currentPage === pageNum}
                                className="cursor-pointer"
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        {totalPages > 5 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 영역 */}
          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">냥</span>
              </div>
              <p className="font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                냥몽 - 반려동물과 함께하는 따뜻한 커뮤니티
              </p>
            </div>
            <p className="text-sm">© 2024 냥몽. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Board;
