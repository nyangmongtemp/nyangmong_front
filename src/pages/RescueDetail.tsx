
import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar, Eye, ArrowLeft, Phone, Mail } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const RescueDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // 임시 유기동물 게시글 데이터
  const post = {
    id: 101,
    title: "유기견 보호중 - 새 가족을 찾아요",
    images: [
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rescuer: "동물보호단체 희망",
    location: "서울 동대문구",
    age: "1세 추정",
    gender: "수컷",
    breed: "믹스견",
    rescueDate: "2024.06.15",
    status: "입양가능",
    views: 340,
    likes: 45,
    healthStatus: "건강함",
    temperament: "온순하고 사람을 좋아함",
    contact: "010-1234-5678",
    email: "hope@rescue.org",
    description: "길에서 구조된 아이로, 현재 임시보호 중입니다. 건강검진 완료되었으며 예방접종도 모두 마쳤습니다. 사람을 매우 좋아하고 다른 동물들과도 잘 어울립니다. 산책을 좋아하며 기본적인 명령어도 알고 있는 똑똑한 아이입니다. 평생 함께할 가족을 찾고 있습니다."
  };

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

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
                    <span>유기동물분양게시판</span>
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
                      <span>보호자: {post.rescuer}</span>
                      <span>구조일: {post.rescueDate}</span>
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
                  <Badge className={`${
                    post.status === '입양가능' ? 'bg-green-500' : 
                    post.status === '치료중' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}>
                    {post.status}
                  </Badge>
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
                            index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
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
                    <h3 className="text-lg font-bold mb-4">구조동물 정보</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                        <span className="text-sm text-gray-600">발견지역</span>
                        <p className="font-medium">{post.location}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">구조일</span>
                        <p className="font-medium">{post.rescueDate}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">건강상태</span>
                        <p className="font-medium text-green-600">{post.healthStatus}</p>
                      </div>
                      <div className="col-span-2 md:col-span-3">
                        <span className="text-sm text-gray-600">성격</span>
                        <p className="font-medium">{post.temperament}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 연락처 정보 */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">연락처 정보</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">{post.contact}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">{post.email}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 입양 문의 시 사전 상담이 필요하며, 입양 후에도 지속적인 소통을 통해 아이의 안전을 확인합니다.
                      </p>
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

                {/* 입양 문의 버튼 */}
                <div className="text-center">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 px-8">
                    입양 문의하기
                  </Button>
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

export default RescueDetail;
