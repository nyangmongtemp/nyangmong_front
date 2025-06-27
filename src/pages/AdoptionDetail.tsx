
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MapPin, Calendar, Eye, MessageCircle, ArrowLeft, User, Edit } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const AdoptionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "펫러버123",
      content: "정말 귀여운 아이네요! 혹시 예방접종은 완료되었나요?",
      date: "2024.06.25 14:30",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      id: 2,
      author: "동물사랑",
      content: "분양비에 어떤 것들이 포함되어 있는지 궁금합니다.",
      date: "2024.06.25 16:45",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ]);

  // 임시 게시글 데이터
  const post = {
    id: 1,
    title: "골든리트리버 분양합니다",
    images: [
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    author: "사랑이맘",
    location: "서울 강남구",
    age: "2개월",
    gender: "수컷",
    breed: "골든리트리버",
    price: "책임비 50만원",
    vaccination: "1차 완료",
    neutering: "미완료",
    date: "2024.06.20",
    views: 125,
    likes: 15,
    description: "건강하고 활발한 골든리트리버 남아입니다. 엄마, 아빠 모두 혈통서가 있는 순혈이며, 1차 예방접종까지 완료된 상태입니다. 현재 이유식을 잘 먹고 있으며, 배변 훈련도 어느 정도 되어 있습니다. 좋은 가정에서 평생 함께할 가족을 찾고 있습니다."
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: "익명사용자",
        content: comment,
        date: new Date().toLocaleString('ko-KR'),
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* 상단 네비게이션 */}
              <div className="p-6 border-b">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/adoption')}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>목록으로</span>
                  </Button>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>분양게시판</span>
                    <span>{'>'}</span>
                    <span>{post.title}</span>
                  </div>
                </div>
              </div>

              {/* 게시글 내용 */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>작성자: {post.author}</span>
                      <span>작성일: {post.date}</span>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-pink-400" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-orange-500">{post.price}</Badge>
                </div>

                {/* 이미지 갤러리 */}
                <div className="mb-6">
                  <div className="relative">
                    <img
                      src={post.images[currentImageIndex]}
                      alt={post.title}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    {post.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {post.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {post.images.length > 1 && (
                    <div className="flex space-x-2 mt-4">
                      {post.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            index === currentImageIndex ? 'border-orange-500' : 'border-gray-200'
                          }`}
                        >
                          <img src={image} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 펫 정보 */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">펫 정보</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">품종</span>
                        <p className="font-medium">{post.breed}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">나이</span>
                        <p className="font-medium">{post.age}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">성별</span>
                        <p className="font-medium">{post.gender}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">지역</span>
                        <p className="font-medium">{post.location}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">예방접종</span>
                        <p className="font-medium">{post.vaccination}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">중성화</span>
                        <p className="font-medium">{post.neutering}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">책임비</span>
                        <p className="font-medium text-orange-600">{post.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 상세 설명 */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4">상세 설명</h3>
                  <div className="prose max-w-none text-gray-700 leading-relaxed">
                    {post.description}
                  </div>
                </div>

                {/* 게시물 수정 버튼 */}
                <div className="mb-8 text-center">
                  <Button variant="outline" className="mr-4">
                    <Edit className="h-4 w-4 mr-2" />
                    게시물 수정
                  </Button>
                </div>

                {/* 댓글 섹션 */}
                <div className="border-t pt-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <MessageCircle className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-bold">댓글 ({comments.length})</h3>
                  </div>

                  {/* 댓글 작성 */}
                  <div className="mb-6">
                    <Textarea
                      placeholder="댓글을 작성해주세요..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="mb-3"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleCommentSubmit} className="bg-orange-500 hover:bg-orange-600">
                        댓글 작성
                      </Button>
                    </div>
                  </div>

                  {/* 댓글 목록 */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={comment.avatar}
                          alt={comment.author}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.date}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

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

export default AdoptionDetail;
