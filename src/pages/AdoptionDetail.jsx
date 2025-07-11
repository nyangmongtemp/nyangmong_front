import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MapPin, Calendar, Eye, MessageCircle, ArrowLeft, User, Edit, Send } from 'lucide-react';
import { adoptionAPI } from '../../configs/api-utils.js';
import { useAuth } from '@/context/UserContext';
import AlertDialog from '@/components/ui/alert-dialog';
import { toast } from "@/components/ui/sonner";

const AdoptionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { email, isLoggedIn } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [replyTo, setReplyTo] = useState(null); // 답글 대상 댓글 ID
  const [replyText, setReplyText] = useState(''); // 답글 텍스트
  
  // Alert 다이얼로그 상태
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  
  // 더미 댓글 데이터 (답글 포함)
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "펫러버123",
      content: "정말 귀여운 아이네요! 혹시 예방접종은 완료되었나요?",
      date: "2024.06.25 14:30",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      replies: [
        {
          id: 11,
          author: "사랑이맘",
          content: "네, 1차 예방접종까지 완료된 상태입니다!",
          date: "2024.06.25 15:00",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
      ]
    },
    {
      id: 2,
      author: "동물사랑",
      content: "분양비에 어떤 것들이 포함되어 있는지 궁금합니다.",
      date: "2024.06.25 16:45",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      replies: []
    }
  ]);

  const reservationOptions = [
    { label: "예약가능", value: "A" },
    { label: "예약중", value: "R" },
    { label: "분양완료", value: "C" },
  ];

  console.log('AdoptionDetail 컴포넌트 로드됨, id:', id);

  useEffect(() => {
    const fetchAdoptionDetail = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await adoptionAPI.getAdoptionDetail(id);
        console.log('분양 상세 API 응답:', response);
        console.log('응답 타입:', typeof response);
        console.log('응답 키들:', Object.keys(response || {}));
        setPost(response);
        console.log('post 상태 설정 완료:', response);
      } catch (err) {
        console.error('분양 상세 조회 실패:', err);
        setError('분양글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptionDetail();
  }, [id]);

  // Alert 다이얼로그 표시 함수
  const showAlert = (title, message, type = 'info') => {
    setAlertDialog({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Alert 다이얼로그 닫기 함수
  const closeAlert = () => {
    setAlertDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: "익명사용자",
        content: comment,
        date: new Date().toLocaleString('ko-KR'),
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        replies: []
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  const handleReplySubmit = (commentId) => {
    if (replyText.trim()) {
      const newReply = {
        id: Date.now(), // 임시 ID
        author: "익명사용자",
        content: replyText,
        date: new Date().toLocaleString('ko-KR'),
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      };
      
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      ));
      
      setReplyText('');
      setReplyTo(null);
    }
  };

  const handleReplyClick = (commentId) => {
    if (replyTo === commentId) {
      setReplyTo(null);
      setReplyText('');
    } else {
      setReplyTo(commentId);
      setReplyText('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">분양글을 불러오는 중...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button 
                onClick={() => navigate("/adoption")}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                목록으로 돌아가기
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-500 mb-4">분양글을 찾을 수 없습니다.</p>
              <Button 
                onClick={() => navigate("/adoption")}
                variant="outline"
              >
                목록으로 돌아가기
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const images = post.images || [post.thumbnailImage || post.image].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* 상단 네비게이션 */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/adoption')}
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>목록으로</span>
                    </Button>
                    <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
                      <span>분양게시판</span>
                      <span>{'>'}</span>
                      <span>{post.title}</span>
                    </div>
                  </div>
                  {isLoggedIn && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // 좋아요 기능 구현
                        console.log("좋아요 클릭");
                      }}
                      className="flex items-center space-x-2"
                    >
                      <Heart className="h-4 w-4" />
                      <span>좋아요</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* 게시글 내용 */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>작성자: {post.nickName}</span>
                      <span>작성일: {new Date(post.createAt).toLocaleDateString('ko-KR')}</span>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>{post.viewCount || post.views}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-pink-400" />
                        <span>{post.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge className="bg-orange-500">{post.fee === 0 ? '무료분양' : `${post.fee.toLocaleString()}원`}</Badge>
                    {/* 예약상태 셀렉트박스 - 내가 쓴 글일 때만 노출 */}
                    {isLoggedIn && post && email === post.authorEmail && (
                      <div className="mt-2">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={post.reservationStatus || "A"}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              const token = localStorage.getItem('token');
                              await adoptionAPI.updateReservationStatus(id, newStatus, token);
                              toast.success('예약상태 변경 성공!');
                              setPost({ ...post, reservationStatus: newStatus });
                            } catch (err) {
                              toast.error('예약상태 변경 실패!');
                            }
                          }}
                        >
                          {reservationOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* 이미지 갤러리 */}
                {images.length > 0 && (
                  <div className="mb-6">
                    <div className="relative">
                      <img
                        src={images[currentImageIndex]}
                        alt={post.title}
                        className="w-full h-96 object-cover rounded-lg"
                        onError={(e) => {
                          console.log('이미지 로드 실패:', images[currentImageIndex]);
                          e.target.src = "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                      {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {images.map((_, index) => (
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
                    {images.length > 1 && (
                      <div className="flex space-x-2 mt-4">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                              index === currentImageIndex ? 'border-orange-500' : 'border-gray-200'
                            }`}
                          >
                            <img 
                              src={image} 
                              alt="" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 펫 정보 */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">펫 정보</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">품종</span>
                        <p className="font-medium">{post.breed || post.petKind}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">나이</span>
                        <p className="font-medium">{post.age}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">성별</span>
                        <p className="font-medium">{post.gender || (post.sexCode === 'M' ? '수컷' : post.sexCode === 'F' ? '암컷' : '미상')}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">지역</span>
                        <p className="font-medium">{post.location || post.address}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">예방접종</span>
                        <p className="font-medium">{post.vaccination || post.vaccine}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">중성화</span>
                        <p className="font-medium">{post.neutering || (post.neuterYn === 'Y' ? '완료' : post.neuterYn === 'N' ? '미완료' : '미상')}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">책임비</span>
                        <p className="font-medium text-orange-600">{post.fee === 0 ? '무료분양' : `${post.fee.toLocaleString()}원`}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 상세 설명 */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4">상세 설명</h3>
                  <div
                    className="prose max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>

                {/* 연락처 정보 */}
                {post.phone && (
                  <div className="mb-8 p-4 bg-orange-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">연락처</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700">{post.phone}</span>
                      <a 
                        href={`tel:${post.phone}`}
                        className="ml-2 px-3 py-1 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
                      >
                        전화하기
                      </a>
                    </div>
                  </div>
                )}

                {/* 게시물 수정 버튼 - 로그인한 사용자이면서 작성자인 경우에만 표시 */}
                {isLoggedIn && post && email === post.authorEmail && (
                  <div className="mb-8 text-center flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      className="mr-2"
                      onClick={() => navigate(`/adoption/update/${id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      게시물 수정
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;
                        try {
                          const token = localStorage.getItem('token');
                          await adoptionAPI.deleteAdoptionPost(id, token);
                          alert('게시글이 성공적으로 삭제되었습니다.');
                          navigate('/adoption');
                        } catch (err) {
                          alert('게시글 삭제에 실패했습니다.');
                        }
                      }}
                    >
                      삭제
                    </Button>
                  </div>
                )}

                {/* 댓글 섹션 */}
                <div className="border-t pt-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <MessageCircle className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-bold">댓글 ({comments.length})</h3>
                  </div>

                  {/* 댓글 작성 - 로그인한 사용자에게만 표시 */}
                  {isLoggedIn ? (
                    <div className="mb-6">
                      <Textarea
                        placeholder="댓글을 작성해주세요..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mb-3"
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleCommentSubmit} className="bg-orange-500 hover:bg-orange-600">
                          <Send className="h-4 w-4 mr-2" />
                          댓글 작성
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-gray-600 mb-2">댓글을 작성하려면 로그인이 필요합니다.</p>
                    </div>
                  )}

                  {/* 댓글 목록 */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="space-y-3">
                        {/* 메인 댓글 */}
                        <div className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                          <img
                            src={comment.avatar}
                            alt={comment.author}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">{comment.author}</span>
                                <span className="text-xs text-gray-500">{comment.date}</span>
                              </div>
                              {isLoggedIn && (
                                <button
                                  onClick={() => handleReplyClick(comment.id)}
                                  className="text-xs px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-colors rounded border border-blue-200"
                                >
                                  답글
                                </button>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm">{comment.content}</p>
                          </div>
                        </div>

                        {/* 답글 입력창 */}
                        {replyTo === comment.id && (
                          <div className="ml-8 bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex space-x-3">
                              <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="답글을 입력하세요..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleReplySubmit(comment.id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleReplySubmit(comment.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                              >
                                답글 등록
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 답글 목록 */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-8 space-y-2">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                                <img
                                  src={reply.avatar}
                                  alt={reply.author}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-xs">{reply.author}</span>
                                    <span className="text-xs text-gray-500">{reply.date}</span>
                                  </div>
                                  <p className="text-gray-700 text-xs">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
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

      {/* Alert 다이얼로그 */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={closeAlert}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />

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