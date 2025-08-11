import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Crown } from "lucide-react";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, BOARD } from "../../configs/host-config";
import { useNavigate } from "react-router-dom";

const PetShowcase = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // API에서 인기 소개 게시글 가져오기
  useEffect(() => {
    const fetchPopularPets = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${API_BASE_URL}${BOARD}/main`
        );
        console.log(response);

        // API 응답을 컴포넌트에서 사용할 형태로 매핑
        const mappedPets = response.data.map((pet, index) => ({
          id: pet.postId,
          postid: pet.postId,
          name: pet.title,
          image: pet.thumbnailImage,
          likes: pet.likeCount || 0,
          comments: pet.commentCount || 0,
          owner: pet.nickname,
          rank: index + 1,
        }));

        setPets(mappedPets);
      } catch (err) {
        console.error("인기 소개 게시글 조회 실패:", err);
        setError("인기 게시글을 불러오는데 실패했습니다.");
        // 에러 시 기본 데이터 설정
        setPets([
          {
            id: 1,
            name: "골든 리트리버 해피",
            image:
              "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            likes: 24,
            comments: 8,
            owner: "사랑이맘",
            rank: 1,
          },
          {
            id: 2,
            name: "페르시안 고양이 나비",
            image:
              "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            likes: 31,
            comments: 12,
            owner: "냥집사",
            rank: 2,
          },
          {
            id: 3,
            name: "코리안숏헤어 츄츄",
            image:
              "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            likes: 18,
            comments: 5,
            owner: "고양이사랑",
            rank: 3,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPets();
  }, []);

  const PetCard = ({ pet, isLarge = false }) => (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
        isLarge ? "md:h-full" : "h-48"
      } relative`}
      onClick={() => navigate(`/detail/introduction/${pet.postid ?? pet.id}`)}
    >
      <div className="relative h-full">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* 왕관 아이콘 */}
        <div className="absolute top-2 left-2">
          <Crown
            className={`h-6 w-6 ${
              pet.rank === 1
                ? "text-yellow-400"
                : pet.rank === 2
                ? "text-gray-300"
                : "text-amber-600"
            }`}
            fill="currentColor"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3
            className={`font-bold mb-1 ${
              isLarge ? "md:text-xl text-sm" : "text-sm"
            }`}
          >
            {pet.name}
          </h3>
          <p
            className={`text-gray-200 mb-2 ${
              isLarge ? "md:text-sm text-xs" : "text-xs"
            }`}
          >
            by {pet.owner}
          </p>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Heart
                className={`${
                  isLarge ? "md:h-4 md:w-4 h-3 w-3" : "h-3 w-3"
                } text-pink-400`}
              />
              <span className={isLarge ? "md:text-sm text-xs" : "text-xs"}>
                {pet.likes}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle
                className={`${
                  isLarge ? "md:h-4 md:w-4 h-3 w-3" : "h-3 w-3"
                } text-blue-400`}
              />
              <span className={isLarge ? "md:text-sm text-xs" : "text-xs"}>
                {pet.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-yellow-50 to-pink-50 p-6 rounded-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            우리 아이들 자랑하기
          </h2>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500">인기 게시글을 불러오는 중...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-r from-yellow-50 to-pink-50 p-6 rounded-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            우리 아이들 자랑하기
          </h2>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-yellow-50 to-pink-50 p-6 rounded-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          우리 아이들 자랑하기
        </h2>
      </div>

      {pets.length >= 3 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <PetCard pet={pets[0]} isLarge={!isMobile} />
          </div>
          <div className="space-y-4">
            <PetCard pet={pets[1]} />
            <PetCard pet={pets[2]} />
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-500">인기 게시글이 없습니다.</div>
        </div>
      )}
    </section>
  );
};

export default PetShowcase;
