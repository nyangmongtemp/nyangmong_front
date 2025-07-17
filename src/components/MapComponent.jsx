import React, { useEffect, useRef } from "react";

const APP_KEY = import.meta.env.VITE_KAKAO_MAP_API;

const NAMSAN_LAT = 37.550434;
const NAMSAN_LNG = 126.990558;

const MapComponent = ({
  locations,
  selectedLocation,
  selectedFestivalInfo,
  selectedCultureDetail,
}) => {
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const initialCenterRef = useRef(null); // 최초 지도 중심
  const userMarkerRef = useRef(null); // 사용자 위치 마커

  useEffect(() => {
    // 카카오맵 스크립트 로드 및 지도 초기화
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
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = initMapWithKakaoLoad;
      document.head.appendChild(script);
    };

    const initMapWithKakaoLoad = () => {
      if (!window.kakao || !window.kakao.maps) return;
      window.kakao.maps.load(function () {
        // 최초 지도 중심: 사용자 위치 → 실패 시 남산
        if (!initialCenterRef.current) {
          if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
              (pos) => {
                initialCenterRef.current = new window.kakao.maps.LatLng(
                  pos.coords.latitude,
                  pos.coords.longitude
                );
                addUserMarker(initialCenterRef.current);
                if (selectedFestivalInfo && selectedFestivalInfo.location) {
                  searchAndShowFestivalLocation(selectedFestivalInfo);
                } else {
                  showMap();
                }
              },
              (err) => {
                initialCenterRef.current = new window.kakao.maps.LatLng(
                  NAMSAN_LAT,
                  NAMSAN_LNG
                );
                addUserMarker(initialCenterRef.current);
                if (selectedFestivalInfo && selectedFestivalInfo.location) {
                  searchAndShowFestivalLocation(selectedFestivalInfo);
                } else {
                  showMap();
                }
              }
            );
            return;
          } else {
            initialCenterRef.current = new window.kakao.maps.LatLng(
              NAMSAN_LAT,
              NAMSAN_LNG
            );
            addUserMarker(initialCenterRef.current);
          }
        }
        addUserMarker(initialCenterRef.current);
        if (selectedFestivalInfo && selectedFestivalInfo.location) {
          searchAndShowFestivalLocation(selectedFestivalInfo);
        } else {
          showMap();
        }
      });
    };

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
      mapInstanceRef.current = new window.kakao.maps.Map(
        mapContainer,
        mapOption
      );
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

    const showMap = () => {
      const mapContainer = document.getElementById("map");
      if (!mapContainer) return;
      let center =
        initialCenterRef.current ||
        new window.kakao.maps.LatLng(NAMSAN_LAT, NAMSAN_LNG);
      if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
        center = new window.kakao.maps.LatLng(
          selectedLocation.lat,
          selectedLocation.lng
        );
      } else if (locations && locations.length > 0) {
        center = new window.kakao.maps.LatLng(
          locations[0].lat,
          locations[0].lng
        );
      }
      const mapOption = {
        center: center,
        level: 8,
      };
      mapInstanceRef.current = new window.kakao.maps.Map(
        mapContainer,
        mapOption
      );
      addUserMarker(initialCenterRef.current);
      // 기존 마커/인포윈도우 제거
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
      const bounds = new window.kakao.maps.LatLngBounds();
      // 행사정보와 동일하게: 문화시설 상세 정보가 있으면 마커 하나만 띄우고, 인포윈도우도 하나만 띄움
      if (selectedCultureDetail && selectedCultureDetail.addr1) {
        // Places API로 addr1 검색
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(
          selectedCultureDetail.addr1,
          function (result, status) {
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
                image: new window.kakao.maps.MarkerImage(
                  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
                  new window.kakao.maps.Size(31, 35)
                ),
              });
              markersRef.current.push(marker);
              // 인포윈도우 내용 (임시: selectedCultureDetail + 검색 결과 정보)
              const infoContent = `
              <div style=\"padding:16px;min-width:240px;font-family:Arial,sans-serif;\">\n                <div style=\"margin-bottom:8px;\"><strong style=\"color:#ff9800;font-size:18px;\">${
                selectedCultureDetail.title
              }</strong></div>\n                <div style=\"margin-bottom:8px;\">\n                  <strong style=\"color:#ff9800;font-size:14px;\">상세주소:</strong>\n                  <p style=\"margin:4px 0;font-size:14px;\">${
                selectedCultureDetail.addr1 || ""
              }${
                selectedCultureDetail.addr2
                  ? " " + selectedCultureDetail.addr2
                  : ""
              }</p>\n                </div>\n                <div style=\"margin-bottom:8px;\">\n                  <strong style=\"color:#ff9800;font-size:14px;\">카카오맵 검색 결과 주소:</strong>\n                  <p style=\"margin:4px 0;font-size:14px;\">${
                result[0].road_address_name || result[0].address_name || ""
              }</p>\n                </div>\n                <div style=\"margin-top:12px;\">\n                  <a href=\"${
                result[0].place_url
              }\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color:#007bff;text-decoration:none;font-size:14px;padding:6px 12px;border:1px solid #007bff;border-radius:4px;display:inline-block;\">카카오맵에서 보기</a>\n                </div>\n              </div>\n            `;
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
          }
        );
      } else if (locations.length > 0) {
        // 문화시설 상세 정보가 없으면 기존 locations 마커 표시
        locations.forEach((location) => {
          const position = new window.kakao.maps.LatLng(
            location.lat,
            location.lng
          );
          const marker = new window.kakao.maps.Marker({
            position: position,
            map: mapInstanceRef.current,
          });
          markersRef.current.push(marker);
          bounds.extend(position);
        });
        mapInstanceRef.current.setBounds(bounds);
      }
    };

    loadKakaoMap();

    // 컴포넌트 언마운트 시 마커/인포윈도우 정리
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [
    locations,
    selectedLocation,
    selectedFestivalInfo,
    selectedCultureDetail,
  ]);

  // id="map"으로 div를 지정 (testMap과 동일하게)
  useEffect(() => {
    // 지도 리사이즈 트리거 (문화시설 등 탭/카테고리/카드 전환 시)
    if (window.kakao && window.kakao.maps && mapInstanceRef.current) {
      setTimeout(() => {
        window.kakao.maps.event.trigger(mapInstanceRef.current, "resize");
      }, 100); // DOM 렌더링 후 트리거 (100ms 딜레이)
    }
  }, [locations, selectedLocation, selectedCultureDetail]);

  return <div id="map" style={{ width: "100%", height: "100%" }} />;
};

export default MapComponent;
