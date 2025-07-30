import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageCircle,
  HelpCircle,
  Bell,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../configs/axios-config";
import {
  API_BASE_URL,
  SSE,
  USER,
  BOARD,
  MAIN,
} from "../../configs/host-config";
import { API_ENDPOINTS } from "../../configs/api-endpoints";
import { useAuth } from "../context/UserContext";
import PasswordResetForm from "./PasswordResetForm";
import { EventSourcePolyfill } from "event-source-polyfill";

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

const Sidebar = () => {
  const {
    isLoggedIn,
    login,
    logout,
    nickname,
    profileImage,
    isSocial,
    kakaoLogin,
    token,
    email,
  } = useAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [currentEventSlide, setCurrentEventSlide] = useState(0);
  const [ads, setAds] = useState([]); // 광고 상태 추가
  const [currentAdSlide, setCurrentAdSlide] = useState(0);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]); // 알림 목록 저장
  const [showNotificationModal, setShowNotificationModal] = useState(false); // 알림 모달 표시
  const navigate = useNavigate();
  const location = useLocation();

  // localStorage에서 알림 상태 복원
  useEffect(() => {
    if (isLoggedIn && email) {
      const savedNotifications = localStorage.getItem(`notifications_${email}`);
      if (savedNotifications) {
        try {
          const parsedNotifications = JSON.parse(savedNotifications);
          setNotifications(parsedNotifications);
          setNotificationCount(parsedNotifications.length);
          setHasNotifications(parsedNotifications.length > 0);
          console.log(
            "📱 알림 상태 복원 완료:",
            parsedNotifications.length,
            "개"
          );
        } catch (error) {
          console.error("❌ 알림 상태 복원 실패:", error);
          // 잘못된 데이터인 경우 제거
          localStorage.removeItem(`notifications_${email}`);
        }
      } else {
        // 저장된 알림이 없으면 상태 초기화
        setNotifications([]);
        setNotificationCount(0);
        setHasNotifications(false);
      }
    } else if (!isLoggedIn) {
      // 로그아웃 시 알림 상태 초기화
      setNotifications([]);
      setNotificationCount(0);
      setHasNotifications(false);
    }
  }, [isLoggedIn, email]);

  // 페이지 떠날 때 알림 상태 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isLoggedIn && email && notifications.length > 0) {
        saveNotificationsToStorage(notifications);
        console.log(
          "💾 페이지 떠날 때 알림 상태 저장:",
          notifications.length,
          "개"
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isLoggedIn, email, notifications]);

  // 알림 상태가 변경될 때마다 자동 저장
  useEffect(() => {
    if (isLoggedIn && email) {
      saveNotificationsToStorage(notifications);
    }
  }, [notifications, isLoggedIn, email]);

  // 알림 상태를 localStorage에 저장
  const saveNotificationsToStorage = (newNotifications) => {
    if (isLoggedIn && email) {
      localStorage.setItem(
        `notifications_${email}`,
        JSON.stringify(newNotifications)
      );
    }
  };

  // 알림 상태를 localStorage에서 제거
  const clearNotificationsFromStorage = () => {
    if (isLoggedIn && email) {
      localStorage.removeItem(`notifications_${email}`);
    }
  };

  const eventImages = [
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  ];

  // 광고 목록 API 연동
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axiosInstance.get(
          `${API_BASE_URL}${MAIN}/ads/display`
        );
        setAds(res.data.result || []);
        setCurrentAdSlide(0); // 새로 받아오면 첫 슬라이드로
      } catch (error) {
        setAds([]);
        console.error("광고 불러오기 실패:", error);
      }
    };
    fetchAds();
  }, []);

  const handleKakaoLogin = () => {
    console.log("카카오 로그인 버튼 클릭!");
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&prompt=login`;

    window.open(
      kakaoAuthUrl,
      "kakao-login",
      "width=500,height=600,scrollbars=yes,resizable=yes"
    );
  };

  // ✅ 카카오 로그인 메시지 수신 처리
  useEffect(() => {
    const handleKakaoMessage = (event) => {
      if (
        event.data.type === "OAUTH_SUCCESS" &&
        event.data.provider === "KAKAO"
      ) {
        console.log("✅ 카카오 로그인 성공!");
        console.log(event);
        kakaoLogin(
          event.data.token,
          event.data.email,
          event.data.nickname,
          event.data.profileImage,
          event.data.provider
        );
      }
    };

    window.addEventListener("message", handleKakaoMessage);
    return () => window.removeEventListener("message", handleKakaoMessage);
  }, [login, navigate]);

  const handleLogin = async (e) => {
    try {
      const res = await axiosInstance.post(`${API_BASE_URL}${USER}/login`, {
        email: loginData.email,
        password: loginData.password,
      });
      console.log(res);

      login(
        res.data.result.token,
        res.data.result.email,
        res.data.result.nickname,
        res.data.result.profileImage
      );
      setNickname(res.data.result.nickname);
      setProfileImage(res.data.result.profileImage);
    } catch (error) {
      if (
        error.status === 401 &&
        error.message === "아이디 혹은 패스워드를 다시 확인해 주세요."
      ) {
        alert("아이디 혹은 패스워드를 다시 확인해 주세요.");
      }
    }
  };

  const handleLogout = () => {
    navigate("/");
    logout();
    setLoginData({ email: "", password: "" });
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleMyPageClick = () => {
    navigate("/mypage");
  };

  const handleMessagesClick = () => {
    // 메시지 페이지 이동 시 알림 지우기
    setHasNotifications(false);
    setNotificationCount(0);
    setNotifications([]);
    clearNotificationsFromStorage();
    navigate("/messages");
  };

  const handleCustomerServiceClick = () => {
    navigate("/customer-service");
  };

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  // 인기 게시글 API 연동
  useEffect(() => {
    const fetchPopularPosts = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`${API_BASE_URL}${BOARD}/popular`);
        //console.log("인기 게시글 API 응답:", res.data);
        const posts = res.data || [];
        const mappedPosts = posts.map((item, index) => ({
          id: item.postId, // 반드시 postId(PK)로!
          title: item.title,
          views: item.viewCount,
          category: item.category,
          author: item.nickname,
        }));
        setPopularPosts(mappedPosts);
      } catch (error) {
        console.error("인기 게시글 불러오기 실패:", error);
        console.error("에러 상세:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });

        // 404 에러일 때 더 명확한 메시지
        if (error.response?.status === 404) {
          console.warn("인기 게시글 API가 백엔드에서 구현되지 않았습니다.");
        }

        setPopularPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts(); // 초기 로드

    // 페이지 포커스 시 갱신 (새로고침, 탭 전환 등)
    const handleFocus = () => {
      fetchPopularPosts();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // SSE 알림 연결
  useEffect(() => {
    if (!isLoggedIn) return;

    console.log("🔔 SSE 알림 연결 시작 - 로그인 상태:", isLoggedIn);

    let eventSource = null;
    let healthCheckInterval = null;

    const createEventSource = () => {
      // 기존 연결이 있으면 정리
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSourcePolyfill(`${API_BASE_URL}${SSE}/subscribe`, {
        headers: {
          Authorization: `Bearer ${token}`, // 인증 토큰만 설정
        },
        heartbeatTimeout: 30000, // 30초로 늘림 (기본값 1000ms)
        timeout: 60000, // 60초 연결 타임아웃
      });

      // 연결 성공 이벤트
      eventSource.addEventListener("connect", (event) => {
        console.log("✅ SSE 연결 성공:", event.data);
      });

      // 새로운 메시지 알림 이벤트
      eventSource.addEventListener("message", (event) => {
        try {
          console.log("📨 SSE 메시지 수신:", event.data);

          const message = JSON.parse(event.data);

          // 메시지 데이터가 있는 경우 알림 처리
          if (message.senderNickname && message.senderId) {
            console.log("🎉 새로운 메시지 알림 감지!");

            // 알림 데이터 생성
            const notification = {
              id: Date.now(), // 고유 ID
              senderNickname: message.senderNickname,
              senderId: message.senderId,
              sendTime: message.sendTime || new Date().toISOString(),
              message: `${message.senderNickname}님이 쪽지를 보냈습니다.`,
            };

            // 알림 상태 업데이트 (같은 senderId가 있으면 최신 것만 유지)
            setNotifications((prev) => {
              // 같은 senderId의 기존 알림 제거
              const filteredNotifications = prev.filter(
                (existing) => existing.senderId !== message.senderId
              );

              // 새로운 알림을 맨 앞에 추가
              const updatedNotifications = [
                notification,
                ...filteredNotifications,
              ];

              // 알림 개수 업데이트 (고유한 senderId 개수)
              setNotificationCount(updatedNotifications.length);
              setHasNotifications(updatedNotifications.length > 0);

              return updatedNotifications;
            });
          }
        } catch (error) {
          console.error(" SSE 메시지 파싱 오류:", error);
        }
      });

      // 하트비트 이벤트 (연결 상태 확인)
      eventSource.addEventListener("heartbeat", (event) => {
        console.log(" 하트비트 수신:", event.data);
      });

      // 에러 처리 - 연결 상태만 로깅
      eventSource.addEventListener("error", (event) => {
        // 하트비트 타임아웃은 정상적인 상황이므로 무시
        if (
          event.error &&
          event.error.message &&
          event.error.message.includes("No activity within")
        ) {
          console.log(" 하트비트 타임아웃 - 정상적인 상황입니다");
          return; // EventSourcePolyfill이 자동으로 재연결
        }

        // 실제 연결 오류인 경우
        console.error(" SSE 연결 오류:", event);
      });

      return eventSource;
    };

    // 초기 연결 생성
    eventSource = createEventSource();

    // SSE emitter 건강상태 확인 (30초마다)
    healthCheckInterval = setInterval(async () => {
      if (!isLoggedIn) return;

      try {
        const healthResponse = await axiosInstance.get(
          `${API_BASE_URL}${SSE}/health-check`
        );
        const healthStatus = healthResponse.data;

        if (healthStatus === "disconnected") {
          console.log(
            "⚠️ SSE emitter 연결이 끊어졌습니다. 재연결을 시도합니다."
          );
          eventSource = createEventSource();
        } else if (healthStatus === "connected") {
          console.log("✅ SSE emitter 연결 상태 정상");
        }
      } catch (error) {
        if (error.status === 401 || error.response?.status === 401) {
          console.log("이거는 로그가 나와야 함.");
        }

        console.error("❌ SSE emitter 건강상태 확인 실패:", error);
        // 에러 발생 시 재연결 시도
        console.log("🔄 에러로 인한 SSE 재연결 시도");
        eventSource = createEventSource();
      }
    }, 30000); // 30초마다 체크

    // 페이지 포커스 시 연결 상태 확인
    const handleFocus = () => {
      if (
        isLoggedIn &&
        eventSource &&
        eventSource.readyState === EventSourcePolyfill.CLOSED
      ) {
        console.log("🔄 페이지 포커스 시 연결 복구 시도");
        eventSource = createEventSource();
      }
    };

    window.addEventListener("focus", handleFocus);

    // 연결 해제 시 정리
    return () => {
      console.log("🔌 SSE 연결 해제");
      window.removeEventListener("focus", handleFocus);
      if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
      }
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isLoggedIn, token]); // token 의존성 추가

  const handleNotificationClick = () => {
    // 알림이 있을 때만 모달 표시
    if (notifications.length > 0) {
      setShowNotificationModal(true);
    }
  };

  const handleCloseNotificationModal = () => {
    setShowNotificationModal(false);
    // 모달 닫을 때 알림 상태 초기화
    setHasNotifications(false);
    setNotificationCount(0);
    setNotifications([]);
    clearNotificationsFromStorage(); // 모달 닫을 때 알림 상태 저장소에서 제거
  };

  return (
    <div className="space-y-6">
      {/* 알림 모달 */}
      <Dialog
        open={showNotificationModal}
        onOpenChange={setShowNotificationModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">새로운 쪽지 알림</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.sendTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  // 메시지 페이지 이동 시 알림 지우기
                  setHasNotifications(false);
                  setNotificationCount(0);
                  setNotifications([]);
                  clearNotificationsFromStorage();
                  setShowNotificationModal(false);
                  navigate("/messages");
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                메시지 확인하기
              </Button>
              <Button
                onClick={handleCloseNotificationModal}
                variant="outline"
                className="flex-1"
              >
                닫기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 로그인/프로필 카드 */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-pink-50">
          <CardTitle className="text-center text-gray-800 flex items-center justify-center">
            {isLoggedIn ? (
              <>
                내 정보
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNotificationClick}
                  className="ml-2 p-1 h-8 w-8 relative"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {hasNotifications && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </div>
                  )}
                </Button>
              </>
            ) : (
              "로그인"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoggedIn ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="프로필 이미지"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-500" />
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">{nickname}</p>
                <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-gray-600">
                  <span> 등급</span>
                </div>
              </div>
              <div className="w-full space-y-2">
                <Button
                  onClick={handleMyPageClick}
                  variant="outline"
                  className={`w-full transition-colors ${
                    isActiveRoute("/mypage")
                      ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                      : "border-orange-300 text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  마이페이지
                </Button>
                <Button
                  onClick={handleMessagesClick}
                  variant="outline"
                  className={`w-full transition-colors ${
                    isActiveRoute("/messages")
                      ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                      : "border-orange-300 text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  메시지
                </Button>
                <Button
                  onClick={handleCustomerServiceClick}
                  variant="outline"
                  className={`w-full transition-colors ${
                    isActiveRoute("/customer-service")
                      ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                      : "border-orange-300 text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  고객센터
                </Button>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            </div>
          ) : (
            <div>
              {showPasswordReset ? (
                <PasswordResetForm
                  onClose={() => setShowPasswordReset(false)}
                />
              ) : (
                <>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleLogin();
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        이메일
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="text"
                          placeholder="아이디를 입력하세요"
                          className="pl-10"
                          value={loginData.email}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        비밀번호
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="비밀번호를 입력하세요"
                          className="pl-10"
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500"
                    >
                      로그인
                    </Button>

                    <Button
                      type="button"
                      onClick={handleSignupClick}
                      variant="outline"
                      className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      회원가입
                    </Button>
                  </form>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600 text-center">
                      소셜 로그인
                    </p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400"
                        onClick={handleKakaoLogin}
                      >
                        카카오 로그인
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowPasswordReset(true)}
                        variant="outline"
                        className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        비밀번호 찾기
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 이벤트 슬라이드 */}
      <Card className="border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-orange-50">
          <CardTitle className="text-center text-gray-800">이벤트</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="relative">
            <img
              src={eventImages[currentEventSlide]}
              alt="이벤트"
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              onClick={() =>
                setCurrentEventSlide(
                  (prev) => (prev - 1 + eventImages.length) % eventImages.length
                )
              }
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                setCurrentEventSlide((prev) => (prev + 1) % eventImages.length)
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 광고 슬라이드 */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardTitle className="text-center text-gray-800">광고</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="relative">
            {ads.length > 0 ? (
              <>
                <img
                  src={ads[currentAdSlide].image}
                  alt="광고"
                  className="w-full h-32 object-cover rounded-lg"
                />
                {/* 제목 노출 제거됨 */}
                <button
                  onClick={() =>
                    setCurrentAdSlide(
                      (prev) => (prev - 1 + ads.length) % ads.length
                    )
                  }
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full"
                  disabled={ads.length <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentAdSlide((prev) => (prev + 1) % ads.length)
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full"
                  disabled={ads.length <= 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="w-full h-32 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                광고 배너가 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 인기 게시글 */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-pink-50">
          <CardTitle className="text-lg text-gray-800">인기 게시글</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {loading ? (
              <div className="p-4 text-center text-gray-500">로딩 중...</div>
            ) : popularPosts.length > 0 ? (
              popularPosts.map((post, index) => (
                <div
                  key={post.id}
                  onClick={() => {
                    let type = "free";
                    if (post.category === "QUESTION") type = "question";
                    else if (post.category === "REVIEW") type = "review";
                    else if (post.category === "FREE") type = "free";
                    navigate(`/detail/${type}/${post.id}`);
                  }}
                  className="p-3 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        index < 3
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                    {post.category && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {post.category === "QUESTION"
                          ? "질문"
                          : post.category === "REVIEW"
                          ? "후기"
                          : post.category === "FREE"
                          ? "자유"
                          : post.category}
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-sm text-gray-900 mb-1 hover:text-orange-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>by {post.author}</span>
                    <span>조회 {post.views}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                인기 게시글이 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
