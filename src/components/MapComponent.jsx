import React, { useEffect, useRef } from "react";

const APP_KEY = import.meta.env.VITE_KAKAO_MAP_API;

// 위치 권한 허용안하면, 기본 위치값(현재는 남산임)
const NAMSAN_LAT = 37.550434;
const NAMSAN_LNG = 126.990558;

const MapComponent = ({
  locations,
  selectedLocation,
  selectedFestivalInfo,
  selectedCultureDetail,
  selectedHospitalDetail,
}) => {
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const initialCenterRef = useRef(null); // 최초 지도 중심
  const userMarkerRef = useRef(null); // 사용자 위치 마커

  // 카카오맵 스크립트 로드 함수
  function loadKakaoMapScript(callback) {
    if (window.kakao && window.kakao.maps) {
      callback();
      return;
    }
    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", callback);
      return;
    }
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);
  }

  // 최초 1회만 지도 객체 생성 (스크립트가 완전히 로드된 후에만)
  useEffect(() => {
    loadKakaoMapScript(() => {
      window.kakao.maps.load(function () {
        const mapContainer = document.getElementById("map");
        if (!mapContainer) return;
        // 위치권한 허용 시 현위치로 지도 중심 이동 및 마커 표시
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const userLatLng = new window.kakao.maps.LatLng(
                pos.coords.latitude,
                pos.coords.longitude
              );
              initialCenterRef.current = userLatLng;
              mapInstanceRef.current = new window.kakao.maps.Map(mapContainer, {
                center: userLatLng,
                level: 8,
              });
              addUserMarker(userLatLng);
            },
            (err) => {
              // 위치권한 거부/실패 시 남산
              const namsan = new window.kakao.maps.LatLng(
                NAMSAN_LAT,
                NAMSAN_LNG
              );
              initialCenterRef.current = namsan;
              mapInstanceRef.current = new window.kakao.maps.Map(mapContainer, {
                center: namsan,
                level: 8,
              });
              addUserMarker(namsan);
            }
          );
        } else {
          // geolocation 미지원 시 남산
          const namsan = new window.kakao.maps.LatLng(NAMSAN_LAT, NAMSAN_LNG);
          initialCenterRef.current = namsan;
          mapInstanceRef.current = new window.kakao.maps.Map(mapContainer, {
            center: namsan,
            level: 8,
          });
          addUserMarker(namsan);
        }
      });
    });
  }, []);

  // 사용자 위치 마커 추가
  const addUserMarker = (latlng) => {
    if (!window.kakao || !window.kakao.maps || !latlng) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
    }
    const marker = new window.kakao.maps.Marker({
      position: latlng,
      map: mapInstanceRef.current,
      title: "현재 위치",
      image: new window.kakao.maps.MarkerImage(
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
        new window.kakao.maps.Size(24, 35)
      ),
    });
    userMarkerRef.current = marker;
  };

  // testMap처럼 장소명으로 검색 후 마커/인포윈도우 표시
  const searchAndShowFestivalLocation = (festival) => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;
    const mapOption = {
      center:
        initialCenterRef.current ||
        new window.kakao.maps.LatLng(NAMSAN_LAT, NAMSAN_LNG),
      level: 8,
    };
    mapInstanceRef.current = new window.kakao.maps.Map(mapContainer, mapOption);
    // Places API로 장소명 검색
    const ps = new window.kakao.maps.services.Places();
    console.log(ps);

    ps.keywordSearch(festival.location, function (result, status) {
      if (
        status === window.kakao.maps.services.Status.OK &&
        result.length > 0
      ) {
        const x = parseFloat(result[0].x);
        const y = parseFloat(result[0].y);
        const latlng = new window.kakao.maps.LatLng(y, x);
        mapInstanceRef.current.setCenter(latlng);
        // 기존 마커/인포윈도우 제거
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
          infoWindowRef.current = null;
        }
        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: latlng,
          map: mapInstanceRef.current,
        });
        markersRef.current.push(marker);
        // 인포윈도우 내용
        const infoContent = `
            <div style="padding:16px;min-width:320px;font-family:Arial,sans-serif;">
              <div style="margin-bottom:8px;"><strong style="color:#ff9800;font-size:18px;">${
                festival.title
              }</strong></div>
              <div style="margin-bottom:12px;">
                <strong style="color:#ff9800;font-size:16px;">장소명:</strong>
                <p style="margin:4px 0;font-size:16px;font-weight:bold;">${
                  result[0].place_name || festival.location || "정보 없음"
                }</p>
              </div>
              <div style="margin-bottom:8px;">
                <strong style="color:#ff9800;font-size:14px;">기간:</strong>
                <p style="margin:4px 0;font-size:14px;color:#666;">${
                  festival.festivalDate || "정보 없음"
                }</p>
              </div>
              <div style="margin-bottom:8px;">
                <strong style="color:#ff9800;font-size:14px;">상세주소:</strong>
                <p style="margin:4px 0;font-size:14px;">${
                  result[0].road_address_name ||
                  result[0].address_name ||
                  festival.location ||
                  "정보 없음"
                }</p>
              </div>
              ${
                festival.url
                  ? `<div style=\"margin-top:8px;\"><a href=\"${festival.url}\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color:#007bff;text-decoration:underline;font-size:14px;\">행사 상세 정보 바로가기</a></div>`
                  : ""
              }
              ${
                result[0].place_url
                  ? `<div style=\"margin-top:12px;\"><a href=\"${result[0].place_url}\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color:#007bff;text-decoration:none;font-size:14px;padding:6px 12px;border:1px solid #007bff;border-radius:4px;display:inline-block;\">카카오맵에서 보기</a></div>`
                  : ""
              }
            </div>
          `;
        const infowindow = new window.kakao.maps.InfoWindow({
          content: infoContent,
          removable: true,
          maxWidth: 420,
        });
        window.kakao.maps.event.addListener(marker, "click", function () {
          infowindow.open(mapInstanceRef.current, marker);
        });
        infoWindowRef.current = infowindow;
        // 자동 오픈 제거 (마커 클릭 시에만 열림)
      } else {
        // 검색 실패 시 기본 지도만 표시
        showMap();
      }
    });
  };

  // contentType 숫자 → 한글명 매핑
  const contentTypeMap = {
    12: "관광지",
    14: "문화시설",
    28: "레포츠",
    32: "숙박",
    38: "쇼핑",
    39: "음식점",
    // 필요시 추가
  };

  // 문화시설 상세정보(카드 클릭) 시 mapx, mapy 좌표로 바로 마커/인포윈도우 표시
  useEffect(() => {
    if (
      selectedCultureDetail &&
      selectedCultureDetail.mapx &&
      selectedCultureDetail.mapy &&
      window.kakao &&
      window.kakao.maps &&
      mapInstanceRef.current
    ) {
      // 기존 마커/인포윈도우 제거
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
      // mapx: 경도, mapy: 위도
      const latlng = new window.kakao.maps.LatLng(
        parseFloat(selectedCultureDetail.mapy),
        parseFloat(selectedCultureDetail.mapx)
      );
      mapInstanceRef.current.setCenter(latlng);
      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: latlng,
        map: mapInstanceRef.current,
      });
      markersRef.current.push(marker);
      // 인포윈도우 내용 (좌표는 제외, tel/카테고리 한글 변환)
      const infoContent = `
        <div style=\"padding:16px;min-width:320px;font-family:Arial,sans-serif;\">
          <div style=\"margin-bottom:8px;\"><strong style=\"color:#ff9800;font-size:18px;\">${
            selectedCultureDetail.title
          }</strong></div>
          <div style=\"margin-bottom:8px;\">
            <strong style=\"color:#ff9800;font-size:14px;\">상세주소:</strong>
            <p style=\"margin:4px 0;font-size:14px;\">${
              selectedCultureDetail.addr1 || "정보 없음"
            }</p>
          </div>
          ${
            selectedCultureDetail.tel
              ? `
          <div style=\"margin-bottom:8px;\">
            <strong style=\"color:#ff9800;font-size:14px;\">전화번호:</strong>
            <p style=\"margin:4px 0;font-size:14px;\">${selectedCultureDetail.tel}</p>
          </div>
          `
              : ""
          }
          <div style=\"margin-bottom:8px;\">
            <strong style=\"color:#ff9800;font-size:14px;\">카테고리:</strong>
            <p style=\"margin:4px 0;font-size:14px;\">${
              contentTypeMap[selectedCultureDetail.contentType] || "-"
            }</p>
          </div>
        </div>
      `;
      const infowindow = new window.kakao.maps.InfoWindow({
        content: infoContent,
        removable: true,
        maxWidth: 420,
      });
      window.kakao.maps.event.addListener(marker, "click", function () {
        infowindow.open(mapInstanceRef.current, marker);
      });
      infoWindowRef.current = infowindow;
    }
  }, [selectedCultureDetail]);

  // 동물병원 상세정보(카드 클릭) 시 mapx, mapy 좌표로 바로 마커/인포윈도우 표시
  useEffect(() => {
    if (
      selectedHospitalDetail &&
      selectedHospitalDetail.mapx &&
      selectedHospitalDetail.mapy &&
      window.kakao &&
      window.kakao.maps &&
      mapInstanceRef.current
    ) {
      // 기존 마커/인포윈도우 제거
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
      // mapx: 경도, mapy: 위도
      const latlng = new window.kakao.maps.LatLng(
        parseFloat(selectedHospitalDetail.mapy),
        parseFloat(selectedHospitalDetail.mapx)
      );
      mapInstanceRef.current.setCenter(latlng);
      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: latlng,
        map: mapInstanceRef.current,
      });
      markersRef.current.push(marker);
      // 인포윈도우 내용
      const infoContent = `
        <div style="padding:16px;min-width:320px;font-family:Arial,sans-serif;">
          <div style="margin-bottom:8px;"><strong style="color:#ff9800;font-size:18px;">${
            selectedHospitalDetail.businessName
          }</strong></div>
          <div style="margin-bottom:8px;">
            <strong style="color:#ff9800;font-size:14px;">상세주소:</strong>
            <p style="margin:4px 0;font-size:14px;">${
              selectedHospitalDetail.fullAddress || "정보 없음"
            }</p>
          </div>
          ${
            selectedHospitalDetail.phoneNumber
              ? `
          <div style="margin-bottom:8px;">
            <strong style="color:#ff9800;font-size:14px;">전화번호:</strong>
            <p style="margin:4px 0;font-size:14px;">${selectedHospitalDetail.phoneNumber}</p>
          </div>
          `
              : ""
          }
          ${
            selectedHospitalDetail.lastModified
              ? `
          <div style="margin-bottom:8px;">
            <strong style="color:#ff9800;font-size:14px;">정보 갱신 일자:</strong>
            <p style="margin:4px 0;font-size:14px;">${selectedHospitalDetail.lastModified}</p>
          </div>
          `
              : ""
          }
        </div>
      `;
      const infowindow = new window.kakao.maps.InfoWindow({
        content: infoContent,
        removable: true,
        maxWidth: 420,
      });
      window.kakao.maps.event.addListener(marker, "click", function () {
        infowindow.open(mapInstanceRef.current, marker);
      });
      infoWindowRef.current = infowindow;
    }
  }, [selectedHospitalDetail]);

  // 지도 리사이즈 트리거 (행사정보/문화시설 등 탭/카테고리/카드 전환 시)
  useEffect(() => {
    if (window.kakao && window.kakao.maps && mapInstanceRef.current) {
      setTimeout(() => {
        window.kakao.maps.event.trigger(mapInstanceRef.current, "resize");
      }, 100); // DOM 렌더링 후 트리거 (100ms 딜레이)
    }
  }, [
    locations,
    selectedLocation,
    selectedFestivalInfo,
    selectedCultureDetail,
    selectedHospitalDetail,
  ]);

  // 지도 컴포넌트 렌더링
  return <div id="map" style={{ width: "100%", height: "100%" }} />;
};

export default MapComponent;
