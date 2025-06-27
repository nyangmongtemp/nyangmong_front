
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, Eye } from 'lucide-react';

const PopularPosts = () => {
  const posts = [
    {
      id: 1,
      title: "우리 강아지 첫 목욕 후기",
      author: "펫러버123",
      likes: 42,
      comments: 15,
      views: 230
    },
    {
      id: 2,
      title: "고양이가 좋아하는 장난감 추천",
      author: "냥냥이맘",
      likes: 38,
      comments: 22,
      views: 180
    },
    {
      id: 3,
      title: "강아지 산책 필수템 리스트",
      author: "멍멍아빠",
      likes: 35,
      comments: 18,
      views: 156
    },
    {
      id: 4,
      title: "펫 사료 추천해주세요",
      author: "초보집사",
      likes: 28,
      comments: 31,
      views: 145
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-gray-800">인기 게시글</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0"
            >
              <h4 className="font-medium text-gray-900 mb-2 hover:text-orange-600 transition-colors">
                {post.title}
              </h4>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.author}</span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularPosts;
