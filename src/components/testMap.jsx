import React, { useEffect, useRef, useState } from "react";

const APP_KEY = import.meta.env.VITE_KAKAO_MAP_API;

const TestMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const clustererRef = useRef(null);
  const [search, setSearch] = useState("");
  const userMarkerRef = useRef(null);
  const infowindowRef = useRef(null);

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

  // 검색 버튼 클릭 시 실행
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

        // 인포윈도우 내용 생성
        const content = `
          <div style="padding: 16px; min-width: 300px; font-family: Arial, sans-serif;">
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
    </div>
  );
};

export default TestMap;
