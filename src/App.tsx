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
import AdoptionPage from "./pages/AdoptionPage";
import AdoptionCreate from "./pages/AdoptionCreate";
import AdoptionBoard from "./components/AdoptionBoard";
import AdoptionDetail from "./pages/AdoptionDetail";
import RescueDetail from "./pages/RescueDetail";
import MapPage from "./pages/MapPage";

const queryClient = new QueryClient();

const App = () => (
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/adoption" element={<AdoptionPage />} />
          <Route path="/adoption/create" element={<AdoptionCreate />} />
          <Route path="/adoption-detail/:id" element={<AdoptionDetail />} />
          <Route path="/rescue-detail/:id" element={<RescueDetail />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
