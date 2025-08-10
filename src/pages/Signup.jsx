import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowLeft,
  Upload,
  MapPin,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, USER } from "../../configs/host-config";
import ImageCropModal from "../components/ImageCropModal";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToMarketing: false,
  });

  // 비밀번호 유효성 검사 관련 상태
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [authCodeSent, setAuthCodeSent] = useState(false);
  const [isEmailSent, setEmailSent] = useState(false);
  const [inputAuthCode, setInputAuthCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // 프로필 이미지 관련 상태
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);

  // 약관 모달 관련 상태
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");

  const navigate = useNavigate();

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password) => {
    // 공백 제거 후 길이 확인
    const trimmedPassword = password.replace(/\s/g, "");
    if (trimmedPassword.length < 8) {
      return "비밀번호는 공백 제외 8글자 이상이어야 합니다.";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/;
    if (!passwordRegex.test(password)) {
      return "비밀번호는 영문 대소문자 및 특수문자를 각각 1개 이상 포함해야 합니다.";
    }
    return "";
  };

  // 입력 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 비밀번호 입력 시 실시간 유효성 검사
    if (name === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
    }

    // 비밀번호 확인 입력 시 일치 여부 검사
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      } else {
        setConfirmPasswordError("");
      }
    }

    // 비밀번호가 변경되었을 때 확인 비밀번호도 다시 검사
    if (name === "password" && formData.confirmPassword) {
      if (value !== formData.confirmPassword) {
        setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  // 체크박스 처리
  const handleCheckboxChange = (name) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // 이용약관 가져오기
  const handleTermsClick = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}${USER}/terms/terms/lastPost`
      );
      console.log("이용약관 응답:", response);

      if (response.data && response.data.result) {
        setTermsContent(response.data.result.content || "");
      }
      setShowTermsModal(true);
    } catch (error) {
      console.error("이용약관 조회 실패:", error);
      setTermsContent("이용약관을 불러올 수 없습니다.");
      setShowTermsModal(true);
    }
  };

  // 개인정보 처리방침 가져오기
  const handlePrivacyClick = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}${USER}/terms/policy/lastPost`
      );
      console.log("개인정보 처리방침 응답:", response);

      if (response.data && response.data.result) {
        setPrivacyContent(response.data.result.content || "");
      }
      setShowPrivacyModal(true);
    } catch (error) {
      console.error("개인정보 처리방침 조회 실패:", error);
      setPrivacyContent("개인정보 처리방침을 불러올 수 없습니다.");
      setShowPrivacyModal(true);
    }
  };

  // 프로필 이미지 업로드 처리
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file); // 파일 이름 보존용
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 크롭 완료 처리
  const handleCropComplete = (croppedImageUrl, croppedBlob) => {
    setProfileImagePreview(croppedImageUrl);

    // 기존에 업로드한 파일 이름에서 확장자 추출
    const originalName = profileImage?.name || "cropped.png";
    //  Blob → File 변환하면서 이름 유지
    const croppedFile = new File([croppedBlob], originalName, {
      type: croppedBlob.type || "image/png", // fallback MIME type
    });

    setProfileImage(croppedFile); // File로 저장
    setIsCropModalOpen(false);
  };

  // 인증코드 발송 버튼 클릭 시
  const handleSendAuthCode = async (e) => {
    try {
      setEmailSent(true);
      const res = await axiosInstance.get(
        `${API_BASE_URL}${USER}/verify-email?email=${formData.email}`
      );
      console.log(res);
      setAuthCodeSent(true);
    } catch (error) {
      if (error.response?.code === "ACCOUNT-005") {
        alert("현재 이메일 인증이 제한된 이메일입니다.");
      } else if (error.response?.code === "PARAM-006") {
        alert("이미 가입된 이메일입니다.");
      }
      console.log(error);
      setEmailSent(false);
    }
  };

  // 인증하기 버튼 클릭 시
  const handleVerifyCode = async (e) => {
    try {
      const res = await axiosInstance.post(
        `${API_BASE_URL}${USER}/verify-code`,
        {
          email: formData.email,
          authCode: inputAuthCode,
        }
      );
      setIsEmailVerified(true);
    } catch (error) {
      console.log(error);
      if (error.response?.code === "ACCOUNT-010") {
        alert("만료된 인증번호입니다.");
      } else if (error.response?.code === "ACCOUNT-014") {
        alert(error.response?.message);
      } else if (error.response?.code === "ACCOUNT-009") {
        alert(error.response?.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 유효성 검사
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setPasswordError(passwordError);
      return;
    }

    // 비밀번호 확인 검사
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const form = new FormData();

    // 객체를 JSON 문자열로 변환 후 append
    const userJson = JSON.stringify({
      email: formData.email,
      password: formData.password,
      userName: formData.name,
      nickname: formData.nickname || formData.name, // 닉네임이 비어있으면 이름을 사용
    });

    form.append("user", new Blob([userJson], { type: "application/json" }));

    // 이미지가 있을 경우만 첨부
    if (profileImage) {
      form.append("profileImage", profileImage);
      console.log(profileImage);
    }

    try {
      const res = await axiosInstance.post(
        `${API_BASE_URL}${USER}/create`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("회원가입 성공:", res);
      navigate("/");
      // 성공 처리 추가 (예: 이동, 알림 등)
    } catch (error) {
      console.error("회원가입 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 뒤로 가기 */}
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>메인으로 돌아가기</span>
          </Link>
        </div>

        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">냥</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              냥몽
            </h1>
          </div>
          <p className="text-gray-600">
            반려동물과 함께하는 따뜻한 커뮤니티에 가입하세요
          </p>
        </div>

        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-pink-50">
            <CardTitle className="text-center text-gray-800 text-xl">
              회원가입
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이름 */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium flex items-center gap-1"
                >
                  이름 <span className="text-xs text-red-500">(필수)</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="이름을 입력하세요"
                    className="pl-10"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* 닉네임 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="nickname" className="text-sm font-medium">
                    닉네임
                  </Label>
                  <span className="text-xs text-gray-400">
                    기재를 안하시면 이름이 닉네임이 됩니다
                  </span>
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="nickname"
                    name="nickname"
                    placeholder="닉네임을 입력하세요"
                    className="pl-10"
                    value={formData.nickname}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* 프로필 이미지 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">프로필 이미지</Label>
                <div className="flex items-center space-x-4">
                  {profileImagePreview && (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={profileImagePreview}
                        alt="프로필 미리보기"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-image"
                    />
                    <Label
                      htmlFor="profile-image"
                      className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md border transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <span>이미지 업로드</span>
                    </Label>
                  </div>
                </div>
              </div>

              {/* 이메일 */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium flex items-center gap-1"
                >
                  이메일 <span className="text-xs text-red-500">(필수)</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isEmailVerified}
                  />
                </div>
                <div className="flex space-x-2">
                  {!isEmailVerified && (
                    <Button
                      type="button"
                      onClick={handleSendAuthCode}
                      className="text-sm"
                      size="sm"
                      disabled={isEmailSent}
                    >
                      인증코드 발송
                    </Button>
                  )}
                  {isEmailVerified && (
                    <span className="text-sm text-green-600 font-medium">
                      이메일 인증 완료
                    </span>
                  )}
                </div>
              </div>

              {/* 인증 코드 입력 */}
              {!isEmailVerified && authCodeSent && (
                <div className="space-y-2">
                  <Label htmlFor="authCode" className="text-sm font-medium">
                    인증코드
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="authCode"
                      type="text"
                      placeholder="인증코드를 입력하세요"
                      value={inputAuthCode}
                      onChange={(e) => setInputAuthCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleVerifyCode} size="sm">
                      인증하기
                    </Button>
                  </div>
                </div>
              )}

              {/* 비밀번호 */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium flex items-center gap-1"
                >
                  비밀번호 <span className="text-xs text-red-500">(필수)</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    className={`pl-10 ${passwordError ? "border-red-500" : ""}`}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium flex items-center gap-1"
                >
                  비밀번호 확인{" "}
                  <span className="text-xs text-red-500">(필수)</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    className={`pl-10 ${
                      confirmPasswordError ? "border-red-500" : ""
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {confirmPasswordError && (
                  <p className="text-sm text-red-500">{confirmPasswordError}</p>
                )}
              </div>

              {/* 약관 동의 */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("agreeToTerms")
                    }
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    <span className="text-red-500">*</span> 이용약관에
                    동의합니다
                    <button
                      type="button"
                      onClick={handleTermsClick}
                      className="text-orange-500 hover:underline ml-1"
                    >
                      (보기)
                    </button>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToPrivacy"
                    checked={formData.agreeToPrivacy}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("agreeToPrivacy")
                    }
                  />
                  <Label htmlFor="agreeToPrivacy" className="text-sm">
                    <span className="text-red-500">*</span> 개인정보 처리방침에
                    동의합니다
                    <button
                      type="button"
                      onClick={handlePrivacyClick}
                      className="text-orange-500 hover:underline ml-1"
                    >
                      (보기)
                    </button>
                  </Label>
                </div>
              </div>

              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 mt-6"
                disabled={
                  !formData.agreeToTerms ||
                  !formData.agreeToPrivacy ||
                  !isEmailVerified
                }
              >
                회원가입
              </Button>
            </form>

            {/* 로그인 링크 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{" "}
                <Link
                  to="/"
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  로그인하기
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 이미지 크롭 모달 */}
        <ImageCropModal
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
        />

        {/* 이용약관 모달 */}
        <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center">이용약관</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: termsContent }}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* 개인정보 처리방침 모달 */}
        <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center">
                개인정보 처리방침
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: privacyContent }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Signup;
