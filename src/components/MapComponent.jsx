import React, { useEffect, useRef, useState } from "react";
import ImageModal from "./ImageModal";

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
  selectedCategory,
  selectedGroomingDetail,
}) => {
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const initialCenterRef = useRef(null); // 최초 지도 중심
  const userMarkerRef = useRef(null); // 사용자 위치 마커

  // 이미지 모달 상태
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState({ image1: "", image2: "" });

  // 날짜 형식을 연월일로 변환하는 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

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
    // 전역 함수 설정
    window.openImageModal = (image1, image2) => {
      setModalImages({ image1, image2 });
      setIsImageModalOpen(true);
    };

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

    // 컴포넌트 언마운트 시 전역 함수 제거
    return () => {
      delete window.openImageModal;
    };
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
    //console.log(ps);

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
            <div style="padding:16px;min-width:320px;max-width:420px;font-family:Arial,sans-serif;">
              <div style="margin-bottom:8px;word-wrap:break-word;overflow-wrap:break-word;">
                <strong style="color:#ff9800;font-size:16px;line-height:1.3;">${
                  festival.title
                }</strong>
              </div>
              <div style="margin-bottom:12px;">
                <strong style="color:#ff9800;font-size:14px;">장소명:</strong>
                <p style="margin:4px 0;font-size:14px;font-weight:bold;word-wrap:break-word;overflow-wrap:break-word;">${
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
                <p style="margin:4px 0;font-size:14px;word-wrap:break-word;overflow-wrap:break-word;">${
                  result[0].road_address_name ||
                  result[0].address_name ||
                  festival.location ||
                  "정보 없음"
                }</p>
              </div>
              ${
                festival.url
                  ? `<div style=\"margin-top:8px;\"><a href=\"${festival.url}\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color:#007bff;text-decoration:underline;font-size:13px;\">행사 상세 정보 바로가기</a></div>`
                  : ""
              }
              ${
                result[0].place_url
                  ? `<div style=\"margin-top:12px;\"><a href=\"${result[0].place_url}\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color:#007bff;text-decoration:none;font-size:13px;padding:6px 12px;border:1px solid #007bff;border-radius:4px;display:inline-block;word-wrap:break-word;overflow-wrap:break-word;\">카카오맵에서 보기</a></div>`
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
        <div style="padding:16px;min-width:320px;font-family:Arial,sans-serif;">
          <div style="margin-bottom:8px;"><strong style="color:#ff9800;font-size:18px;">${
            selectedCultureDetail.title
          }</strong></div>
          <div style="margin-bottom:8px;">
            <strong style="color:#ff9800;font-size:14px;">상세주소:</strong>
            <p style="margin:4px 0;font-size:14px;">${
              selectedCultureDetail.addr1 || "정보 없음"
            }</p>
          </div>
          ${
            selectedCultureDetail.tel
              ? `
          <div style="margin-bottom:8px;">
            <strong style="color:#ff9800;font-size:14px;">전화번호:</strong>
            <p style="margin:4px 0;font-size:14px;">${selectedCultureDetail.tel}</p>
          </div>
          `
              : ""
          }
          <div style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <strong style="color:#ff9800;font-size:14px;">카테고리:</strong>
              <p style="margin:4px 0;font-size:14px;">${
                contentTypeMap[selectedCultureDetail.contentType] || "-"
              }</p>
            </div>
            ${
              selectedCultureDetail.image1 || selectedCultureDetail.image2
                ? `
            <button 
              onclick="window.openImageModal('${
                selectedCultureDetail.image1 || ""
              }', '${selectedCultureDetail.image2 || ""}')"
              style="background-color:#ff9800;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:14px;"
            >
              이미지 보기
            </button>
            `
                : ""
            }
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

  // 동물병원 상세정보(카드 클릭) 시 주소로 좌표 검색 후 마커/인포윈도우 표시
  useEffect(() => {
    if (
      selectedHospitalDetail &&
      selectedHospitalDetail.fullAddress &&
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

      // 주소로 좌표 검색
      const geocoder = new window.kakao.maps.services.Geocoder();

      const createMarkerAndInfoWindow = (coords) => {
        mapInstanceRef.current.setCenter(coords);

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: coords,
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
              <strong style="color:#ff9800;font-size:14px;">지번 주소:</strong>
              <p style="margin:4px 0;font-size:14px;">${
                selectedHospitalDetail.fullAddress || "정보 없음"
              }</p>
            </div>
            <div style="margin-bottom:8px;">
              <strong style="color:#ff9800;font-size:14px;">도로명 주소:</strong>
              <p style="margin:4px 0;font-size:14px;">${
                selectedHospitalDetail.roadAddress || "-"
              }</p>
            </div>
            <div style="margin-bottom:8px;">
              <strong style="color:#ff9800;font-size:14px;">전화번호:</strong>
              <p style="margin:4px 0;font-size:14px;">${
                selectedHospitalDetail.phoneNumber || "-"
              }</p>
            </div>
            <div style="margin-bottom:8px;">
              <strong style="color:#ff9800;font-size:14px;">정보 갱신 일자:</strong>
              <p style="margin:4px 0;font-size:14px;">${
                selectedHospitalDetail.lastModified
                  ? formatDate(selectedHospitalDetail.lastModified)
                  : "-"
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
      };

      const callback = function (result, status) {
        if (
          status === window.kakao.maps.services.Status.OK &&
          result.length > 0
        ) {
          // 첫 번째 결과의 좌표 사용
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          createMarkerAndInfoWindow(coords);
        } else {
          console.error("fullAddress 검색 실패:", status);

          // fullAddress 검색 실패 시 roadAddress로 재검색
          if (selectedHospitalDetail.roadAddress) {
            console.log(
              "roadAddress로 재검색 시도:",
              selectedHospitalDetail.roadAddress
            );
            geocoder.addressSearch(
              selectedHospitalDetail.roadAddress,
              (roadResult, roadStatus) => {
                if (
                  roadStatus === window.kakao.maps.services.Status.OK &&
                  roadResult.length > 0
                ) {
                  // 첫 번째 결과의 좌표 사용
                  const coords = new window.kakao.maps.LatLng(
                    roadResult[0].y,
                    roadResult[0].x
                  );
                  createMarkerAndInfoWindow(coords);
                } else {
                  console.error("roadAddress 검색도 실패:", roadStatus);
                }
              }
            );
          } else {
            console.error("roadAddress도 없음");
          }
        }
      };

      // 주소로 좌표 검색 실행 (fullAddress 우선)
      geocoder.addressSearch(selectedHospitalDetail.fullAddress, callback);
    }
  }, [selectedHospitalDetail]);

  // locations(행사정보 등) 기반 마커 렌더링
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || !mapInstanceRef.current) return;
    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }
    if (!locations || locations.length === 0) return;
    locations.forEach((loc) => {
      if (!loc.lat || !loc.lng) return;
      const latlng = new window.kakao.maps.LatLng(loc.lat, loc.lng);
      const marker = new window.kakao.maps.Marker({
        position: latlng,
        map: mapInstanceRef.current,
      });
      markersRef.current.push(marker);
      const infoContent = `
        <div style="padding:12px;min-width:220px;">
          <div style="font-weight:bold;font-size:16px;color:#ff9800;">${
            loc.name || loc.title || ""
          }</div>
          <div style="margin:4px 0;">${loc.address || ""}</div>
        </div>
      `;
      const infowindow = new window.kakao.maps.InfoWindow({
        content: infoContent,
        removable: true,
        maxWidth: 320,
      });
      window.kakao.maps.event.addListener(marker, "click", function () {
        if (infoWindowRef.current) infoWindowRef.current.close();
        infowindow.open(mapInstanceRef.current, marker);
        infoWindowRef.current = infowindow;
      });
    });
  }, [locations]);

  // 행사정보 카테고리에서 카드 클릭 시 해당 장소명으로 Places 검색 및 마커 표시
  useEffect(() => {
    if (
      selectedCategory === "event" &&
      selectedFestivalInfo &&
      selectedFestivalInfo.location
    ) {
      searchAndShowFestivalLocation(selectedFestivalInfo);
    }
    // eslint-disable-next-line
  }, [selectedCategory, selectedFestivalInfo]);

  // 미용실 상세 정보가 바뀔 때마다 지도에 마커 및 인포윈도우 표시
  // 미용실 상세 정보 마커 생성 (props로 받은 selectedGroomingDetail만 사용)
  const groomingCategories = [
    "style",
    "cafe",
    "shop",
    "museum",
    "art",
    "literary",
    "drug",
  ];
  // 더보기 상태 관리
  const [showGroomingMore, setShowGroomingMore] = useState(false);

  useEffect(() => {
    console.log("[미용실 마커 useEffect 실행]");
    console.log("mapInstanceRef.current:", mapInstanceRef.current);
    console.log("props.selectedGroomingDetail:", selectedGroomingDetail);
    setShowGroomingMore(false); // 마커 바뀔 때마다 더보기 닫기
    if (
      groomingCategories.includes(selectedCategory) &&
      typeof selectedGroomingDetail === "object" &&
      selectedGroomingDetail &&
      selectedGroomingDetail.mapx &&
      selectedGroomingDetail.mapy &&
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

      const lat = parseFloat(selectedGroomingDetail.mapy); // 위도
      const lng = parseFloat(selectedGroomingDetail.mapx); // 경도
      //console.log("lat:", lat, "lng:", lng);
      const latlng = new window.kakao.maps.LatLng(lat, lng);
      mapInstanceRef.current.setCenter(latlng);
      mapInstanceRef.current.setLevel(5); // 진단용: 지도 확대
      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: latlng,
        map: mapInstanceRef.current,
      });
      //console.log("마커 객체:", marker);
      markersRef.current.push(marker);
      // 인포윈도우 내용 (동물병원과 동일한 디자인 + 도로명주소, 휴무일, 영업시간, 더보기)
      const infoContent = `
        <div style="padding:16px;min-width:320px;font-family:Arial,sans-serif;">
          <div style="margin-bottom:8px;"><strong style="color:#ff9800;font-size:18px;">${
            selectedGroomingDetail.facilityName
          }</strong></div>
          <div style="margin-bottom:8px;">
            <strong style="color:#ff9800;font-size:14px;">지번 주소:</strong>
            <p style="margin:4px 0;font-size:14px;">${
              selectedGroomingDetail.fullAddress || "정보 없음"
            }</p>
          </div>
          <div style="margin-bottom:8px;">
            <strong style="color:#ff9800;font-size:14px;">도로명 주소:</strong>
            <p style="margin:4px 0;font-size:14px;">${
              selectedGroomingDetail.roadAddress || "정보 없음"
            }</p>
          </div>
          <div style="margin-bottom:8px;">
            <strong style="color:#ff9800;font-size:14px;">휴무일:</strong>
            <p style="margin:4px 0;font-size:14px;">${
              selectedGroomingDetail.restInfo || "정보 없음"
            }</p>
          </div>
          <div style="margin-bottom:8px;">
            <strong style="color:#ff9800;font-size:14px;">영업시간:</strong>
            <p style="margin:4px 0;font-size:14px;">${
              selectedGroomingDetail.operTime || "정보 없음"
            }</p>
          </div>
          <div style="text-align:right;">
            <button id="grooming-more-btn" style="background-color:#ff9800;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:14px;">더보기</button>
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
        setTimeout(() => {
          const btn = document.getElementById("grooming-more-btn");
          if (btn) {
            btn.onclick = () => setShowGroomingMore(true);
          }
        }, 100);
      });
      infoWindowRef.current = infowindow;
    }
  }, [selectedCategory, selectedGroomingDetail]);

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
    selectedGroomingDetail,
  ]);

  // 더보기 모달/창 렌더링
  const renderGroomingMore = () => {
    if (!showGroomingMore || !selectedGroomingDetail) return null;
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.4)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 32,
            minWidth: 340,
            maxWidth: 400,
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          }}
        >
          <h2 style={{ color: "#ff9800", fontSize: 22, marginBottom: 16 }}>
            {selectedGroomingDetail.facilityName}
          </h2>
          <div style={{ marginBottom: 8 }}>
            <b>지번 주소:</b> {selectedGroomingDetail.fullAddress || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>도로명 주소:</b> {selectedGroomingDetail.roadAddress || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>전화번호:</b> {selectedGroomingDetail.telNum || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>휴무일:</b> {selectedGroomingDetail.restInfo || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>영업시간:</b> {selectedGroomingDetail.operTime || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>주차:</b>{" "}
            {selectedGroomingDetail.parking === "Y"
              ? "가능"
              : selectedGroomingDetail.parking === "N"
              ? "불가"
              : "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>반려동물 실내 동반:</b>{" "}
            {selectedGroomingDetail.inPlace === "Y"
              ? "가능"
              : selectedGroomingDetail.inPlace === "N"
              ? "불가"
              : "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>반려동물 실외 동반:</b>{" "}
            {selectedGroomingDetail.outPlace === "Y"
              ? "가능"
              : selectedGroomingDetail.outPlace === "N"
              ? "불가"
              : "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>반려동물 크기 제한:</b> {selectedGroomingDetail.petSize || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>반려동물 입장 제한:</b>{" "}
            {selectedGroomingDetail.petRestrict || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>반려동물 정보:</b> {selectedGroomingDetail.petInfo || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>추가 요금:</b> {selectedGroomingDetail.extraFee || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>가격:</b> {selectedGroomingDetail.price || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>설명:</b> {selectedGroomingDetail.infoDesc || "-"}
          </div>
          {selectedGroomingDetail.url && (
            <div style={{ marginBottom: 8 }}>
              <a
                href={selectedGroomingDetail.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff", textDecoration: "underline" }}
              >
                홈페이지 바로가기
              </a>
            </div>
          )}
          <button
            onClick={() => setShowGroomingMore(false)}
            style={{
              marginTop: 16,
              background: "#ff9800",
              color: "white",
              border: "none",
              padding: "8px 24px",
              borderRadius: 6,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            닫기
          </button>
        </div>
      </div>
    );
  };

  // 지도 컴포넌트 렌더링
  return (
    <>
      <div id="map" style={{ width: "100%", height: "100%" }} />
      {renderGroomingMore()}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        image1={modalImages.image1}
        image2={modalImages.image2}
      />
    </>
  );
};

export default MapComponent;
