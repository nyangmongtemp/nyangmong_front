import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import MapComponent from "@/components/MapComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, FESTIVAL, MAP } from "../../configs/host-config";

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [festivalList, setFestivalList] = useState([]); // 행사정보 리스트
  const [isFestivalLoading, setIsFestivalLoading] = useState(false);
  // 행사정보 상세(인포윈도우)용 상태
  const [selectedFestivalInfo, setSelectedFestivalInfo] = useState(null);
  // 행사정보 지역 필터 상태
  const [festivalRegion, setFestivalRegion] = useState("all");
  // 문화시설 하위 카테고리 상태
  const [showCultureSubCategories, setShowCultureSubCategories] =
    useState(false);
  const [selectedCultureSubCategory, setSelectedCultureSubCategory] =
    useState("12");
  // 문화시설 지역 선택 상태
  const [selectedCultureRegion, setSelectedCultureRegion] = useState("1");
  // 문화시설 검색 결과 상태
  const [cultureLocations, setCultureLocations] = useState([]);
  const [isCultureLoading, setIsCultureLoading] = useState(false);
  // 문화시설 상세 정보 상태
  const [selectedCultureDetail, setSelectedCultureDetail] = useState(null);
  const [isCultureDetailLoading, setIsCultureDetailLoading] = useState(false);

  const regionMap = {
    seoul: "서울",
    busan: "부산",
    daegu: "대구",
    incheon: "인천",
    gwangju: "광주",
    daejeon: "대전",
    ulsan: "울산",
    gyeonggi: "경기",
    gangwon: "강원",
    chungcheongbuk: "충북",
    chungcheongnam: "충남",
    sejong: "세종",
    jeollabuk: "전북",
    jeollanam: "전남",
    gyeongsangbuk: "경북",
    gyeongsangnam: "경남",
    jeju: "제주",
  };
  const regionOptions = [
    { value: "all", label: "전체" },
    ...Object.entries(regionMap).map(([key, label]) => ({ value: key, label })),
  ];

  // 문화시설 하위 카테고리 옵션
  const cultureSubCategories = [
    { value: "12", name: "관광지" },
    { value: "14", name: "문화시설" },
    { value: "28", name: "레포츠" },
    { value: "32", name: "숙박" },
    { value: "38", name: "쇼핑" },
    { value: "39", name: "음식점" },
  ];

  // 문화시설 지역 선택 옵션
  const cultureRegionOptions = [
    { value: "1", label: "서울" },
    { value: "2", label: "인천" },
    { value: "3", label: "대전" },
    { value: "4", label: "대구" },
    { value: "5", label: "광주" },
    { value: "6", label: "부산" },
    { value: "7", label: "울산" },
    { value: "8", label: "세종" },
    { value: "31", label: "경기" },
    { value: "32", label: "강원" },
    { value: "33", label: "충북" },
    { value: "34", label: "충남" },
    { value: "35", label: "경북" },
    { value: "36", label: "경남" },
    { value: "37", label: "전북" },
    { value: "38", label: "전남" },
    { value: "39", label: "제주" },
  ];

  const categories = [
    { id: "all", name: "전체" },
    { id: "event", name: "행사정보" },
    { id: "culture", name: "반려동물 입장가능 문화시설" },
    { id: "hospital", name: "동물병원" },
    { id: "grooming", name: "애견미용실" },
    { id: "restaurant", name: "반려동물 입장가능 업장" },
    { id: "shelter", name: "유기견보호소" },
    { id: "park", name: "산책명소" },
  ];

  const regions = [
    { id: "all", name: "전체지역" },
    { id: "gangnam", name: "강남구" },
    { id: "jung", name: "중구" },
    { id: "mapo", name: "마포구" },
    { id: "seocho", name: "서초구" },
    { id: "songpa", name: "송파구" },
  ];

  const allLocations = [
    {
      id: 1,
      name: "서울역 근처 분양",
      address: "서울 중구 세종대로 18",
      category: "event",
      region: "jung",
      lat: 37.5556,
      lng: 126.9723,
    },
    {
      id: 2,
      name: "남부터미널역 근처 분양",
      address: "서울 서초구 서초대로 지하 194",
      category: "culture",
      region: "seocho",
      lat: 37.4767,
      lng: 127.0041,
    },
    {
      id: 3,
      name: "강남역 근처 분양",
      address: "서울 강남구 강남대로 390",
      category: "hospital",
      region: "gangnam",
      lat: 37.4979,
      lng: 127.0276,
    },
    {
      id: 4,
      name: "홍대입구역 근처 분양",
      address: "서울 마포구 양화로 160",
      category: "grooming",
      region: "mapo",
      lat: 37.5573,
      lng: 126.9235,
    },
    {
      id: 5,
      name: "건대입구역 근처 분양",
      address: "서울 광진구 아차산로 272",
      category: "restaurant",
      region: "gangnam",
      lat: 37.5403,
      lng: 127.0695,
    },
    {
      id: 6,
      name: "신촌역 근처 분양",
      address: "서울 서대문구 신촌로 120",
      category: "shelter",
      region: "mapo",
      lat: 37.5556,
      lng: 126.9368,
    },
    {
      id: 7,
      name: "잠실역 근처 분양",
      address: "서울 송파구 올림픽로 265",
      category: "park",
      region: "songpa",
      lat: 37.5133,
      lng: 127.1,
    },
    {
      id: 8,
      name: "종로3가역 근처 분양",
      address: "서울 종로구 종로 151",
      category: "event",
      region: "jung",
      lat: 37.5703,
      lng: 126.991,
    },
    {
      id: 9,
      name: "을지로3가역 근처 분양",
      address: "서울 중구 을지로 166",
      category: "culture",
      region: "jung",
      lat: 37.5663,
      lng: 126.991,
    },
    {
      id: 10,
      name: "동대문역 근처 분양",
      address: "서울 중구 청계천로 428",
      category: "hospital",
      region: "jung",
      lat: 37.5712,
      lng: 127.0094,
    },
  ];

  const filteredLocations = allLocations.filter((location) => {
    const matchesCategory =
      selectedCategory === "all" || location.category === selectedCategory;
    const matchesRegion =
      selectedRegion === "all" || location.region === selectedRegion;
    const matchesSearch = location.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesRegion && matchesSearch;
  });

  // 행사정보 fetch
  useEffect(() => {
    if (selectedCategory === "event") {
      setIsFestivalLoading(true);
      axiosInstance
        .get(`${API_BASE_URL}${FESTIVAL}/all`)
        .then((res) => {
          setFestivalList(res.data || []);
        })
        .catch((err) => {
          setFestivalList([]);
        })
        .finally(() => setIsFestivalLoading(false));
    }
  }, [selectedCategory]);

  // 문화시설 카테고리/지역 변경 시 POST 요청
  useEffect(() => {
    if (selectedCategory === "culture") {
      setIsCultureLoading(true);
      console.log(selectedCultureRegion);
      console.log(selectedCultureSubCategory);

      axiosInstance
        .post(`${API_BASE_URL}${MAP}/find`, {
          region: selectedCultureRegion,
          contentType: selectedCultureSubCategory,
        })
        .then((res) => {
          console.log(res);

          setCultureLocations(res.data?.result || res.data || []);
        })
        .catch((err) => {
          setCultureLocations([]);
        })
        .finally(() => setIsCultureLoading(false));
    }
  }, [selectedCategory, selectedCultureSubCategory, selectedCultureRegion]);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedLocation(null);
    // 문화시설 카테고리 클릭 시 하위 카테고리 표시
    if (categoryId === "culture") {
      setShowCultureSubCategories(true);
    } else {
      setShowCultureSubCategories(false);
      setSelectedCultureSubCategory("12");
    }
  };

  // 하위 카테고리 클릭 핸들러는 위에서 직접 setSelectedCultureSubCategory로 대체
  // 필요시 setSelectedLocation(null); 추가 가능

  // 현재 선택된 문화시설 하위 카테고리 라벨값 구하기
  const selectedCultureLabel = cultureSubCategories.find(
    (cat) => cat.value === selectedCultureSubCategory
  )?.name;

  // 문화시설 카드 클릭 시 detail 요청
  const handleCultureLocationClick = async (location) => {
    setIsCultureDetailLoading(true);
    setSelectedLocation(location); // 카드 active 효과

    try {
      const res = await axiosInstance.get(
        `${API_BASE_URL}${MAP}/detail/${location.mapId}`
      );
      console.log(res);

      setSelectedCultureDetail(res.data?.result || res.data || null);
    } catch (err) {
      setSelectedCultureDetail(null);
    } finally {
      setIsCultureDetailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* 상단 검색 영역 */}
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Input
                    placeholder="제목으로 검색"
                    className="flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select
                    value={selectedRegion}
                    onValueChange={setSelectedRegion}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
                    검색
                  </Button>
                </div>

                {/* 카테고리 버튼들 */}
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          selectedCategory === category.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleCategoryClick(category.id)}
                        className={
                          selectedCategory === category.id
                            ? "bg-orange-500 hover:bg-orange-600"
                            : ""
                        }
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>

                  {/* 문화시설 하위 카테고리 버튼들 */}
                  {showCultureSubCategories && (
                    <div className="mt-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                          {cultureSubCategories.map((subCategory) => (
                            <Button
                              key={subCategory.value}
                              variant={
                                selectedCultureSubCategory === subCategory.value
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                setSelectedCultureSubCategory(subCategory.value)
                              }
                              className={
                                selectedCultureSubCategory === subCategory.value
                                  ? "bg-blue-500 hover:bg-blue-600"
                                  : "border-blue-300 text-blue-600 hover:bg-blue-50"
                              }
                            >
                              {subCategory.name}
                            </Button>
                          ))}
                        </div>
                        {/* 문화시설 지역 선택 셀렉트박스 */}
                        <Select
                          value={selectedCultureRegion}
                          onValueChange={setSelectedCultureRegion}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="지역 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {cultureRegionOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 행사정보 카테고리일 때: 행사 카드 리스트 */}
              {selectedCategory === "event" && (
                <div className="p-6 border-b">
                  <div className="flex items-center mb-2 gap-2">
                    <h3 className="text-lg font-semibold">행사정보 목록</h3>
                    {/* 행사정보 지역 셀렉트박스 */}
                    <select
                      className="ml-4 border rounded px-2 py-1 text-sm"
                      value={festivalRegion}
                      onChange={(e) => setFestivalRegion(e.target.value)}
                    >
                      {regionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {isFestivalLoading ? (
                    <div className="text-center py-8 text-gray-400">
                      불러오는 중...
                    </div>
                  ) : festivalList.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      행사정보가 없습니다.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-x-4 gap-y-4 h-[312px] overflow-y-auto pr-2 justify-center">
                      {festivalList
                        .filter((festival) => festival.location)
                        .filter((festival) => {
                          if (festivalRegion === "all") return true;
                          const regionName = regionMap[festivalRegion];
                          const addr = festival.addr || festival.location || "";
                          return addr.slice(0, 2) === regionName;
                        })
                        .filter((festival, idx, arr) => {
                          // title+location 조합이 중복되지 않게
                          return (
                            arr.findIndex(
                              (f) =>
                                f.title === festival.title &&
                                f.location === festival.location
                            ) === idx
                          );
                        })
                        .map((festival) => (
                          <Card
                            key={festival.festivalId || festival.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedLocation?.id ===
                              (festival.festivalId || festival.id)
                                ? "ring-2 ring-orange-500"
                                : ""
                            } w-[320px] min-w-[320px] max-w-[320px]`}
                            onClick={() => {
                              handleLocationClick({
                                id: festival.festivalId || festival.id,
                                name: festival.title,
                                address: festival.location,
                                category: "event",
                                lat: festival.latitude,
                                lng: festival.longitude,
                              });
                              setSelectedFestivalInfo(festival);
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                  <h4 className="font-medium text-black text-sm whitespace-normal break-words">
                                    {festival.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1 whitespace-normal break-words">
                                    {festival.location}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* 문화시설 카테고리일 때: 문화시설 목록 노출 */}
              {selectedCategory === "culture" && (
                <div className="p-6">
                  <div className="space-y-8">
                    {/* 위: 목록 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        문화시설 목록 ({cultureLocations.length}개)
                      </h3>
                      {isCultureLoading ? (
                        <div className="text-center py-8 text-gray-400">
                          불러오는 중...
                        </div>
                      ) : cultureLocations.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          문화시설이 없습니다.
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-x-4 gap-y-4 h-[312px] overflow-y-auto pr-2 justify-center">
                          {cultureLocations
                            .filter(
                              (location) => location.addr || location.addr1
                            ) // addr 또는 addr1이 있는 경우만 렌더링
                            .map((location) => (
                              <Card
                                key={location.mapId || location.title}
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                  selectedLocation?.mapId === location.mapId
                                    ? "ring-2 ring-orange-500"
                                    : ""
                                } w-[320px] min-w-[320px] max-w-[320px]`}
                                onClick={() =>
                                  handleCultureLocationClick(location)
                                }
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start space-x-3">
                                    <MapPin className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-900 text-sm">
                                        {location.title}
                                      </h4>
                                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                                        {selectedCultureLabel}
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 아래: 지도 */}
              <div className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">위치 지도</h3>
                  <div className="h-[700px] rounded-lg overflow-hidden border relative z-0">
                    <MapComponent
                      locations={
                        selectedCategory === "event"
                          ? festivalList
                              .filter((f) => f.latitude && f.longitude)
                              .map((f) => ({
                                id: f.festivalId || f.id,
                                name: f.title,
                                address: f.location,
                                category: "event",
                                lat: f.latitude,
                                lng: f.longitude,
                              }))
                          : selectedCategory === "culture"
                          ? cultureLocations
                          : filteredLocations
                      }
                      selectedLocation={selectedLocation}
                      onLocationClick={handleLocationClick}
                      selectedFestivalInfo={
                        selectedCategory === "event"
                          ? selectedFestivalInfo
                          : null
                      }
                      selectedCultureDetail={
                        selectedCategory === "culture"
                          ? selectedCultureDetail
                          : null
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">냥</span>
              </div>
              <p className="font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                냥몽 - 반려동물과 함께하는 따뜻한 커뮤니티
              </p>
            </div>
            <p className="text-sm">© 2024 냥몽. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MapPage;
