import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Heart,
  MapPin,
  Calendar,
  Eye,
  MessageCircle,
  Plus,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { strayAnimalAPI, adoptionAPI } from "../../configs/api-utils.js";
import { useAuth } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import AlertDialog from "@/components/ui/alert-dialog";
import { logUserEvent } from "../hooks/user-log-hook";
import { ABS, API_BASE_URL } from "../../configs/host-config.js";

const AdoptionPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // API 관련 상태
  const [strayAnimals, setStrayAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이징 관련 상태 (서버 사이드)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 검색 필터 상태
  const [searchWord, setSearchWord] = useState("");
  const [upKindNm, setUpKindNm] = useState("");
  const [careAddr, setCareAddr] = useState("");
  const [sexCode, setSexCode] = useState("");
  const [selectedGender, setSelectedGender] = useState("전체");

  // 분양게시판 API 관련 상태
  const [adoptionPosts, setAdoptionPosts] = useState([]);
  const [adoptionLoading, setAdoptionLoading] = useState(false);
  const [adoptionError, setAdoptionError] = useState(null);
  const [adoptionCurrentPage, setAdoptionCurrentPage] = useState(0);
  const [adoptionTotalPages, setAdoptionTotalPages] = useState(0);
  const [adoptionTotalElements, setAdoptionTotalElements] = useState(0);

  // 분양게시판 검색 필터 상태
  const [adoptionSearchWord, setAdoptionSearchWord] = useState("");
  // adoptionPetCategory, adoptionSex, adoptionAddress 기본값을 '전체'로
  const [adoptionPetCategory, setAdoptionPetCategory] = useState("전체");
  const [adoptionSex, setAdoptionSex] = useState("전체");
  const [adoptionAddress, setAdoptionAddress] = useState("전체");

  // Alert 다이얼로그 상태
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const categories = ["전체", "강아지", "고양이", "기타"];
  const genderOptions = ["전체", "수컷", "암컷", "미상"];

  // Alert 다이얼로그 표시 함수
  const showAlert = (title, message, type = "info") => {
    setAlertDialog({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  // Alert 다이얼로그 닫기 함수
  const closeAlert = () => {
    setAlertDialog((prev) => ({ ...prev, isOpen: false }));
  };
  const regions = [
    { value: "all", label: "전체 지역" },
    { value: "seoul", label: "서울" },
    { value: "gyeonggi", label: "경기" },
    { value: "gangwon", label: "강원도" },
    { value: "gangwon-special", label: "강원특별자치도" },
    { value: "chungcheongbuk", label: "충청북도" },
    { value: "chungcheongnam", label: "충청남도" },
    { value: "daejeon", label: "대전" },
    { value: "sejong", label: "세종" },
    { value: "jeollabuk", label: "전라북도" },
    { value: "jeollanam", label: "전라남도" },
    { value: "jeonbuk-special", label: "전북특별자치도" },
    { value: "gwangju", label: "광주" },
    { value: "gyeongsangbuk", label: "경상북도" },
    { value: "gyeongsangnam", label: "경상남도" },
    { value: "busan", label: "부산" },
    { value: "daegu", label: "대구" },
    { value: "ulsan", label: "울산" },
    { value: "jeju", label: "제주" },
  ];

  // 유기동물 목록 조회 함수
  const fetchStrayAnimals = async (page = 0) => {
    setLoading(true);
    setError(null);

    try {
      // 지역 필터링을 위한 주소 매핑
      let addressFilter = "";
      if (selectedRegion !== "all") {
        const regionMap = {
          seoul: "서울",
          busan: "부산",
          daegu: "대구",
          incheon: "인천",
          gwangju: "광주",
          daejeon: "대전",
          ulsan: "울산",
          gyeonggi: "경기",
          gangwon: "강원도",
          "gangwon-special": "강원특별자치도",
          chungcheongbuk: "충청북도",
          chungcheongnam: "충청남도",
          sejong: "세종",
          jeollabuk: "전라북도",
          jeollanam: "전라남도",
          "jeonbuk-special": "전북특별자치도",
          gyeongsangbuk: "경상북도",
          gyeongsangnam: "경상남도",
          jeju: "제주",
        };
        addressFilter = regionMap[selectedRegion] || "";
      }

      // 종류 필터링을 위한 매핑
      let kindFilter = "";
      if (selectedCategory !== "전체") {
        const kindMap = {
          강아지: "개",
          고양이: "고양이",
          기타: "기타",
        };
        kindFilter = kindMap[selectedCategory] || "";
      }

      // 성별 필터링을 위한 매핑
      let genderFilter = "";
      if (selectedGender !== "전체") {
        const genderMap = {
          수컷: "M",
          암컷: "F",
          미상: "Q",
        };
        genderFilter = genderMap[selectedGender] || "";
      }

      const response = await strayAnimalAPI.getStrayAnimals(
        searchWord || searchTerm,
        kindFilter,
        addressFilter,
        genderFilter,
        page,
        pageSize
      );

      // API 응답이 HTML인 경우 (백엔드 서버 연결 실패)
      if (
        typeof response === "string" &&
        response.includes("<!DOCTYPE html>")
      ) {
        setStrayAnimals([]);
        setCurrentPage(0);
        setTotalPages(0);
        setTotalElements(0);
        setError("백엔드 서버에 연결할 수 없습니다.");
        return;
      }

      // API 응답 형식에 맞게 데이터 추출 (result 객체 안에 content가 있음)
      const resultData = response.result || response;
      setStrayAnimals(
        resultData.content || resultData.data || resultData || []
      );

      if (resultData.pageable) {
        // API는 0-based, UI는 1-based로 변환
        setCurrentPage(resultData.pageable.pageNumber);
        setPageSize(resultData.pageable.pageSize);
      }
      setTotalPages(resultData.totalPages || 0);
      setTotalElements(resultData.totalElements || 0);
    } catch (err) {
      console.error("유기동물 목록 조회 실패:", err);
      setError("유기동물 목록을 불러오는데 실패했습니다.");
      setStrayAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 함수 (서버 사이드, 1-based pagination)
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // UI는 1-based, API 호출은 1-based로 변환
    fetchStrayAnimals(page);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchStrayAnimals(0);
    // 분양게시판은 탭이 선택될 때만 로드하도록 변경

    // 페이지 렌더링 이벤트 로깅
    logUserEvent("board_view", {
      selectedCategory: "stray-animal",
    });
  }, []);

  // 분양게시판 탭이 선택될 때 데이터 로드
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "rescue");

  useEffect(() => {
    if (activeTab === "adoption") {
      fetchAdoptionPosts(0);
    }
    logUserEvent("board_view", {
      selectedCategory: "adoption",
    });
  }, [activeTab]);

  // 검색 필터 변경 시 데이터 다시 로드 (페이지는 0으로 리셋)
  useEffect(() => {
    setCurrentPage(0);
    fetchStrayAnimals(0);
  }, [selectedRegion, selectedCategory, selectedGender, searchTerm]);

  // 분양게시판 검색 필터 변경 시 데이터 다시 로드
  useEffect(() => {
    if (activeTab === "adoption") {
      setAdoptionCurrentPage(0);
      fetchAdoptionPosts(0);
    }
  }, [adoptionSearchWord, adoptionPetCategory, adoptionAddress, adoptionSex]);

  // 화면 크기 변경 감지를 위한 state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 분양게시판 목록 조회 함수
  const fetchAdoptionPosts = async (page = 0) => {
    setAdoptionLoading(true);
    setAdoptionError(null);

    try {
      // 지역 필터링을 위한 주소 매핑
      let addressFilter = "";
      if (adoptionAddress !== "전체") {
        const regionMap = {
          seoul: "서울",
          busan: "부산",
          daegu: "대구",
          incheon: "인천",
          gwangju: "광주",
          daejeon: "대전",
          ulsan: "울산",
          gyeonggi: "경기",
          gangwon: "강원도",
          "gangwon-special": "강원특별자치도",
          chungcheongbuk: "충청북도",
          chungcheongnam: "충청남도",
          sejong: "세종",
          jeollabuk: "전라북도",
          jeollanam: "전라남도",
          "jeonbuk-special": "전북특별자치도",
          gyeongsangbuk: "경상북도",
          gyeongsangnam: "경상남도",
          jeju: "제주",
        };
        addressFilter = regionMap[adoptionAddress] || adoptionAddress;
      }

      const response = await adoptionAPI.getAdoptionBoardPosts(
        adoptionSearchWord,
        adoptionPetCategory === "전체" ? "" : adoptionPetCategory,
        addressFilter,
        adoptionSex === "전체"
          ? ""
          : adoptionSex === "수컷"
          ? "M"
          : adoptionSex === "암컷"
          ? "F"
          : "Q",
        page, // API는 0-based
        pageSize
      );

      console.log(response);

      // API 응답이 HTML인 경우 (백엔드 서버 연결 실패)
      if (
        typeof response === "string" &&
        response.includes("<!DOCTYPE html>")
      ) {
        setAdoptionPosts([]);
        setAdoptionCurrentPage(0);
        setAdoptionTotalPages(0);
        setAdoptionTotalElements(0);
        setAdoptionError("백엔드 서버에 연결할 수 없습니다.");
        return;
      }

      // API 응답 형식에 맞게 데이터 추출 (result 객체 안에 content가 있음)
      const resultData = response.result || response;
      setAdoptionPosts(
        resultData.content || resultData.data || resultData || []
      );

      if (resultData.pageable) {
        setAdoptionCurrentPage(resultData.pageable.pageNumber);
      }
      setAdoptionTotalPages(resultData.totalPages || 0);
      setAdoptionTotalElements(resultData.totalElements || 0);
    } catch (err) {
      console.error("분양게시판 목록 조회 실패:", err);

      // 네트워크 오류인 경우 더 친화적인 메시지 표시
      if (err.code === "ERR_NETWORK" || err.message?.includes("네트워크")) {
        setAdoptionError(
          "분양게시판 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
        );
      } else {
        setAdoptionError("분양게시판 목록을 불러오는데 실패했습니다.");
      }

      setAdoptionPosts([]);
    } finally {
      setAdoptionLoading(false);
    }
  };

  // 분양게시판 페이지 변경 함수
  const handleAdoptionPageChange = (page) => {
    setAdoptionCurrentPage(page);
    fetchAdoptionPosts(page + 1);
  };

  // 유기동물 데이터를 API 응답 형식에 맞게 변환하는 함수
  const transformStrayAnimalData = (animal) => {
    return {
      id: animal.desertionNo || animal.id,
      title: animal.kindNm || animal.kindCd || "유기동물",
      image:
        animal.popfile1 ||
        animal.popfile ||
        animal.filename ||
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: animal.careAddr || animal.orgNm || "위치 정보 없음",
      age: animal.age || "나이 정보 없음",
      gender:
        animal.sexCd === "M"
          ? "수컷"
          : animal.sexCd === "F"
          ? "암컷"
          : animal.sexCd === "Q"
          ? "미상"
          : "성별 정보 없음",
      rescueDate: animal.happenDt
        ? `${animal.happenDt.slice(0, 4)}-${animal.happenDt.slice(
            4,
            6
          )}-${animal.happenDt.slice(6, 8)}`
        : "날짜 정보 없음",

      views: 0,
      likes: 0,
      // 추가 정보
      kindCd: animal.kindCd,
      kindNm: animal.kindNm,
      upKindCd: animal.upKindCd,
      upKindNm: animal.upKindNm,
      orgNm: animal.orgNm,
      careTel: animal.careTel,
      noticeNo: animal.noticeNo,
      desertionNo: animal.desertionNo,
      happenPlace: animal.happenPlace,
      specialMark: animal.specialMark,
      neuterYn: animal.neuterYn,
      sexCd: animal.sexCd,
    };
  };

  // 분양게시판 데이터를 API 응답 형식에 맞게 변환하는 함수
  const transformAdoptionData = (post) => {
    return {
      id: post.postId,
      title: post.title,
      image:
        post.thumbnailImage ||
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      location: post.address || "위치 정보 없음",
      age: post.age || "나이 정보 없음",
      gender:
        post.sexCode === "M"
          ? "수컷"
          : post.sexCode === "F"
          ? "암컷"
          : "성별 정보 없음",
      price:
        post.fee === 0 || post.fee === "0"
          ? "무료분양"
          : `${Number(post.fee).toLocaleString()}원`,
      date: new Date().toISOString().split("T")[0], // 현재 날짜로 설정
      views: post.viewCount || 0,
      likes: post.likeCount || 0, // API에 없으므로 기본값
      comments: post.commentCount || 0, // API에 없으므로 기본값
      // 예약상태 정보 추가
      reservationStatus: post.reservationStatus || "A",
      // 추가 정보
      content: post.content,
      petCategory: post.petCategory,
      petKind: post.petKind,
      vaccine: post.vaccine,
      neuterYn: post.neuterYn,
      active: post.active,
    };
  };

  // 변환된 데이터 상태
  const [rescuePosts, setRescuePosts] = useState([]);
  const [adoptionPostsData, setAdoptionPostsData] = useState([]);

  // API 데이터를 변환하여 저장
  useEffect(() => {
    if (strayAnimals.length > 0) {
      const transformedData = strayAnimals.map(transformStrayAnimalData);
      setRescuePosts(transformedData);
    } else {
      setRescuePosts([]);
    }
  }, [strayAnimals]);

  useEffect(() => {
    if (adoptionPosts.length > 0) {
      const transformedData = adoptionPosts.map(transformAdoptionData);
      setAdoptionPostsData(transformedData);
    } else {
      setAdoptionPostsData([]);
    }
  }, [adoptionPosts]);

  // HTTP를 HTTPS로 변환하는 함수
  const convertToHttps = (url) => {
    if (!url) return url;
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
  };

  const PostCard = ({ post, isRescue = false }) => (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => {
        console.log("PostCard 클릭:", { post, isRescue, id: post.id });
        const targetUrl = isRescue
          ? `/rescue-detail/${post.id}`
          : `/adoption-detail/${post.id}`;
        console.log("이동할 URL:", targetUrl);
        navigate(targetUrl);
        console.log("navigate 함수 실행 완료");
      }}
    >
      <div className="relative">
        <img
          src={
            isRescue
              ? `${API_BASE_URL}${ABS}/stray-animal-board/proxy-image?imageUrl=${post.image}`
              : post.image
          }
          alt={post.title}
          className="w-full h-72 object-cover"
        />
        {!isRescue && post.price === "무료분양" && (
          <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-500">
            무료분양
          </Badge>
        )}
        {/* 분양게시판일 때만 예약상태 뱃지 표시 */}
        {!isRescue && (
          <Badge
            className={`absolute top-2 right-2 ${
              post.reservationStatus === "R"
                ? "bg-yellow-500 hover:bg-yellow-500"
                : post.reservationStatus === "C"
                ? "bg-gray-500 hover:bg-gray-500"
                : "bg-green-500 hover:bg-green-500"
            }`}
          >
            {post.reservationStatus === "R"
              ? "예약중"
              : post.reservationStatus === "C"
              ? "분양완료"
              : "예약가능"}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{post.location}</span>
          </div>
          <div className="flex justify-between">
            <span>나이: {post.age}</span>
            <span>성별: {post.gender}</span>
          </div>
          <div className="flex justify-between items-center">
            {isRescue ? (
              <span className="font-bold text-gray-700">
                구조일: {post.rescueDate}
              </span>
            ) : (
              <span className="font-bold text-orange-600">{post.price}</span>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{isRescue ? post.rescueDate : post.date}</span>
            </div>
          </div>
          {/* 분양동물(분양게시판)일 때만 조회수/좋아요/댓글 표시 */}
          {!isRescue && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-xs">{post.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4 text-pink-400" />
                  <span className="text-xs">{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4 text-blue-400" />
                  <span className="text-xs">{post.comments}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderPagination = () => {
    // 모바일에서는 간단한 페이징, 데스크톱에서는 전체 페이징
    if (isMobile) {
      // 모바일에서는 3개 페이지 번호만 표시
      const maxVisiblePages = 3;
      const startPage = Math.max(
        0,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

      return (
        <div className="mt-8 flex items-center justify-center gap-2 px-4">
          <button
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-2 py-1.5 text-xs bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed min-w-[35px]"
          >
            이전
          </button>

          {/* 첫 페이지가 보이지 않을 때만 표시 */}
          {startPage > 0 && (
            <>
              <button
                onClick={() => handlePageChange(0)}
                className="px-2 py-1.5 text-xs bg-gray-200 text-gray-700 rounded min-w-[25px]"
              >
                1
              </button>
              {startPage > 1 && (
                <span className="text-xs text-gray-400 px-1">...</span>
              )}
            </>
          )}

          {/* 현재 페이지 범위 */}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-2 py-1.5 text-xs rounded min-w-[25px] ${
                currentPage === page
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-orange-100"
              }`}
            >
              {page + 1}
            </button>
          ))}

          {/* 마지막 페이지가 보이지 않을 때만 표시 */}
          {endPage < totalPages - 1 && (
            <>
              {endPage < totalPages - 2 && (
                <span className="text-xs text-gray-400 px-1">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages - 1)}
                className="px-2 py-1.5 text-xs bg-gray-200 text-gray-700 rounded min-w-[25px]"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="px-2 py-1.5 text-xs bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed min-w-[35px]"
          >
            다음
          </button>
        </div>
      );
    }

    // 데스크톱에서는 5개 페이지 번호 표시
    const maxVisiblePages = 5;
    const startPage = Math.max(
      0,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    return (
      <Pagination className="mt-8">
        <PaginationContent className="flex flex-wrap justify-center gap-1">
          {/* 이전 버튼 */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              className={`${
                currentPage === 0
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:text-orange-500"
              } text-sm`}
            />
          </PaginationItem>

          {/* 첫 페이지가 보이지 않을 때만 표시 */}
          {startPage > 0 && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(0)}
                  className="cursor-pointer text-sm px-2 hover:text-orange-500"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 1 && (
                <PaginationItem>
                  <PaginationEllipsis className="text-sm px-1" />
                </PaginationItem>
              )}
            </>
          )}

          {/* 현재 페이지 범위 */}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
                className="cursor-pointer text-sm px-2 hover:text-orange-500"
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* 마지막 페이지가 보이지 않을 때만 표시 */}
          {endPage < totalPages - 1 && (
            <>
              {endPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis className="text-sm px-1" />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(totalPages - 1)}
                  className="cursor-pointer text-sm px-2 hover:text-orange-500"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* 다음 버튼 */}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                handlePageChange(Math.min(totalPages - 1, currentPage + 1))
              }
              className={`${
                currentPage === totalPages - 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:text-orange-500"
              } text-sm`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderAdoptionPagination = () => {
    console.log("분양게시판 페이징 렌더링:", {
      adoptionCurrentPage,
      adoptionTotalPages,
      adoptionTotalElements,
    });

    // 모바일에서는 간단한 페이징, 데스크톱에서는 전체 페이징
    if (isMobile) {
      // 모바일에서는 3개 페이지 번호만 표시
      const maxVisiblePages = 3;
      const startPage = Math.max(
        0,
        adoptionCurrentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(
        adoptionTotalPages - 1,
        startPage + maxVisiblePages - 1
      );

      return (
        <div className="mt-8 flex items-center justify-center gap-2 px-4">
          <button
            onClick={() =>
              handleAdoptionPageChange(Math.max(0, adoptionCurrentPage - 1))
            }
            disabled={adoptionCurrentPage === 0}
            className="px-2 py-1.5 text-xs bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed min-w-[35px]"
          >
            이전
          </button>

          {/* 첫 페이지가 보이지 않을 때만 표시 */}
          {startPage > 0 && (
            <>
              <button
                onClick={() => handleAdoptionPageChange(0)}
                className="px-2 py-1.5 text-xs bg-gray-200 text-gray-700 rounded min-w-[25px]"
              >
                1
              </button>
              {startPage > 1 && (
                <span className="text-xs text-gray-400 px-1">...</span>
              )}
            </>
          )}

          {/* 현재 페이지 범위 */}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <button
              key={page}
              onClick={() => handleAdoptionPageChange(page)}
              className={`px-2 py-1.5 text-xs rounded min-w-[25px] ${
                adoptionCurrentPage === page
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-orange-100"
              }`}
            >
              {page + 1}
            </button>
          ))}

          {/* 마지막 페이지가 보이지 않을 때만 표시 */}
          {endPage < adoptionTotalPages - 1 && (
            <>
              {endPage < adoptionTotalPages - 2 && (
                <span className="text-xs text-gray-400 px-1">...</span>
              )}
              <button
                onClick={() => handleAdoptionPageChange(adoptionTotalPages - 1)}
                className="px-2 py-1.5 text-xs bg-gray-200 text-gray-700 rounded min-w-[25px]"
              >
                {adoptionTotalPages}
              </button>
            </>
          )}

          <button
            onClick={() =>
              handleAdoptionPageChange(
                Math.min(adoptionTotalPages - 1, adoptionCurrentPage + 1)
              )
            }
            disabled={adoptionCurrentPage === adoptionTotalPages - 1}
            className="px-2 py-1.5 text-xs bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed min-w-[35px]"
          >
            다음
          </button>
        </div>
      );
    }

    // 데스크톱에서는 5개 페이지 번호 표시
    const maxVisiblePages = 5;
    const startPage = Math.max(
      0,
      adoptionCurrentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(
      adoptionTotalPages - 1,
      startPage + maxVisiblePages - 1
    );

    return (
      <Pagination className="mt-8">
        <PaginationContent className="flex flex-wrap justify-center gap-1">
          {/* 이전 버튼 */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                handleAdoptionPageChange(Math.max(0, adoptionCurrentPage - 1))
              }
              className={`${
                adoptionCurrentPage === 0
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:text-orange-500"
              } text-sm`}
            />
          </PaginationItem>

          {/* 첫 페이지가 보이지 않을 때만 표시 */}
          {startPage > 0 && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => handleAdoptionPageChange(0)}
                  className="cursor-pointer text-sm px-2 hover:text-orange-500"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 1 && (
                <PaginationItem>
                  <PaginationEllipsis className="text-sm px-1" />
                </PaginationItem>
              )}
            </>
          )}

          {/* 현재 페이지 범위 */}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handleAdoptionPageChange(page)}
                isActive={adoptionCurrentPage === page}
                className="cursor-pointer text-sm px-2 hover:text-orange-500"
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* 마지막 페이지가 보이지 않을 때만 표시 */}
          {endPage < adoptionTotalPages - 1 && (
            <>
              {endPage < adoptionTotalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis className="text-sm px-1" />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    handleAdoptionPageChange(adoptionTotalPages - 1)
                  }
                  className="cursor-pointer text-sm px-2 hover:text-orange-500"
                >
                  {adoptionTotalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* 다음 버튼 */}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                handleAdoptionPageChange(
                  Math.min(adoptionTotalPages - 1, adoptionCurrentPage + 1)
                )
              }
              className={`${
                adoptionCurrentPage === adoptionTotalPages - 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:text-orange-500"
              } text-sm`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 min-h-[500px]">
              <Tabs
                value={activeTab}
                className="w-full"
                onValueChange={setActiveTab}
              >
                <div className="flex justify-between items-center mb-6">
                  <TabsList className="grid w-auto grid-cols-2">
                    <TabsTrigger value="rescue">유기동물분양게시판</TabsTrigger>
                    <TabsTrigger value="adoption">분양게시판</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="rescue">
                  <div className="space-y-6">
                    {/* 검색 및 필터 영역 */}
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <Select
                          value={selectedRegion}
                          onValueChange={setSelectedRegion}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="지역 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem
                                key={region.value}
                                value={region.value}
                              >
                                {region.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="검색어를 입력하세요"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setCurrentPage(0);
                              fetchStrayAnimals(0);
                            }
                          }}
                          className="flex-1"
                        />
                      </div>

                      {/* 카테고리 버튼 */}
                      <div className="flex space-x-2">
                        {categories.map((category) => (
                          <Button
                            key={category}
                            variant={
                              selectedCategory === category
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className={
                              selectedCategory === category
                                ? "bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white"
                                : "hover:bg-orange-50 hover:text-orange-600"
                            }
                          >
                            {category}
                          </Button>
                        ))}
                      </div>

                      {/* 성별 필터 버튼 */}
                      <div className="flex space-x-2">
                        {genderOptions.map((gender) => (
                          <Button
                            key={gender}
                            variant={
                              selectedGender === gender ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedGender(gender)}
                            className={
                              selectedGender === gender
                                ? "bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white"
                                : "hover:bg-orange-50 hover:text-orange-600"
                            }
                          >
                            {gender}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          유기동물분양게시판
                        </h2>
                        <p className="text-sm text-gray-600">
                          새로운 가족을 기다리는 아이들
                        </p>
                      </div>
                      {!loading && !error && totalElements > 0 && (
                        <div className="text-sm text-gray-500">
                          총 {totalElements}개 중 {currentPage * pageSize + 1}-
                          {Math.min(
                            (currentPage + 1) * pageSize,
                            totalElements
                          )}
                          개
                        </div>
                      )}
                    </div>

                    {/* 로딩 상태 */}
                    {loading && (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
                        <span className="text-gray-600">
                          유기동물 정보를 불러오는 중...
                        </span>
                      </div>
                    )}

                    {/* 에러 상태 */}
                    {error && !loading && (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <p className="text-red-500 mb-4">{error}</p>
                          <Button
                            onClick={() => fetchStrayAnimals(currentPage)}
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            다시 시도
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* 데이터가 없을 때 */}
                    {!loading && !error && rescuePosts.length === 0 && (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <p className="text-gray-500 mb-4">
                            {strayAnimals.length === 0
                              ? "유기동물 데이터를 불러오는 중입니다..."
                              : "검색 조건에 맞는 유기동물이 없습니다."}
                          </p>
                          {strayAnimals.length === 0 && (
                            <div className="flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
                              <span className="text-sm text-gray-600">
                                데이터 로딩 중...
                              </span>
                            </div>
                          )}
                          {strayAnimals.length > 0 && (
                            <Button
                              onClick={() => {
                                setSearchTerm("");
                                setSelectedRegion("all");
                                setSelectedCategory("전체");
                                setSelectedGender("전체");
                                setCurrentPage(0);
                              }}
                              variant="outline"
                            >
                              필터 초기화
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 데이터 표시 */}
                    {!loading && !error && rescuePosts.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {rescuePosts.map((post) => (
                          <PostCard key={post.id} post={post} isRescue={true} />
                        ))}
                      </div>
                    )}
                    {renderPagination()}
                  </div>
                </TabsContent>

                <TabsContent value="adoption">
                  <div className="space-y-6">
                    {/* 검색 및 필터 영역 */}
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <Select
                          value={adoptionAddress}
                          onValueChange={setAdoptionAddress}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="지역 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="전체">전체 지역</SelectItem>
                            {regions
                              .filter((region) => region.value !== "all")
                              .map((region) => (
                                <SelectItem
                                  key={region.value}
                                  value={region.value}
                                >
                                  {region.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="검색어를 입력하세요"
                          value={adoptionSearchWord}
                          onChange={(e) =>
                            setAdoptionSearchWord(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setAdoptionCurrentPage(0);
                              fetchAdoptionPosts(0);
                            }
                          }}
                          className="flex-1"
                        />
                      </div>

                      {/* 카테고리 버튼 */}
                      <div className="flex space-x-2">
                        {categories.map((category) => (
                          <Button
                            key={category}
                            variant={
                              adoptionPetCategory === category
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setAdoptionPetCategory(category)}
                            className={
                              adoptionPetCategory === category
                                ? "bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white"
                                : "hover:bg-orange-50 hover:text-orange-600"
                            }
                          >
                            {category}
                          </Button>
                        ))}
                      </div>

                      {/* 성별 필터 버튼 */}
                      <div className="flex space-x-2">
                        {genderOptions.map((gender) => (
                          <Button
                            key={gender}
                            variant={
                              adoptionSex === gender ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setAdoptionSex(gender)}
                            className={
                              adoptionSex === gender
                                ? "bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white"
                                : "hover:bg-orange-50 hover:text-orange-600"
                            }
                          >
                            {gender}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          분양게시판
                        </h2>
                        <p className="text-sm text-gray-600">
                          새로운 가족을 기다리는 아이들
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {/* 로그인한 사용자만 버튼 표시 */}
                        {isLoggedIn && (
                          <Button
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={() => navigate("/adoption/create")}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            분양글 작성
                          </Button>
                        )}
                        {/* 총 데이터 개수는 항상 표시 */}
                        {!adoptionLoading &&
                          !adoptionError &&
                          adoptionTotalElements > 0 && (
                            <div className="text-sm text-gray-500">
                              총 {adoptionTotalElements}개 중{" "}
                              {adoptionCurrentPage * pageSize + 1}-
                              {Math.min(
                                (adoptionCurrentPage + 1) * pageSize,
                                adoptionTotalElements
                              )}
                              개
                            </div>
                          )}
                      </div>
                    </div>

                    {/* 로딩 상태 */}
                    {adoptionLoading && (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500 mr-2" />
                        <span className="text-gray-600">
                          분양게시판 정보를 불러오는 중...
                        </span>
                      </div>
                    )}

                    {/* 에러 상태 */}
                    {adoptionError && !adoptionLoading && (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <p className="text-red-500 mb-4">{adoptionError}</p>
                          <Button
                            onClick={() =>
                              fetchAdoptionPosts(adoptionCurrentPage)
                            }
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            다시 시도
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* 데이터가 없을 때 */}
                    {!adoptionLoading &&
                      !adoptionError &&
                      adoptionPostsData.length === 0 && (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <p className="text-gray-500 mb-4">
                              검색 조건에 맞는 분양글이 없습니다.
                            </p>
                            <Button
                              onClick={() => {
                                setAdoptionSearchWord("");
                                setAdoptionPetCategory("전체");
                                setAdoptionAddress("전체");
                                setAdoptionSex("전체");
                                setAdoptionCurrentPage(0);
                              }}
                              variant="outline"
                            >
                              필터 초기화
                            </Button>
                          </div>
                        </div>
                      )}

                    {/* 데이터 표시 */}
                    {!adoptionLoading &&
                      !adoptionError &&
                      adoptionPostsData.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {adoptionPostsData.map((post) => (
                            <PostCard
                              key={post.id}
                              post={post}
                              isRescue={false}
                            />
                          ))}
                        </div>
                      )}

                    {/* 분양게시판 페이징 */}
                    {adoptionPostsData.length > 0 && (
                      <div className="mt-8">{renderAdoptionPagination()}</div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
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
    </div>
  );
};

export default AdoptionPage;
