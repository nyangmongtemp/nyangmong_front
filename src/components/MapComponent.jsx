import React, { useEffect, useRef } from "react";

const APP_KEY = "93631987e177207bdefe1cfab56ba744";

const MapComponent = ({ locations, selectedLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // 카카오맵 API가 완전히 초기화될 때까지 대기
    const waitForKakaoMap = () => {
      let attempts = 0;
      const maxAttempts = 5; // 개발 단계: 최대 5번 시도

      const checkKakaoMap = () => {
        attempts++;

        if (
          window.kakao &&
          window.kakao.maps &&
          window.kakao.maps.Map &&
          window.kakao.maps.LatLng
        ) {
          console.log("카카오맵 API 완전히 초기화됨");
          initMap();
        } else if (attempts >= maxAttempts) {
          console.error("카카오맵 API 초기화 실패 - 최대 시도 횟수 초과");
          // 개발 단계에서는 간단한 메시지만 표시
          if (mapRef.current) {
            mapRef.current.innerHTML = `
              <div style="width: 100%; height: 100%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <div style="font-size: 14px; color: #6b7280;">카카오맵 로드 실패</div>
              </div>
            `;
          }
        } else {
          console.log(
            `카카오맵 API 초기화 대기 중... (${attempts}/${maxAttempts})`
          );
          setTimeout(checkKakaoMap, 50);
        }
      };
      checkKakaoMap();
    };

    // 카카오맵 API 스크립트 로드
    const loadKakaoMap = () => {
      // 이미 로드되어 있는지 확인
      if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
        console.log("카카오맵 API 이미 로드됨");
        waitForKakaoMap();
        return;
      }

      // 스크립트가 이미 로드 중인지 확인
      const existingScript = document.querySelector(
        'script[src*="dapi.kakao.com"]'
      );
      if (existingScript) {
        console.log("카카오맵 API 로드 중...");
        existingScript.addEventListener("load", () => {
          console.log("기존 스크립트 로드 완료");
          waitForKakaoMap();
        });
        return;
      }

      // 새 스크립트 생성 및 로드
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&libraries=services`;
      script.async = true;

      script.onload = () => {
        console.log("카카오맵 API 스크립트 로드 완료");
        // 스크립트 로드 후 약간의 지연을 두고 초기화 체크
        setTimeout(() => {
          waitForKakaoMap();
        }, 200);
      };

      script.onerror = () => {
        console.error("카카오맵 API 로드 실패");
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="width: 100%; height: 100%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; flex-direction: column;">
              <div style="font-size: 14px; color: #6b7280;">카카오맵 로드 실패</div>
            </div>
          `;
        }
      };

      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current) return;

      const kakao = window.kakao;
      if (!kakao || !kakao.maps) return;

      // 서울 중심 좌표
      const center = new kakao.maps.LatLng(37.5665, 126.978);

      const options = {
        center: center,
        level: 8,
      };

      mapInstanceRef.current = new kakao.maps.Map(mapRef.current, options);
      addMarkers();
    };

    const addMarkers = () => {
      if (!mapInstanceRef.current) return;

      // 기존 마커들 제거
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      const kakao = window.kakao;
      if (!kakao || !kakao.maps) return;

      const bounds = new kakao.maps.LatLngBounds();

      locations.forEach((location) => {
        const position = new kakao.maps.LatLng(location.lat, location.lng);

        // 마커 생성
        const marker = new kakao.maps.Marker({
          position: position,
          map: mapInstanceRef.current,
        });

        // 선택된 위치인지 확인
        const isSelected =
          selectedLocation && selectedLocation.id === location.id;

        // 마커 이미지 설정 (선택된 경우 다른 이미지 사용)
        if (isSelected) {
          marker.setImage(
            new kakao.maps.MarkerImage(
              "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
              new kakao.maps.Size(31, 35)
            )
          );
        }

        // 인포윈도우 생성
        const infowindow = new kakao.maps.InfoWindow({
          content: `
            <div style="padding:10px;min-width:200px;">
              <h3 style="margin:0 0 5px 0;font-size:14px;font-weight:bold;">${location.name}</h3>
              <p style="margin:0;font-size:12px;color:#666;">${location.address}</p>
              <p style="margin:5px 0 0 0;font-size:11px;color:#999;">${location.category}</p>
            </div>
          `,
        });

        // 마커 클릭 이벤트
        kakao.maps.event.addListener(marker, "click", function () {
          infowindow.open(mapInstanceRef.current, marker);
        });

        markersRef.current.push(marker);
        bounds.extend(position);
      });

      // 모든 마커가 보이도록 지도 범위 조정
      if (locations.length > 0) {
        mapInstanceRef.current.setBounds(bounds);
      }
    };

    loadKakaoMap();

    // 컴포넌트 언마운트 시 정리
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [locations, selectedLocation]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default MapComponent;
