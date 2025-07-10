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
import AdoptionDetail from "./pages/AdoptionDetail.jsx";
import RescueDetail from "./pages/RescueDetail";
import MapPage from "./pages/MapPage";
import ChildCreate from "./components/ChildCreate";
import ChildIList from "./components/ChildIList";
import AdminMain from "./pages/AdminMain";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminUserDetail from "./pages/AdminUserDetail";
import AdminManagerManagement from "./pages/AdminManagerManagement";
import AdminLogManagement from "./pages/AdminLogManagement";
import AdminBoardManagement from "./pages/AdminBoardManagement";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import UserMyPage from "./pages/UserMyPage";
import AdminCustomerSupport from "./pages/AdminCustomerSupport";
import AdminBannerManagement from "./pages/AdminBannerManagement";
import AdminPolicyCreate from "./pages/AdminPolicyCreate";
import MessagesPage from "./pages/MessagesPage";
import CustomerServicePage from "./pages/CustomerServicePage";
import { AuthProvider } from "./context/UserContext";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/board/:type" element={<Board />} />
            <Route path="/post/:type/:id" element={<PostDetail />} />
            <Route path="/create-post/:type" element={<CreatePost />} />
            <Route path="/child/create" element={<ChildCreate />} />
            <Route path="/child/list" element={<ChildIList />} />
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
            <Route path="/admin" element={<AdminMain />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/users/:id" element={<AdminUserDetail />} />
            <Route
              path="/admin/managers"
              element={<AdminManagerManagement />}
            />
            <Route path="/admin/logs" element={<AdminLogManagement />} />
            <Route path="/admin/boards" element={<AdminBoardManagement />} />
            <Route path="/admin/banner" element={<AdminBannerManagement />} />
            <Route path="/admin/support" element={<AdminCustomerSupport />} />
            <Route
              path="/admin/policy/create"
              element={<AdminPolicyCreate />}
            />
            <Route path="/admin/mypage" element={<MyPage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
