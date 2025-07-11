import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Eye,
  Heart,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";

const Board = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  // API에서 받아온 행사 게시글 저장
  const [apiPosts, setApiPosts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchWord, setSearchWord] = useState("");
  const [searchWordInput, setSearchWordInput] = useState("");
  const [parentSelectedDate, setParentSelectedDate] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // API 호출 및 데이터 매핑
  // 페이지나 type이 바뀔 때마다 API 호출
  useEffect(() => {
    console.log("useEffect triggered:", {
      currentPage,
      type,
      searchWord,
      parentSelectedDate,
    });

    if (type === "event") {
      const searchDateParam = parentSelectedDate
        ? `&searchDate=${parentSelectedDate.toLocaleDateString("sv-SE")}` // 'YYYY-MM-DD'
        : "";

      axios
        .get(
          `http://localhost:8000/festival-service/api/festivals?searchWord=${searchWord}${searchDateParam}&page=${currentPage}&size=${postsPerPage}`
        )
        .then((res) => {
          const festivals = res.data.content || [];

          const mappedPosts = festivals.map((festival) => {
            let imageUrl = null;
            if (festival.imagePath) {
              const match = festival.imagePath.match(/src\s*=\s*([^&\s]+)/i);
              if (match && match[1]) {
                imageUrl = decodeURIComponent(match[1]);
              }
            }

            const datePattern = /(\d{4}\.\d{2}\.\d{2})/g;
            const dates = festival.festivalDate.match(datePattern);

            let category = "행사";
            if (dates && dates.length === 2) {
              const [startStr, endStr] = dates;
              const startDate = new Date(startStr.replace(/\./g, "-"));
              const endDate = new Date(endStr.replace(/\./g, "-"));
              const now = new Date();

              if (now < startDate) {
                category = "진행예정";
              } else if (now >= startDate && now <= endDate) {
                category = "진행중";
              } else {
                category = "종료";
              }
            }

            return {
              id: festival.festivalId,
              title: festival.title,
              content: festival.location ? `위치: ${festival.location}` : "",
              date: festival.festivalDate,
              category,
              imageUrl,
              money: festival.money,
              url: festival.url,
              reservationDate: festival.reservationDate,
              description: festival.description,
              time: festival.festivalTime,
            };
          });

          setApiPosts(mappedPosts);
          setTotalPages(res.data.totalPages || 1);
        })
        .catch((err) => {
          console.error("행사 게시글 불러오기 실패", err);
          setApiPosts([]);
          setTotalPages(1);
        });
      console.log("선택된 날짜:", parentSelectedDate?.toISOString());
    }
  }, [type, currentPage, searchWord, parentSelectedDate]);

  const handleSelectedDateChange = (date) => {
    setParentSelectedDate(date);
    setCurrentPage(1); // 날짜 검색 시 페이지 초기화
  };

  // 게시판 제목 매핑
  const boardTitles = {
    free: "자유게시판",
    question: "질문게시판",
    review: "후기게시판",
    event: "행사게시판",
  };

  // 더미 데이터 및 API 데이터 분기 처리
  const getBoardSpecificPosts = (boardType) => {
    if (boardType === "event") {
      return apiPosts;
    }

    // 기존 더미 데이터 (생략 없이 그대로 넣으세요)
    const basePosts = {
      free: [
        {
          id: 1,
          title: "우리 고양이 자랑하고 싶어요 ㅎㅎ",
          content:
            "너무 귀여운 우리 고양이 사진 공유합니다~ 오늘 새로운 장난감 사줬더니 정말 좋아해요!",
          author: "냥이맘",
          createdAt: "10분 전",
          views: 234,
          likes: 24,
          comments: 12,
          category: "자유",
          isHot: true,
        },
        {
          id: 2,
          title: "강아지 훈련 팁 공유 부탁드려요!",
          content:
            "강아지 배변 훈련이나 앉아, 기다려 같은 기본 훈련 팁 있으시면 공유 부탁드립니다! 초보 견주라 어렵네요 ㅠㅠ",
          author: "멍뭉이사랑",
          createdAt: "30분 전",
          views: 180,
          likes: 18,
          comments: 8,
          category: "자유",
          isHot: false,
        },
        {
          id: 3,
          title: "이번 주말에 반려동물 동반 카페 갈 사람?",
          content:
            "날씨도 좋은데 이번 주말에 반려동물 동반 가능한 카페 가실 분 계신가요? 서울 근교면 좋겠어요!",
          author: "카페조아",
          createdAt: "1시간 전",
          views: 150,
          likes: 15,
          comments: 5,
          category: "자유",
          isHot: true,
        },
        {
          id: 4,
          title: "고양이 간식 추천해주세요!",
          content:
            "우리 고양이가 입맛이 까다로워서 간식 고르기가 힘드네요. 기호성 좋은 고양이 간식 추천해주시면 감사하겠습니다!",
          author: "까탈냥",
          createdAt: "2시간 전",
          views: 120,
          likes: 10,
          comments: 3,
          category: "자유",
          isHot: false,
        },
        {
          id: 5,
          title: "반려동물과 함께하는 여행 후기",
          content:
            "지난주에 반려동물과 함께 제주도 여행 다녀왔어요! 펫프렌들리 숙소랑 식당 정보 공유합니다~",
          author: "여행견주",
          createdAt: "3시간 전",
          views: 300,
          likes: 30,
          comments: 20,
          category: "자유",
          isHot: true,
        },
        {
          id: 6,
          title: "털갈이 시기 대비 꿀팁 아시는 분?",
          content:
            "강아지 털갈이 시기라 털이 너무 많이 빠지네요 ㅠㅠ 효과적인 털 관리 꿀팁이나 용품 추천해주시면 감사하겠습니다.",
          author: "털과의전쟁",
          createdAt: "4시간 전",
          views: 90,
          likes: 5,
          comments: 2,
          category: "자유",
          isHot: false,
        },
        {
          id: 7,
          title: "새로운 펫 용품 구매했어요!",
          content:
            "이번에 새로 출시된 강아지 쿨매트 구매했는데 너무 좋네요! 후기 공유합니다.",
          author: "신상킬러",
          createdAt: "5시간 전",
          views: 110,
          likes: 8,
          comments: 4,
          category: "자유",
          isHot: false,
        },
        {
          id: 8,
          title: "반려동물 보험 가입 고민 중인데..",
          content:
            "반려동물 보험 가입을 고민 중인데, 어떤 보험이 좋을지 추천해주실 분 계신가요? 장단점도 알려주시면 감사하겠습니다.",
          author: "보험고민",
          createdAt: "6시간 전",
          views: 170,
          likes: 12,
          comments: 7,
          category: "자유",
          isHot: true,
        },
        {
          id: 9,
          title: "우리집 앵무새 개인기 공개!",
          content: "우리집 앵무새가 '사랑해'라고 말해요! 영상 공유합니다 ㅎㅎ",
          author: "말하는새",
          createdAt: "7시간 전",
          views: 250,
          likes: 20,
          comments: 10,
          category: "자유",
          isHot: true,
        },
        {
          id: 10,
          title: "고양이 행동 전문가의 조언",
          content:
            "고양이의 특정 행동에 대한 전문가의 조언을 얻을 수 있는 곳이 있을까요?",
          author: "고양이행동",
          createdAt: "8시간 전",
          views: 80,
          likes: 3,
          comments: 1,
          category: "자유",
          isHot: false,
        },
        {
          id: 11,
          title: "강아지 수제 간식 만들기 도전!",
          content:
            "강아지에게 건강한 수제 간식을 만들어주고 싶어서 도전해봤어요. 레시피 공유합니다!",
          author: "요리견주",
          createdAt: "9시간 전",
          views: 130,
          likes: 11,
          comments: 6,
          category: "자유",
          isHot: false,
        },
        {
          id: 12,
          title: "반려동물과의 이별, 어떻게 극복해야 할까요?",
          content:
            "오랜 시간 함께한 반려동물이 무지개 다리를 건넜어요. 너무 슬픈데 어떻게 이겨내야 할까요?",
          author: "슬픈집사",
          createdAt: "10시간 전",
          views: 400,
          likes: 50,
          comments: 25,
          category: "자유",
          isHot: true,
        },
        {
          id: 13,
          title: "새끼 고양이 입양 준비물 추천",
          content:
            "새끼 고양이를 입양할 예정인데, 어떤 준비물이 필요할까요? 필수템 위주로 알려주세요!",
          author: "냥이예비맘",
          createdAt: "11시간 전",
          views: 95,
          likes: 6,
          comments: 3,
          category: "자유",
          isHot: false,
        },
        {
          id: 14,
          title: "강아지 미용 스타일 추천",
          content:
            "우리 강아지 미용 시기가 다가오는데, 어떤 스타일로 해줄지 고민이네요. 예쁜 미용 스타일 추천 부탁드려요!",
          author: "미용고민",
          createdAt: "12시간 전",
          views: 160,
          likes: 14,
          comments: 9,
          category: "자유",
          isHot: false,
        },
        {
          id: 15,
          title: "반려동물 이름 추천 받아요!",
          content:
            "새로운 강아지를 키우게 되었는데, 예쁘고 특이한 이름 추천 부탁드립니다!",
          author: "이름고민",
          createdAt: "13시간 전",
          views: 70,
          likes: 4,
          comments: 0,
          category: "자유",
          isHot: false,
        },
        {
          id: 16,
          title: "고양이 건강검진 주기 궁금해요",
          content:
            "고양이 건강검진은 몇 살부터 시작하고, 주기는 어떻게 되나요? 추천하는 병원도 있으면 좋겠습니다.",
          author: "건강염려",
          createdAt: "14시간 전",
          views: 100,
          likes: 7,
          comments: 2,
          category: "자유",
          isHot: false,
        },
        {
          id: 17,
          title: "반려동물과 함께하는 봉사활동 찾아요",
          content:
            "반려동물과 함께할 수 있는 봉사활동이 있다면 추천해주세요! 유기동물 보호소 봉사 등 관심 있습니다.",
          author: "봉사희망",
          createdAt: "15시간 전",
          views: 190,
          likes: 16,
          comments: 11,
          category: "자유",
          isHot: true,
        },
        {
          id: 18,
          title: "강아지 짖음 훈련 어떻게 해야 할까요?",
          content:
            "우리 강아지가 짖음이 심해서 고민입니다. 효과적인 짖음 훈련 방법이 있을까요?",
          author: "짖음고민",
          createdAt: "16시간 전",
          views: 140,
          likes: 9,
          comments: 5,
          category: "자유",
          isHot: false,
        },
        {
          id: 19,
          title: "고양이 장난감 어떤 게 좋을까요?",
          content:
            "활동량 많은 고양이에게 어떤 장난감이 좋을까요? 지루해하지 않고 잘 가지고 노는 장난감 추천 부탁드립니다.",
          author: "장난감찾아",
          createdAt: "17시간 전",
          views: 115,
          likes: 7,
          comments: 4,
          category: "자유",
          isHot: false,
        },
        {
          id: 20,
          title: "반려동물 동반 여행지 추천",
          content:
            "여름 휴가 때 반려동물과 함께 갈 만한 여행지 추천 부탁드려요! 국내 위주로요.",
          author: "여행가고파",
          createdAt: "18시간 전",
          views: 220,
          likes: 19,
          comments: 13,
          category: "자유",
          isHot: true,
        },
      ],
      question: [
        {
          id: 1,
          title: "강아지 산책 시 주의사항이 궁금해요",
          content:
            "처음으로 강아지를 키우게 되었는데, 산책할 때 어떤 점들을 주의해야 할까요? 목줄은 어떤 걸 사용하는 게 좋을까요?",
          author: "초보집사",
          createdAt: "5분 전",
          views: 89,
          likes: 7,
          comments: 15,
          category: "질문",
          isHot: true,
        },
        {
          id: 2,
          title: "고양이 사료 고르는 팁 있을까요?",
          content:
            "어떤 사료가 우리 고양이에게 잘 맞을지 모르겠어요. 사료 고르는 기준이나 추천 브랜드가 있다면 알려주세요.",
          author: "사료고민",
          createdAt: "15분 전",
          views: 70,
          likes: 5,
          comments: 8,
          category: "질문",
          isHot: false,
        },
        {
          id: 3,
          title: "반려동물 중성화 수술 꼭 해야 하나요?",
          content:
            "반려동물 중성화 수술에 대해 고민 중입니다. 꼭 필요한 수술인지, 장단점은 무엇인지 궁금해요.",
          author: "중성화고민",
          createdAt: "40분 전",
          views: 120,
          likes: 10,
          comments: 20,
          category: "질문",
          isHot: true,
        },
        {
          id: 4,
          title: "강아지 예방접종 시기 및 종류 알려주세요",
          content:
            "새끼 강아지 입양 예정인데, 예방접종은 언제부터 시작하고 어떤 종류를 맞아야 하는지 자세히 알려주세요!",
          author: "접종궁금",
          createdAt: "1시간 전",
          views: 95,
          likes: 8,
          comments: 12,
          category: "질문",
          isHot: false,
        },
        {
          id: 5,
          title: "고양이 화장실 냄새 제거 꿀팁은?",
          content:
            "고양이 화장실 냄새 때문에 고민이 많아요. 효과적으로 냄새를 제거할 수 있는 꿀팁이나 제품 추천 부탁드립니다.",
          author: "냄새고민",
          createdAt: "2시간 전",
          views: 110,
          likes: 9,
          comments: 18,
          category: "질문",
          isHot: true,
        },
        {
          id: 6,
          title: "강아지 훈련사 추천 부탁드려요",
          content:
            "우리 강아지 문제 행동 교정을 위해 훈련사를 찾고 있습니다. 실력 좋고 친절한 훈련사 추천해주시면 감사하겠습니다.",
          author: "훈련사찾아요",
          createdAt: "3시간 전",
          views: 130,
          likes: 11,
          comments: 22,
          category: "질문",
          isHot: true,
        },
        {
          id: 7,
          title: "반려동물과 해외여행 시 준비사항",
          content:
            "반려동물과 함께 해외여행을 계획 중입니다. 어떤 서류와 준비물이 필요한지, 주의할 점은 무엇인지 궁금해요.",
          author: "해외여행꿈",
          createdAt: "4시간 전",
          views: 60,
          likes: 4,
          comments: 5,
          category: "질문",
          isHot: false,
        },
        {
          id: 8,
          title: "고양이 중성화 수술 후 관리법",
          content:
            "고양이 중성화 수술 후 어떻게 관리해야 하나요? 회복 기간 동안 주의할 점이 궁금합니다.",
          author: "수술후관리",
          createdAt: "5시간 전",
          views: 80,
          likes: 6,
          comments: 10,
          category: "질문",
          isHot: false,
        },
        {
          id: 9,
          title: "강아지 노즈워크 장난감 추천",
          content:
            "우리 강아지가 똑똑해서 노즈워크 장난감을 사주려고 하는데, 어떤 제품이 좋을까요? 추천 부탁드립니다.",
          author: "노즈워크러버",
          createdAt: "6시간 전",
          views: 75,
          likes: 5,
          comments: 7,
          category: "질문",
          isHot: false,
        },
        {
          id: 10,
          title: "반려동물 건강검진 비용은 어느 정도인가요?",
          content:
            "반려동물 건강검진을 받아볼까 하는데, 대략적인 비용이 궁금해요. 병원마다 차이가 큰가요?",
          author: "건강걱정",
          createdAt: "7시간 전",
          views: 100,
          likes: 9,
          comments: 14,
          category: "질문",
          isHot: true,
        },
        {
          id: 11,
          title: "고양이 털빠짐이 심한데 해결책은?",
          content:
            "우리 고양이가 털갈이 시기도 아닌데 털빠짐이 너무 심해요. 혹시 좋은 해결책이나 영양제 있을까요?",
          author: "털뿜냥",
          createdAt: "8시간 전",
          views: 85,
          likes: 7,
          comments: 9,
          category: "질문",
          isHot: false,
        },
        {
          id: 12,
          title: "강아지 유치 빠지는 시기",
          content:
            "새끼 강아지인데 유치가 언제쯤 빠지고 영구치가 나나요? 이때 주의할 점이 있을까요?",
          author: "유치궁금",
          createdAt: "9시간 전",
          views: 50,
          likes: 3,
          comments: 4,
          category: "질문",
          isHot: false,
        },
        {
          id: 13,
          title: "반려동물 장례식장 선택 가이드",
          content:
            "사랑하는 반려동물과의 이별을 준비하며 장례식장을 알아보고 있습니다. 좋은 장례식장 선택 가이드가 있을까요?",
          author: "이별준비",
          createdAt: "10시간 전",
          views: 150,
          likes: 15,
          comments: 25,
          category: "질문",
          isHot: true,
        },
        {
          id: 14,
          title: "고양이 발톱 깎는 방법",
          content:
            "고양이 발톱 깎는 게 너무 어려워요. 안전하게 발톱 깎는 방법이나 팁이 있을까요?",
          author: "발톱고민",
          createdAt: "11시간 전",
          views: 65,
          likes: 4,
          comments: 6,
          category: "질문",
          isHot: false,
        },
        {
          id: 15,
          title: "강아지 알레르기 증상과 대처법",
          content:
            "우리 강아지가 알레르기 증상을 보이는 것 같아요. 어떤 증상이 나타나면 알레르기를 의심해야 하고, 어떻게 대처해야 할까요?",
          author: "알레르기걱정",
          createdAt: "12시간 전",
          views: 90,
          likes: 8,
          comments: 11,
          category: "질문",
          isHot: false,
        },
      ],
      review: [
        {
          id: 1,
          title: "○○병원 진료 후기 - 정말 친절하세요!",
          content:
            "우리 강아지 중성화 수술을 위해 방문했는데, 의료진분들이 정말 친절하고 꼼꼼하게 봐주셨어요. 적극 추천합니다!",
          author: "만족한견주",
          createdAt: "2시간 전",
          views: 345,
          likes: 28,
          comments: 16,
          category: "후기",
          isHot: true,
        },
        {
          id: 2,
          title: "새로 산 캣타워 후기 - 대만족!",
          content:
            "고양이가 너무 좋아해서 뿌듯하네요! 견고하고 디자인도 예뻐서 인테리어 효과도 있어요.",
          author: "캣타워성공",
          createdAt: "3시간 전",
          views: 280,
          likes: 22,
          comments: 10,
          category: "후기",
          isHot: false,
        },
        {
          id: 3,
          title: "반려동물 동반 식당 '펫테이블' 방문 후기",
          content:
            "음식도 맛있고 반려동물과 함께 편안하게 식사할 수 있어서 좋았어요. 사장님도 친절하시고 재방문 의사 100%입니다!",
          author: "맛집탐험대",
          createdAt: "5시간 전",
          views: 410,
          likes: 35,
          comments: 20,
          category: "후기",
          isHot: true,
        },
        {
          id: 4,
          title: "강아지 유치원 '해피펫' 후기",
          content:
            "사회성 부족한 우리 강아지가 유치원 다니면서 많이 활발해졌어요. 선생님들이 잘 돌봐주셔서 안심하고 맡기고 있습니다.",
          author: "성장하는댕댕이",
          createdAt: "7시간 전",
          views: 300,
          likes: 25,
          comments: 15,
          category: "후기",
          isHot: true,
        },
        {
          id: 5,
          title: "고양이 미용실 '냥이살롱' 후기",
          content:
            "스트레스 없이 안전하게 미용해주셔서 감사해요! 우리 고양이가 이렇게 얌전하게 미용하는 건 처음이네요.",
          author: "미용성공",
          createdAt: "9시간 전",
          views: 250,
          likes: 18,
          comments: 8,
          category: "후기",
          isHot: false,
        },
        {
          id: 6,
          title: "펫페어 방문 후기 - 지갑 털렸지만 행복!",
          content:
            "다양한 반려동물 용품들을 한자리에서 볼 수 있어서 좋았어요. 할인도 많이 해서 계획보다 많이 샀네요 ㅎㅎ",
          author: "텅장예약",
          createdAt: "1일 전",
          views: 500,
          likes: 40,
          comments: 30,
          category: "후기",
          isHot: true,
        },
        {
          id: 7,
          title: "반려동물 스튜디오 '찰칵' 촬영 후기",
          content:
            "우리 강아지 견생샷 건졌어요! 작가님이 반려동물 특성을 잘 이해하고 촬영해주셔서 자연스러운 사진이 많이 나왔습니다.",
          author: "견생샷장인",
          createdAt: "2일 전",
          views: 380,
          likes: 32,
          comments: 18,
          category: "후기",
          isHot: true,
        },
        {
          id: 8,
          title: "강아지 수제간식 클래스 후기",
          content:
            "강아지에게 직접 간식을 만들어줄 수 있어서 의미 있었어요. 레시피도 간단하고 재료도 신선해서 만족스럽습니다.",
          author: "요리하는집사",
          createdAt: "3일 전",
          views: 210,
          likes: 16,
          comments: 9,
          category: "후기",
          isHot: false,
        },
        {
          id: 9,
          title: "고양이 호텔 '캣츠하우스' 이용 후기",
          content:
            "깔끔한 시설과 전문적인 케어로 안심하고 맡길 수 있었어요. CCTV로 우리 냥이 잘 지내는지 확인할 수 있어서 좋았습니다.",
          author: "안심집사",
          createdAt: "4일 전",
          views: 290,
          likes: 20,
          comments: 11,
          category: "후기",
          isHot: true,
        },
        {
          id: 10,
          title: "반려동물 박람회 '펫페스티벌' 방문 후기",
          content:
            "다양한 부스와 이벤트가 많아서 즐거운 시간이었어요. 샘플도 많이 받고 좋은 정보도 얻어갑니다!",
          author: "축제즐겨",
          createdAt: "5일 전",
          views: 450,
          likes: 38,
          comments: 25,
          category: "후기",
          isHot: true,
        },
        {
          id: 11,
          title: "강아지 영양제 '조인트케어' 급여 후기",
          content:
            "관절이 좋지 않은 우리 강아지를 위해 구매했는데, 확실히 걷는 게 편해 보이고 활력이 생겼어요.",
          author: "건강지킴이",
          createdAt: "6일 전",
          views: 180,
          likes: 14,
          comments: 7,
          category: "후기",
          isHot: false,
        },
        {
          id: 12,
          title: "고양이 자동 급식기 '스마트피더' 사용 후기",
          content:
            "여행 갈 때나 늦게 귀가할 때 유용하게 사용하고 있어요. 정해진 시간에 사료가 나와서 편리합니다.",
          author: "스마트집사",
          createdAt: "7일 전",
          views: 230,
          likes: 17,
          comments: 10,
          category: "후기",
          isHot: false,
        },
        {
          id: 13,
          title: "반려동물 보험 '안심펫보험' 가입 후기",
          content:
            "든든하게 대비할 수 있어서 마음이 편해요. 청구 절차도 간편하고 보장 내용도 만족스럽습니다.",
          author: "보험든든",
          createdAt: "8일 전",
          views: 270,
          likes: 21,
          comments: 13,
          category: "후기",
          isHot: true,
        },
        {
          id: 14,
          title: "강아지 미용 가위 '프로컷' 사용 후기",
          content:
            "집에서 직접 미용하는데, 절삭력도 좋고 그립감도 편해서 초보자도 사용하기 좋아요.",
          author: "셀프미용",
          createdAt: "9일 전",
          views: 150,
          likes: 12,
          comments: 6,
          category: "후기",
          isHot: false,
        },
        {
          id: 15,
          title: "고양이 장난감 '레이저포인터' 구매 후기",
          content:
            "우리 고양이가 환장하고 달려들어요! 에너지를 발산하기에 최고의 장난감입니다.",
          author: "냥이신남",
          createdAt: "10일 전",
          views: 190,
          likes: 15,
          comments: 8,
          category: "후기",
          isHot: false,
        },
      ],
    };

    return basePosts[boardType] || basePosts.free;
  };

  const allPosts = getBoardSpecificPosts(type);
  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    type === "event"
      ? allPosts // 서버에서 이미 페이지 적용되어 왔음
      : allPosts.slice(indexOfFirstPost, indexOfLastPost); // 로컬에서 잘라야 하는 경우

  const handlePostClick = (post) => {
    if (type === "event" && post.url) {
      // 새 탭에서 해당 행사 URL로 이동
      window.open(post.url, "_blank");
    } else {
      // 일반 게시판일 경우 상세 페이지로 이동
      navigate(`/post/${type}/${post.id}`);
    }
  };

  const handleCreatePost = () => {
    navigate(`/create-post/${type}`);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    console.log(" 버튼 클릭, 새 페이지:", newPage);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-orange-50 hover:border-orange-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === i
              ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-orange-500"
              : "border-gray-300 hover:bg-orange-50 hover:border-orange-300"
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-orange-50 hover:border-orange-300"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-pink-100 border-b border-orange-200">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-orange-500" />
                  <span className="m1-2">{boardTitles[type] || "게시판"}</span>
                  <div className="flex-grow" />
                </CardTitle>
              </CardHeader>
              {type === "event" && (
                <div className="p-6 mt-4 mb-4 flex space-x-2 ">
                  <input
                    type="text"
                    placeholder="행사 제목으로 검색하세요"
                    value={searchWordInput}
                    onChange={(e) => setSearchWordInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <Button
                    onClick={() => {
                      setSearchWord(searchWordInput); // 실제 검색어 상태 변경
                      setCurrentPage(1); // 검색 시 페이지 초기화
                    }}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600"
                  >
                    검색
                  </Button>
                </div>
              )}
              {type === "event" && (
                <div className="relative flex items-center space-x-4 px-6 bottom-[20px]">
                  <DatePickerInput
                    selectDate={parentSelectedDate}
                    onSelectedDateChange={handleSelectedDateChange}
                  />
                  <Button
                    variant="outline"
                    className="h-[40px] px-4 border border-orange-300 text-orange-600 hover:bg-orange-50 rounded-lg"
                    onClick={() => handleSelectedDateChange(null)}
                  >
                    초기화
                  </Button>
                </div>
              )}
              <CardContent className="p-6">
                {/* 게시글 목록 */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-end mb-4">
                    {type === "event" ? (
                      <></>
                    ) : (
                      <Button
                        onClick={handleCreatePost}
                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        글쓰기
                      </Button>
                    )}
                  </div>

                  {currentPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-orange-300 transition-all cursor-pointer bg-white"
                    >
                      {/* 텍스트와 이미지 함께 flex로 묶기 */}
                      <div className="flex justify-between items-start">
                        {/* 텍스트 영역 */}
                        <div className="flex-1">
                          {/* 제목 + 카테고리 + HOT 뱃지 같이 묶기 */}
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900 hover:text-orange-600 transition-colors">
                              {post.title}
                            </h3>

                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                post.category === "질문"
                                  ? "border-blue-300 text-blue-600 bg-blue-50"
                                  : post.category === "후기"
                                  ? "border-green-300 text-green-600 bg-green-50"
                                  : post.category === "진행예정"
                                  ? "border-gray-400 text-gray-600 bg-gray-100"
                                  : post.category === "진행중"
                                  ? "border-orange-400 text-orange-600 bg-orange-100"
                                  : post.category === "종료"
                                  ? "border-red-400 text-red-600 bg-red-100"
                                  : "border-orange-300 text-orange-600 bg-orange-50"
                              }`}
                            >
                              {post.category}
                            </Badge>

                            {post.isHot && (
                              <Badge className="text-xs bg-red-500 hover:bg-red-500">
                                HOT
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {post.content}
                          </p>

                          {/* 행사 설명 */}
                          {post.description && (
                            <p className="text-sm text-gray-700 mb-1 line-clamp-2">
                              {post.description}
                            </p>
                          )}

                          {post.money && (
                            <p className="text-sm text-gray-700 mb-3 line-clamp-1">
                              요금정보: {post.money}
                            </p>
                          )}
                          {/* 예매 기간 정보 */}
                          {post.reservationDate &&
                            post.reservationDate.trim() !== "" && (
                              <p className="text-sm text-gray-700 mb-3">
                                예매기간: {post.reservationDate}
                              </p>
                            )}
                          {/* 행사 시간 추가 */}
                          {post.time && post.time.trim() !== "" && (
                            <p className="text-sm text-gray-700 mb-3">
                              행사시간: {post.time}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              {/* 작성자 정보는 event 게시판에서 숨기기 */}
                              {type !== "event" && (
                                <div className="flex items-center space-x-1">
                                  <User className="h-4 w-4" />
                                  <span>{post.author}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{post.createdAt}</span>
                                <span>{post.date}</span>
                              </div>
                            </div>
                            {/* 조회수/좋아요/댓글 아이콘은 event 게시판에서만 숨기기 */}
                            {type !== "event" && (
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-4 w-4" />
                                  <span>{post.views}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Heart className="h-4 w-4 text-red-400" />
                                  <span>{post.likes}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageCircle className="h-4 w-4 text-blue-400" />
                                  <span>{post.comments}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 이미지 영역 */}

                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-28 h-36 object-cover rounded-md ml-6 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* 페이지네이션 */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">{renderPagination()}</div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* 사이드바 */}
          {!isMobile && (
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
