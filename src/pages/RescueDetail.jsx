
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Calendar, 
  Heart, 
  Share2, 
  MessageCircle,
  Eye,
  User,
  Building
} from 'lucide-react';
import { strayAnimalAPI } from '../../configs/api-utils.js';
import AlertDialog from '@/components/ui/alert-dialog';

const RescueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Alert 다이얼로그 상태
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    const fetchAnimalDetail = async () => {
      console.log('RescueDetail useEffect 실행:', { id });
      
      if (!id) {
        setError('유기동물 정보를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('API 호출 시작:', id);
        const data = await strayAnimalAPI.getStrayAnimalDetail(id);
        console.log('유기동물 상세 데이터:', data);
        console.log('데이터 타입:', typeof data);
        console.log('데이터 키들:', Object.keys(data || {}));
        
        // 데이터가 비어있거나 null인지 확인
        if (!data || Object.keys(data).length === 0) {
          throw new Error('유기동물 정보가 없습니다.');
        }
        
        setAnimal(data);
      } catch (err) {
        console.error('유기동물 상세 조회 실패:', err);
        setError('유기동물 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalDetail();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '날짜 정보 없음';
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${year}년 ${month}월 ${day}일`;
  };

  const getGenderText = (sexCd) => {
    switch (sexCd) {
      case 'M': return '수컷';
      case 'F': return '암컷';
      case 'Q': return '미상';
      default: return '성별 정보 없음';
    }
  };

  const getNeuterText = (neuterYn) => {
    switch (neuterYn) {
      case 'Y': return '중성화 완료';
      case 'N': return '중성화 미완료';
      case 'U': return '중성화 여부 미상';
      default: return '중성화 정보 없음';
    }
  };

  const getImages = () => {
    const images = [];
    if (animal?.popfile1) images.push(animal.popfile1);
    if (animal?.popfile2) images.push(animal.popfile2);
    
    // 이미지가 없으면 기본 이미지 반환
    if (images.length === 0) {
      return ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'];
    }
    
    return images;
  };

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

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${animal?.kindNm || '유기동물'} - 구조 정보`,
        text: `${animal?.kindNm || '유기동물'}의 구조 정보입니다.`,
        url: window.location.href,
      });
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      showAlert(
        '링크 복사 완료', 
        '페이지 링크가 클립보드에 복사되었습니다.\n\n다른 곳에 붙여넣기(Ctrl+V)하여 공유하세요.', 
        'success'
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">유기동물 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error && !animal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => navigate('/adoption')} variant="outline">
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">유기동물 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate('/adoption')} variant="outline">
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const images = getImages();
  
  // 디버깅용 로그
  console.log('RescueDetail 렌더링 - animal:', animal);
  console.log('RescueDetail 렌더링 - images:', images);

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
                        <span>유기동물분양게시판</span>
                        <span>{'>'}</span>
                        <span>{animal.kindNm || '유기동물'}</span>
                      </div>
                    </div>
                </div>
              </div>

              {/* 게시글 내용 */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{animal.kindNm || '유기동물'}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>구조일: {formatDate(animal.happenDt)}</span>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{animal.happenPlace || '발견 장소 정보 없음'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 첫 번째 행: 이미지 + 유기동물 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 이미지 섹션 */}
          <div className="h-fit">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={images[currentImageIndex]}
                    alt={animal.kindNm || '유기동물'}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                </div>
                
                {/* 이미지 썸네일 */}
                {images.length > 1 && (
                  <div className="flex gap-2 p-4">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageChange(index)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index 
                            ? 'border-orange-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${animal.kindNm || '유기동물'} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 유기동물 기본 정보 */}
          <div className="h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">
                  유기동물 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">품종</p>
                    <p className="font-medium">
                      {animal.upKindNm && animal.kindNm 
                        ? `${animal.upKindNm} - ${animal.kindNm}`
                        : animal.kindNm || animal.upKindNm || '품종 정보 없음'
                      }
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">성별</p>
                    <p className="font-medium">{getGenderText(animal.sexCd)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">나이</p>
                    <p className="font-medium">{animal.age || '나이 정보 없음'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">체중</p>
                    <p className="font-medium">{animal.weight || '체중 정보 없음'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">색상</p>
                    <p className="font-medium">{animal.colorCd || '색상 정보 없음'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">중성화</p>
                    <p className="font-medium">{getNeuterText(animal.neuterYn)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">구조일</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{formatDate(animal.happenDt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 두 번째 행: 특이사항 + 보호소 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 특이사항 */}
          {animal.specialMark && (
            <div className="h-fit">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">특이사항</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {animal.specialMark}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 보호소 정보 */}
          <div className="h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">보호소 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{animal.careNm || animal.orgNm}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{animal.careAddr}</span>
                  </div>
                  {animal.careTel && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{animal.careTel}</span>
                    </div>
                  )}
                  {animal.careOwnerNm && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">담당자: {animal.careOwnerNm}</span>
                    </div>
                  )}
                </div>
                
                {animal.careTel && (
                  <>
                    <Separator className="md:hidden" />
                    <div className="flex gap-2 md:hidden">
                      <a 
                        href={`tel:${animal.careTel}`}
                        className="flex-1"
                      >
                        <Button className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500">
                          <Phone className="h-4 w-4 mr-2" />
                          전화하기
                        </Button>
                      </a>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">추가 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">유기동물 번호</p>
                  <p className="font-medium">{animal.desertionNo}</p>
                </div>
                <div>
                  <p className="text-gray-500">관리 기관</p>
                  <p className="font-medium">{animal.orgNm}</p>
                </div>
                <div>
                  <p className="text-gray-500">RFID 코드</p>
                  <p className="font-medium">{animal.rfidCd || '정보 없음'}</p>
                </div>
              </div>
              {animal.etcBigo && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-gray-500 mb-2">기타 비고</p>
                  <p className="text-gray-700">{animal.etcBigo}</p>
                </div>
              )}
            </CardContent>
          </Card>
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

export default RescueDetail;
