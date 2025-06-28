
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Lock, Calendar, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileForm = ({ formData, handleInputChange, handleSubmit, handleProfileImageChange }) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50">
        <CardTitle className="text-center text-gray-800 text-xl">
          프로필 정보 수정
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 프로필 사진 섹션 */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={formData.profileImage} alt="프로필 사진" />
                <AvatarFallback className="bg-gray-200">
                  <User className="w-16 h-16 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer transition-colors"
              >
                <Camera className="w-4 h-4" />
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-600">프로필 사진을 변경하려면 카메라 아이콘을 클릭하세요</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center">
              <User className="w-4 h-4 mr-2" />
              이름
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              이메일
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              전화번호
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              새 비밀번호 (변경 시 입력)
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              비밀번호 확인
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              가입일
            </Label>
            <Input
              value={formData.joinDate}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500"
            >
              정보 수정하기
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
