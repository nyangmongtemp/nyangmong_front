
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Eye, Heart, MessageCircle, Share2, Edit, Trash2 } from 'lucide-react';
import { Post, Comment } from '@/types/post';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');

  // 샘플 데이터
  const post: Post = {
    id: 1,
    title: '안녕하세요! 첫 번째 게시물입니다.',
    content: `게시판 테스트를 위한 첫 번째 게시물입니다. 많은 관심 부탁드립니다.

이 게시물은 새로운 게시판 시스템을 테스트하기 위해 작성되었습니다. 
다양한 기능들이 잘 작동하는지 확인해보겠습니다.

앞으로 더 많은 유용한 정보들을 공유할 예정이니 많은 관심 부탁드립니다!`,
    author: '사용자1',
    category: '자유',
    createdAt: '2024-01-15 14:30',
    views: 124,
    likes: 8
  };

  const [comments] = useState<Comment[]>([
    {
      id: 1,
      postId: 1,
      author: '댓글러1',
      content: '좋은 게시물 감사합니다!',
      createdAt: '2024-01-15 15:00'
    },
    {
      id: 2,
      postId: 1,
      author: '사용자2',
      content: '도움이 많이 되었습니다. 앞으로도 좋은 글 부탁드려요.',
      createdAt: '2024-01-15 16:30'
    }
  ]);

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      // TODO: 댓글 추가 로직
      setNewComment('');
    }
  };

  const handleLike = () => {
    // TODO: 좋아요 기능
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/board')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">게시물 상세</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Post Content */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-gray-500">{post.author}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{post.createdAt}</span>
                </div>
                <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    조회 {post.views}
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    좋아요 {post.likes}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    댓글 {comments.length}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {post.content}
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center">
              <Button
                onClick={handleLike}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                좋아요 {post.likes}
              </Button>
              <div className="flex gap-2">
                <Link to="/board">
                  <Button variant="outline">목록으로</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">댓글 {comments.length}개</h3>
          </CardHeader>
          <CardContent>
            {/* Comment Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <Textarea
                placeholder="댓글을 입력하세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3 resize-none"
                rows={3}
              />
              <div className="flex justify-end">
                <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                  댓글 작성
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={comment.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{comment.createdAt}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        답글
                      </Button>
                    </div>
                  </div>
                  {index < comments.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>

            {comments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                첫 번째 댓글을 작성해보세요!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostDetail;
