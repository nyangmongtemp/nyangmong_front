import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL, FESTIVAL } from "../../configs/host-config";
import axios from "axios";

const APP_KEY = import.meta.env.VITE_KAKAO_MAP_API;

const TestMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const clustererRef = useRef(null);
  const [search, setSearch] = useState("");
  const userMarkerRef = useRef(null);
  const infowindowRef = useRef(null);
  const [festivalList, setFestivalList] = useState([]); // 행사 데이터
  const [hospitalList, setHospitalList] = useState([]); // 병원 데이터(추후 API 연동)
  const [activeTab, setActiveTab] = useState("festival"); // 탭 상태: 'festival' | 'hospital'
  const searchInputRef = useRef(null); // 검색 input ref
  const handleSearchRef = useRef(); // handleSearch 함수 ref

  // festival 전체 데이터 최초 요청
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}${FESTIVAL}/all`)
      .then((res) => {
        console.log("/festival-service/api/all 응답:", res);
        setFestivalList(res.data || []);
      })
      .catch((err) => {
        console.error("/festival-service/api/all 에러:", err);
      });
    // 병원 데이터는 추후 API 연동 예정
    // setHospitalList([]);
  }, []);

  // 검색 버튼 클릭 시 실행 (기존 handleSearch)
  const handleSearch = () => {
    if (
      !window.kakao ||
      !window.kakao.maps ||
      !window.kakao.maps.services ||
      !mapInstance.current ||
      !clustererRef.current
    ) {
      alert("카카오맵이 아직 로드되지 않았습니다.");
      return;
    }
    var places = new window.kakao.maps.services.Places();
    var callback = function (result, status) {
      if (
        status === window.kakao.maps.services.Status.OK &&
        result.length > 0
      ) {
        console.log(result);
        // 첫번째 결과의 좌표
        const x = parseFloat(result[0].x);
        const y = parseFloat(result[0].y);
        // 지도 중심 이동
        mapInstance.current.setCenter(new window.kakao.maps.LatLng(y, x));
        // 마커 생성
        var marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(y, x),
        });
        // 클러스터러에 마커 추가
        clustererRef.current.clear(); // 기존 마커 제거
        clustererRef.current.addMarker(marker);
        // === 추가: 해당 location에 매칭되는 festival 객체 찾기 ===
        const matchedFestival = festivalList.find(
          (item) =>
            item.location &&
            item.location.trim() !== "" &&
            search.trim() !== "" &&
            item.location.trim() === search.trim()
        );
        // 인포윈도우 내용 생성
        const content = `
          <div style="padding: 16px; min-width: 300px; font-family: Arial, sans-serif;">
            ${
              matchedFestival
                ? `<div style=\"margin-bottom: 8px;\"><strong style=\"color: #ff9800; font-size: 18px;\">${matchedFestival.title}</strong></div>`
                : ""
            }
            <div style="margin-bottom: 12px;">
              <strong style="color: #ff9800; font-size: 16px;">장소명:</strong>
              <p style="margin: 4px 0; font-size: 16px; font-weight: bold;">${
                result[0].place_name
              }</p>
            </div>
            <div style="margin-bottom: 8px;">
              <strong style="color: #ff9800; font-size: 14px;">카테고리:</strong>
              <p style="margin: 4px 0; font-size: 14px; color: #666;">${
                result[0].category_group_name || "정보 없음"
              }</p>
            </div>
            <div style="margin-bottom: 8px;">
              <strong style="color: #ff9800; font-size: 14px;">전화번호:</strong>
              <p style="margin: 4px 0; font-size: 14px;">${
                result[0].phone || "정보 없음"
              }</p>
            </div>
            <div style="margin-bottom: 8px;">
              <strong style="color: #ff9800; font-size: 14px;">주소:</strong>
              <p style="margin: 4px 0; font-size: 14px;">${
                result[0].road_address_name ||
                result[0].address_name ||
                "정보 없음"
              }</p>
            </div>
            ${
              matchedFestival && matchedFestival.url
                ? `<div style=\"margin-top: 8px;\"><a href=\"${matchedFestival.url}\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: #007bff; text-decoration: underline; font-size: 14px;\">행사 상세 정보 바로가기</a></div>`
                : ""
            }
            ${
              result[0].place_url
                ? `
            <div style="margin-top: 12px;">
              <a href="${result[0].place_url}" target="_blank" rel="noopener noreferrer" 
                 style="color: #007bff; text-decoration: none; font-size: 14px; padding: 6px 12px; border: 1px solid #007bff; border-radius: 4px; display: inline-block;">
                카카오맵에서 보기
              </a>
            </div>
            `
                : ""
            }
          </div>
        `;
        // 인포윈도우 생성
        if (infowindowRef.current) {
          infowindowRef.current.close();
        }
        infowindowRef.current = new window.kakao.maps.InfoWindow({
          content: content,
          removable: true,
          maxWidth: 350,
        });
        // 마커 클릭 시 인포윈도우 표시
        window.kakao.maps.event.addListener(marker, "click", function () {
          infowindowRef.current.open(mapInstance.current, marker);
        });
      }
    };
    places.keywordSearch(`${search}`, callback);
  };
  // handleSearch를 ref에 저장
  handleSearchRef.current = handleSearch;

  // 카카오맵 로딩 useEffect (기존 코드 그대로)
  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        initMapWithKakaoLoad();
        return;
      }
      const existingScript = document.querySelector(
        'script[src*="dapi.kakao.com"]'
      );
      if (existingScript) {
        existingScript.addEventListener("load", initMapWithKakaoLoad);
        return;
      }
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false&libraries=services,clusterer`;
      script.async = true;
      script.onload = initMapWithKakaoLoad;
      document.head.appendChild(script);
    };
    const initMapWithKakaoLoad = () => {
      if (!window.kakao || !window.kakao.maps) return;
      window.kakao.maps.load(function () {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            showMap(lat, lng);
          },
          (error) => {
            showMap(33.450701, 126.570667);
          }
        );
      });
    };
    const showMap = (lat, lng) => {
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3,
      };
      mapInstance.current = new window.kakao.maps.Map(mapContainer, mapOption);
      // 클러스터러 생성 및 저장
      clustererRef.current = new window.kakao.maps.MarkerClusterer({
        map: mapInstance.current,
        averageCenter: true,
        minLevel: 5,
      });
      // 현재 위치 마커 생성 및 지도에 표시
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
      userMarkerRef.current = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(lat, lng),
        map: mapInstance.current,
        title: "현재 위치",
      });
    };
    loadKakaoMap();
  }, []);

  // 버튼 클릭 시 location으로 검색 실행
  const handleFestivalButtonClick = (location) => {
    setSearch(location);
    // input에 포커스
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // 검색 실행 (setState 후 실행 보장 위해 setTimeout)
    setTimeout(() => {
      if (handleSearchRef.current) {
        handleSearchRef.current();
      }
    }, 0);
  };

  // 병원 버튼 클릭 시 (추후 병원 검색 로직 추가 가능)
  const handleHospitalButtonClick = (location) => {
    setSearch(location);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    setTimeout(() => {
      if (handleSearchRef.current) {
        handleSearchRef.current();
      }
    }, 0);
  };

  // 지역 목록 (AdoptionPage.jsx 참고)
  const regionOptions = [
    "전체",
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "경기",
    "강원도",
    "강원특별자치도",
    "충청북도",
    "충청남도",
    "세종",
    "전라북도",
    "전라남도",
    "전북특별자치도",
    "경상북도",
    "경상남도",
    "제주",
  ];
  const [selectedRegion, setSelectedRegion] = useState("전체");

  // 탭에 따라 버튼 리스트 결정 (병원 탭일 때 지역 필터 적용 구조 준비)
  const buttonList =
    activeTab === "festival"
      ? festivalList.filter(
          (item) => item.location && item.location.trim() !== ""
        )
      : hospitalList.filter((item) => {
          if (!item.location || item.location.trim() === "") return false;
          if (selectedRegion === "전체") return true;
          return item.location.includes(selectedRegion);
        });
  const buttonClickHandler =
    activeTab === "festival"
      ? handleFestivalButtonClick
      : handleHospitalButtonClick;

  return (
    <div>
      <div ref={mapRef} id="map" style={{ width: "100%", height: "600px" }} />
      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          ref={searchInputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색어를 입력하세요"
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: 4,
            width: 240,
            marginRight: 8,
          }}
        />
        <button
          style={{
            padding: "8px 16px",
            background: "#ff9800",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={handleSearch}
        >
          검색
        </button>
      </div>
      {/* 탭 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          margin: "16px 0 8px 0",
        }}
      >
        <button
          onClick={() => setActiveTab("festival")}
          style={{
            padding: "8px 24px",
            background: activeTab === "festival" ? "#ff9800" : "#ffe0b2",
            color: activeTab === "festival" ? "white" : "#ff9800",
            border: "1px solid #ff9800",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          행사
        </button>
        <button
          onClick={() => setActiveTab("hospital")}
          style={{
            padding: "8px 24px",
            background: activeTab === "hospital" ? "#ff9800" : "#ffe0b2",
            color: activeTab === "hospital" ? "white" : "#ff9800",
            border: "1px solid #ff9800",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          병원
        </button>
      </div>
      {/* 병원 탭일 때만 지역 선택 셀렉트박스 */}
      {activeTab === "hospital" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={{
              padding: "8px 16px",
              border: "1px solid #ff9800",
              borderRadius: 6,
              fontWeight: 500,
              color: "#ff9800",
              background: "#fffbe6",
              fontSize: 16,
              minWidth: 160,
            }}
          >
            {regionOptions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* 버튼 리스트 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          margin: "8px 0 16px 0",
        }}
      >
        {buttonList.map((item) => (
          <button
            key={item.festivalId || item.hospitalId || item.id}
            style={{
              padding: "6px 12px",
              background: "#ffe0b2",
              color: "#ff9800",
              border: "1px solid #ff9800",
              borderRadius: 6,
              marginBottom: 4,
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={() => buttonClickHandler(item.location)}
          >
            {item.title || item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestMap;
