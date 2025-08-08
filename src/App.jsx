import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Board from "./pages/Board";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import AdoptionPage from "./pages/AdoptionPage.jsx";
import AdoptionCreate from "./pages/AdoptionCreate";
import AdoptionBoard from "./components/AdoptionBoard";
import AdoptionDetail from "./pages/AdoptionDetail";
import RescueDetail from "./pages/RescueDetail";
import ChildCreate from "./components/ChildCreate";
import ChildIList from "./components/ChildIList";
import AdminMain from "./pages/AdminMain";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminUserDetail from "./pages/AdminUserDetail";
import AdminManagerManagement from "./pages/AdminManagerManagement";
import AdminLogManagement from "./pages/AdminLogManagement";
import AdminBoardManagement from "./pages/AdminBoardManagement";
import AdminAdvertisementManagement from "./pages/AdminAdvertisementManagement";
import MyPage from "./pages/AdminMyPage.jsx";
import LoginPage from "./pages/LoginPage";
import UserMyPage from "./pages/UserMyPage";
import AdminCustomerSupport from "./pages/AdminCustomerSupport";
import AdminBannerManagement from "./pages/AdminBannerManagement";
import AdminPolicyCreate from "./pages/AdminPolicyCreate";
import AdminQnaCreate from "./pages/AdminQnaCreate";
import AdminQnaDetail from "./pages/AdminQnaDetail";
import AdminPolicyDetail from "./pages/AdminPolicyDetail";
import AdminInquiryDetail from "./pages/AdminInquiryDetail";
import MessagesPage from "./pages/MessagesPage";
import CustomerServicePage from "./pages/CustomerServicePage";
import CustomerPrivacyDetail from "./pages/CustomerPrivacyDetail";
import CustomerQnADetail from "./pages/CustomerQnADetail";
import { AuthProvider } from "./context/UserContext";
import ChildDetail from "./pages/ChildDetail";
import { AdminProvider } from "./context/AdminContext";
import MapPage from "./pages/MapPage.jsx";
import AdminBoardDetailManagement from "./pages/AdminBoardDetailManagement";
import { logUserEvent } from "./hooks/user-log-hook";
import { Helmet } from "react-helmet-async";
import { Footer } from "react-day-picker";

const queryClient = new QueryClient();

// 관리자 로그아웃 이벤트 처리를 위한 컴포넌트
const AdminLogoutHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAdminLogout = () => {
      navigate("/admin");
    };

    window.addEventListener("adminLogout", handleAdminLogout);
    return () => window.removeEventListener("adminLogout", handleAdminLogout);
  }, [navigate]);

  return null;
};

const App = () => {
  useEffect(() => {
    logUserEvent("app_loaded");
  }, []);
  return (
    <>
      {/* 🔹 전역 기본 메타태그 */}
      <Helmet>
        <title>냥몽</title>
        <meta
          name="description"
          content="반려동물 정보를 나누는 냥몽 커뮤니티입니다."
        />
        <meta name="robots" content="index, follow" />

        {/ Open Graph 기본값 /}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="냥몽" />
        <meta property="og:title" content="냥몽" />
        <meta
          property="og:description"
          content="반려동물 정보를 나누는 냥몽 커뮤니티입니다."
        />
        <meta property="og:image" content="/냥몽 이미지 로고 누끼.png" />

        {/ Twitter Card 기본값 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="냥몽" />
        <meta
          name="twitter:description"
          content="반려동물 정보를 나누는 냥몽 커뮤니티입니다."
        />
        <meta name="twitter:image" content="/냥몽 이미지 로고 누끼.png" />
      </Helmet>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AdminLogoutHandler />
              <Routes>
                {/* User routes */}
                <Route path="/" element={<Index />} />
                <Route path="/board/:type" element={<Board />} />
                <Route path="/post/:type/:id" element={<PostDetail />} />
                <Route path="/detail/:type/:id" element={<PostDetail />} />
                <Route path="/create-post/:type" element={<CreatePost />} />
                <Route path="/edit/:type/:id" element={<CreatePost />} />
                <Route path="/child/create" element={<ChildCreate />} />
                <Route path="/child/list" element={<ChildIList />} />
                <Route path="/board/introduction" element={<ChildIList />} />
                <Route
                  path="/detail/introduction/:id"
                  element={<ChildDetail />}
                />
                <Route path="/child/edit/:id" element={<ChildCreate />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/adoption" element={<AdoptionPage />} />
                <Route path="/adoption/create" element={<AdoptionCreate />} />
                <Route
                  path="/adoption/update/:id"
                  element={<AdoptionCreate />}
                />
                <Route
                  path="/adoption-detail/:id"
                  element={<AdoptionDetail />}
                />
                <Route path="/rescue-detail/:id" element={<RescueDetail />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/mypage" element={<UserMyPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route
                  path="/customer-service"
                  element={<CustomerServicePage />}
                />
                <Route
                  path="/customer-privacy-detail/:id"
                  element={<CustomerPrivacyDetail />}
                />
                <Route
                  path="/customer-qna-detail/:id"
                  element={<CustomerQnADetail />}
                />
                <Route
                  path="/admin/*"
                  element={
                    <AdminProvider>
                      <Routes>
                        <Route path="" element={<AdminMain />} />
                        <Route path="users" element={<AdminUserManagement />} />
                        <Route path="users/:id" element={<AdminUserDetail />} />
                        <Route
                          path="managers"
                          element={<AdminManagerManagement />}
                        />
                        <Route path="logs" element={<AdminLogManagement />} />
                        <Route
                          path="boards"
                          element={<AdminBoardManagement />}
                        />
                        <Route
                          path="board-detail/:type/:postId"
                          element={<AdminBoardDetailManagement />}
                        />
                        <Route
                          path="banner"
                          element={<AdminBannerManagement />}
                        />
                        <Route
                          path="support"
                          element={<AdminCustomerSupport />}
                        />
                        <Route
                          path="policy/create"
                          element={<AdminPolicyCreate />}
                        />
                        <Route
                          path="advertisement"
                          element={<AdminAdvertisementManagement />}
                        />
                        <Route path="qna/create" element={<AdminQnaCreate />} />
                        <Route path="qna/:id" element={<AdminQnaDetail />} />
                        <Route
                          path="policy/:id"
                          element={<AdminPolicyDetail />}
                        />
                        <Route
                          path="inquiry/:id"
                          element={<AdminInquiryDetail />}
                        />
                        <Route path="mypage" element={<MyPage />} />
                        <Route path="login" element={<LoginPage />} />
                      </Routes>
                    </AdminProvider>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
};

export default App;
