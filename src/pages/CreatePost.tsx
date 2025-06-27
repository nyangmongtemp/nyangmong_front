
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Camera, X } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    author: '사용자1'
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const categories = ['자유', '질문', '정보', '공지'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.category || !formData.content.trim()) {
      alert('제목, 카테고리, 내용을 모두 입력해주세요.');
      return;
    }

    console.log('게시물 생성:', { ...formData, image: selectedImage });
    navigate('/board');
  };

  const handleCancel = () => {
    if (formData.title || formData.content || selectedImage) {
      if (confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        navigate('/board');
      }
    } else {
      navigate('/board');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 영역 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 뒤로가기 헤더 */}
            <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  className="p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-lg font-semibold">게시물 작성</h1>
              </div>
            </div>

            {/* 게시물 작성 폼 */}
            <Card className="border-orange-200">
              <CardHeader>
                <h2 className="text-xl font-semibold">새 게시물 작성</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 제목 */}
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                      제목 *
                    </Label>
                    <Input
                      id="title"
                      placeholder="제목을 입력하세요"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="text-lg"
                      required
                    />
                  </div>

                  {/* 이미지 업로드 */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      이미지 첨부
                    </Label>
                    <div className="space-y-3">
                      {!imagePreview ? (
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className="w-full h-32 border-2 border-dashed border-orange-300 hover:border-orange-400 hover:bg-orange-50 flex flex-col items-center justify-center gap-2"
                          >
                            <Camera className="w-8 h-8 text-orange-400" />
                            <span className="text-orange-600">이미지를 선택해주세요</span>
                            <span className="text-xs text-gray-500">JPG, PNG 파일만 업로드 가능</span>
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                            className="absolute top-2 right-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 카테고리 */}
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                      카테고리 *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 내용 */}
                  <div>
                    <Label htmlFor="content" className="text-sm font-medium mb-2 block">
                      내용 *
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="내용을 입력하세요"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      className="min-h-[300px] resize-y"
                      required
                    />
                  </div>

                  {/* 작성자 정보 */}
                  <div className="bg-gradient-to-r from-yellow-50 to-pink-50 p-4 rounded-lg border border-orange-100">
                    <p className="text-sm text-gray-600">
                      작성자: <span className="font-medium">{formData.author}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      게시물 작성 시 작성자 정보가 공개됩니다.
                    </p>
                  </div>

                  {/* 버튼 */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500"
                    >
                      게시물 등록
                    </Button>
                  </div>
                </form>
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

export default CreatePost;
