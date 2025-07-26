import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import MyPage from "./pages/AdminMyPage.jsx";
import LoginPage from "./pages/LoginPage";
import UserMyPage from "./pages/UserMyPage";
import AdminCustomerSupport from "./pages/AdminCustomerSupport";
import AdminBannerManagement from "./pages/AdminBannerManagement";
import AdminPolicyCreate from "./pages/AdminPolicyCreate";
import AdminQnaCreate from "./pages/AdminQnaCreate";
import MessagesPage from "./pages/MessagesPage";
import CustomerServicePage from "./pages/CustomerServicePage";
import { AuthProvider } from "./context/UserContext";
import ChildDetail from "./pages/ChildDetail";
import { AdminProvider } from "./context/AdminContext";
import MapPage from "./pages/MapPage.jsx";
import TestMap from "./components/testMap.jsx";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="/detail/introduction/:id" element={<ChildDetail />} />
            <Route path="/child/edit/:id" element={<ChildCreate />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/adoption" element={<AdoptionPage />} />
            <Route path="/adoption/create" element={<AdoptionCreate />} />
            <Route path="/adoption/update/:id" element={<AdoptionCreate />} />
            <Route path="/adoption-detail/:id" element={<AdoptionDetail />} />
            <Route path="/rescue-detail/:id" element={<RescueDetail />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/mypage" element={<UserMyPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/customer-service" element={<CustomerServicePage />} />
            {/* Admin routes wrapped with AdminProvider */}
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
                    <Route path="boards" element={<AdminBoardManagement />} />
                    <Route path="banner" element={<AdminBannerManagement />} />
                    <Route path="support" element={<AdminCustomerSupport />} />
                    <Route
                      path="policy/create"
                      element={<AdminPolicyCreate />}
                    />
                    <Route
                      path="qna/create"
                      element={<AdminQnaCreate />}
                    />
                    <Route path="mypage" element={<MyPage />} />
                    <Route path="login" element={<LoginPage />} />
                  </Routes>
                </AdminProvider>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
