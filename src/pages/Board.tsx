
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Eye, Heart, MessageCircle } from 'lucide-react';
import { Post } from '@/types/post';

const Board = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 샘플 데이터
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">자유 게시판</h1>
            <Link to="/create-post">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                글쓰기
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Categories */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">카테고리</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="게시물을 검색하세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <Link key={post.id} to={`/post/${post.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{post.category}</Badge>
                            <span className="text-sm text-gray-500">{post.author}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{post.createdAt}</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-2">{post.content}</p>
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
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">인기 게시물</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {posts.slice(0, 3).map(post => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-medium text-sm line-clamp-2 mb-1">{post.title}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="w-3 h-3 mr-1" />
                      {post.views}
                      <Heart className="w-3 h-3 ml-2 mr-1" />
                      {post.likes}
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
