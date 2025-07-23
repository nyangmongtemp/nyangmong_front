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
import {
  API_BASE_URL,
  FESTIVAL,
  MAP,
  HOSPITAL,
  STYLE,
} from "../../configs/host-config";

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
  // 동물병원 관련 상태
  const [showHospitalRegion, setShowHospitalRegion] = useState(false);
  const [selectedHospitalRegion, setSelectedHospitalRegion] = useState("1");
  const [hospitalCategoryOptions, setHospitalCategoryOptions] = useState([]);
  const [selectedHospitalCategory, setSelectedHospitalCategory] = useState("");
  const [hospitalList, setHospitalList] = useState([]);
  const [isHospitalLoading, setIsHospitalLoading] = useState(false);
  const [selectedHospitalInfo, setSelectedHospitalInfo] = useState(null);
  // 반려동물 미용실 관련 상태
  const [showGroomingRegion, setShowGroomingRegion] = useState(false);
  const [selectedGroomingRegion, setSelectedGroomingRegion] = useState("1");
  // 미용실 세부지역(구) 상태
  const [groomingDistrictOptions, setGroomingDistrictOptions] = useState([]);
  const [selectedGroomingDistrict, setSelectedGroomingDistrict] = useState("");
  // 미용실 리스트 상태
  const [groomingList, setGroomingList] = useState([]);
  // 미용실 상세 정보 상태 (MapComponent로 전달)
  const [selectedGroomingDetail, setSelectedGroomingDetail] = useState(null);
  // 미용실 지역 변경 시 리스트 요청
  useEffect(() => {
    const groomingCategories = [
      "style",
      "cafe",
      "shop",
      "museum",
      "art",
      "literary",
      "drug",
    ];
    const isGroomingCategory = groomingCategories.includes(selectedCategory);

    if (isGroomingCategory) {
      setShowGroomingRegion(true);
      axiosInstance
        .get(
          `${API_BASE_URL}${STYLE}/region/list/${selectedGroomingRegion}/${selectedCategory}`
        )
        .then((res) => {
          const districts = res.data?.result || [];
          setGroomingDistrictOptions(districts);
          setSelectedGroomingDistrict(districts[0] || "");
          console.log("미용실 지역 리스트 응답:", res);
        })
        .catch((err) => {
          setGroomingDistrictOptions([]);
          setSelectedGroomingDistrict("");
          console.error("미용실 지역 리스트 요청 실패:", err);
        });
    } else {
      setShowGroomingRegion(false);
      setGroomingDistrictOptions([]);
      setSelectedGroomingDistrict("");
    }
  }, [selectedCategory, selectedGroomingRegion]);

  // 미용실 세부지역(구) 값이 바뀔 때마다 미용실 리스트 요청
  useEffect(() => {
    const groomingCategories = [
      "style",
      "cafe",
      "shop",
      "museum",
      "art",
      "literary",
      "drug",
    ];
    const isGroomingCategory = groomingCategories.includes(selectedCategory);

    if (
      isGroomingCategory &&
      selectedGroomingRegion &&
      selectedGroomingDistrict
    ) {
      axiosInstance
        .get(
          `${API_BASE_URL}${STYLE}/list/${selectedGroomingRegion}/${selectedGroomingDistrict}/${selectedCategory}`
        )
        .then((res) => {
          const list = res.data?.result || [];
          setGroomingList(list);
          console.log("미용실 리스트 응답:", res);
        })
        .catch((err) => {
          setGroomingList([]);
          console.error("미용실 리스트 요청 실패:", err);
        });
    }
  }, [selectedCategory, selectedGroomingRegion, selectedGroomingDistrict]);

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

  // 동물병원 지역 선택 옵션 (전체 제외)
  const hospitalRegionOptions = cultureRegionOptions;

  const categories = [
    { id: "all", name: "전체" },
    { id: "event", name: "행사정보" },
    { id: "culture", name: "반려동물 입장가능 문화시설" },
    { id: "hospital", name: "동물병원" },
    { id: "style", name: "반려동물 미용실" },
    { id: "cafe", name: "반려동물 카페" },
    { id: "shop", name: "반려동물용품샵" },
    { id: "museum", name: "반려동물 박물관" },
    { id: "art", name: "미술관" },
    { id: "literary", name: "반려동물 문예시설" },
    { id: "drug", name: "반려동물 약국" },
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
        .get(`${API_BASE_URL}${FESTIVAL}/api/all`)
        .then((res) => {
          console.log(res);

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

  // 동물병원 지역 변경 시 category 요청
  useEffect(() => {
    if (selectedCategory === "hospital") {
      console.log("동물병원 지역 선택:", selectedHospitalRegion);

      // category 요청으로 두 번째 셀렉트박스 옵션 가져오기
      axiosInstance
        .get(`${API_BASE_URL}${HOSPITAL}/category/${selectedHospitalRegion}`)
        .then((res) => {
          console.log("동물병원 category 응답:", res);
          const categoryData = res.data?.result || res.data || [];
          setHospitalCategoryOptions(categoryData);

          // 첫 번째 값으로 기본값 설정
          if (categoryData.length > 0) {
            setSelectedHospitalCategory(categoryData[0]);
          }
        })
        .catch((err) => {
          console.error("동물병원 category 요청 실패:", err);
          setHospitalCategoryOptions([]);
          setSelectedHospitalCategory("");
        });
    }
  }, [selectedCategory, selectedHospitalRegion]);

  // 동물병원 카테고리 변경 시 list 요청
  useEffect(() => {
    if (selectedCategory === "hospital" && selectedHospitalCategory) {
      setIsHospitalLoading(true);
      console.log("동물병원 카테고리 선택:", selectedHospitalCategory);

      // list 요청
      axiosInstance
        .get(
          `${API_BASE_URL}${HOSPITAL}/list/${selectedHospitalRegion}/${selectedHospitalCategory}`
        )
        .then((res) => {
          console.log("동물병원 list 응답:", res);
          // res.data.result에서 동물병원 배열을 가져옴 (전체)
          const hospitalData = Array.isArray(res.data?.result)
            ? res.data.result
            : [];
          setHospitalList(hospitalData);
        })
        .catch((err) => {
          console.error("동물병원 list 요청 실패:", err);
          setHospitalList([]);
        })
        .finally(() => setIsHospitalLoading(false));
    }
  }, [selectedCategory, selectedHospitalRegion, selectedHospitalCategory]);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedLocation(null);
    // 문화시설 카테고리 클릭 시 하위 카테고리 표시
    if (categoryId === "culture") {
      setShowCultureSubCategories(true);
      setShowHospitalRegion(false);
    } else if (categoryId === "hospital") {
      setShowHospitalRegion(true);
      setShowCultureSubCategories(false);
    } else {
      setShowCultureSubCategories(false);
      setShowHospitalRegion(false);
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

  // 동물병원 카드 클릭 시 detail 요청
  const handleHospitalLocationClick = async (hospital) => {
    setSelectedLocation(hospital); // 카드 active 효과

    try {
      const res = await axiosInstance.get(
        `${API_BASE_URL}${HOSPITAL}/detail/${hospital.hospitalId}`
      );
      console.log("동물병원 상세 정보 응답:", res);

      setSelectedHospitalInfo(res.data?.result || res.data || null);
    } catch (err) {
      console.error("동물병원 상세 정보 요청 실패:", err);
      setSelectedHospitalInfo(null);
    }
  };

  // 미용실 카드 클릭 시 상세 정보 요청
  const handleGroomingCardClick = (shop) => {
    axiosInstance
      .get(`${API_BASE_URL}${STYLE}/detail/${selectedCategory}/${shop.id}`)
      .then((res) => {
        console.log(res.data.result);

        setSelectedGroomingDetail(res.data.result || null);
        console.log(selectedGroomingDetail);
      })
      .catch((err) => {
        setSelectedGroomingDetail(null);
        console.error("미용실 상세 정보 요청 실패:", err);
      });
  };

  // groomingCategories와 isGroomingCategory를 컴포넌트 함수 시작 직후에 한 번만 선언
  const groomingCategories = [
    "style",
    "cafe",
    "shop",
    "museum",
    "art",
    "literary",
    "drug",
  ];
  const isGroomingCategory = groomingCategories.includes(selectedCategory);

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

                  {/* 동물병원 지역 선택 셀렉트박스 */}
                  {showHospitalRegion && (
                    <div className="mt-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <Select
                          value={selectedHospitalRegion}
                          onValueChange={setSelectedHospitalRegion}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="지역 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {hospitalRegionOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* 두 번째 셀렉트박스: 카테고리 선택 */}
                        {hospitalCategoryOptions.length > 0 && (
                          <Select
                            value={selectedHospitalCategory}
                            onValueChange={setSelectedHospitalCategory}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="카테고리 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {hospitalCategoryOptions.map((option, index) => (
                                <SelectItem key={index} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  )}
                  {/* 미용실 지역 선택 셀렉트박스 */}
                  {showGroomingRegion && (
                    <div className="mt-4">
                      <div className="flex flex-wrap items-center gap-4">
                        {/* 상위 지역(도/시) 셀렉트박스 */}
                        <Select
                          value={selectedGroomingRegion}
                          onValueChange={setSelectedGroomingRegion}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="지역 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {hospitalRegionOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {/* 세부지역(구) 셀렉트박스 */}
                        <Select
                          value={selectedGroomingDistrict}
                          onValueChange={setSelectedGroomingDistrict}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="세부지역 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {groomingDistrictOptions.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
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

              {/* 동물병원 카테고리일 때: 동물병원 목록 노출 */}
              {selectedCategory === "hospital" && (
                <div className="p-6 border-b">
                  <div className="flex items-center mb-2 gap-2">
                    <h3 className="text-lg font-semibold">동물병원 목록</h3>
                  </div>
                  {isHospitalLoading ? (
                    <div className="text-center py-8 text-gray-400">
                      불러오는 중...
                    </div>
                  ) : hospitalList.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      동물병원이 없습니다.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-x-4 gap-y-4 h-[312px] overflow-y-auto pr-2 justify-center">
                      {(Array.isArray(hospitalList) ? hospitalList : [])
                        .filter((hospital) => hospital.hospitalName)
                        .map((hospital) => (
                          <Card
                            key={hospital.hospitalId}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedLocation?.hospitalId ===
                              hospital.hospitalId
                                ? "ring-2 ring-orange-500"
                                : ""
                            } w-[320px] min-w-[320px] max-w-[320px]`}
                            onClick={() =>
                              handleHospitalLocationClick(hospital)
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                  <h4 className="font-medium text-black text-sm whitespace-normal break-words">
                                    {hospital.hospitalName}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1 whitespace-normal break-words">
                                    {hospital.fullAddress}
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

              {/* 미용실 리스트 카드 렌더링 */}
              {isGroomingCategory && groomingList.length > 0 && (
                <div className="p-6 border-b">
                  <div className="flex flex-wrap gap-x-4 gap-y-4 h-[312px] overflow-y-auto pr-2 justify-center">
                    {groomingList.map((shop) => (
                      <Card
                        key={shop.id}
                        className="cursor-pointer transition-all hover:shadow-md w-[320px] min-w-[320px] max-w-[320px]"
                        onClick={() => handleGroomingCardClick(shop)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-medium text-black text-sm whitespace-normal break-words">
                                {shop.facilityName}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1 whitespace-normal break-words">
                                {shop.fullAddress}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* 아래: 지도 */}
              <div className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">위치 지도</h3>
                  <div className="h-[700px] rounded-lg overflow-hidden border relative z-0">
                    <MapComponent
                      key={selectedCategory}
                      locations={
                        isGroomingCategory
                          ? []
                          : selectedCategory === "event"
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
                          : selectedCategory === "hospital"
                          ? (Array.isArray(hospitalList)
                              ? hospitalList
                              : []
                            ).map((h) => ({
                              id: h.hospitalId,
                              name: h.hospitalName,
                              address: h.fullAddress,
                              category: "hospital",
                              lat: h.mapy, // 카카오맵 Y좌표
                              lng: h.mapx, // 카카오맵 X좌표
                            }))
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
                      selectedHospitalInfo={
                        selectedCategory === "hospital"
                          ? selectedHospitalInfo
                          : null
                      }
                      selectedHospitalDetail={
                        selectedCategory === "hospital"
                          ? selectedHospitalInfo
                          : null
                      }
                      selectedCategory={selectedCategory}
                      selectedGroomingDetail={selectedGroomingDetail}
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
