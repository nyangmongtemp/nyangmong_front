
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, TrendingUp } from 'lucide-react';

const CommunityBoard = () => {
  const boards = [
    { name: '자유게시판', posts: 1247, icon: MessageSquare },
    { name: '사진자랑', posts: 892, icon: TrendingUp },
    { name: '질문답변', posts: 634, icon: MessageSquare },
    { name: '용품거래', posts: 456, icon: MessageSquare }
  ];

  const recentPosts = [
    {
      id: 1,
      title: "새로 입양한 강아지가 밥을 안 먹어요 ㅠㅠ",
      board: "질문답변",
      author: "걱정많은집사",
      time: "5분 전",
      comments: 3
    },
    {
      id: 2,
      title: "우리 고양이 잠자는 모습이 너무 귀여워서 올려요",
      board: "사진자랑",
      author: "냥이사랑",
      time: "15분 전",
      comments: 8
    },
    {
      id: 3,
      title: "강아지 미용 어디서 하시나요?",
      board: "자유게시판",
      author: "멍멍맘",
      time: "1시간 전",
      comments: 12
    },
    {
      id: 4,
      title: "고양이 사료 판매합니다 (거의 새것)",
      board: "용품거래",
      author: "착한판매자",
      time: "2시간 전",
      comments: 5
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-gray-800">커뮤니티 게시판</CardTitle>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-1" />
              글쓰기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {boards.map((board) => (
              <div
                key={board.name}
                className="p-4 bg-gradient-to-br from-orange-50 to-blue-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <board.icon className="h-6 w-6 text-orange-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">{board.name}</h3>
                    <p className="text-sm text-gray-600">{board.posts}개 글</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">최근 게시글</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded">
                        {post.board}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2 hover:text-orange-600 transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{post.author}</span>
                      <span>{post.time}</span>
                      <span>댓글 {post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityBoard;
