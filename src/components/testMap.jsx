import React, { useEffect, useRef } from "react";

const APP_KEY = "93631987e177207bdefe1cfab56ba744"; // 임시로 하드코딩
console.log("APP_KEY:", APP_KEY); // API 키 확인

const TestMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // 카카오맵 공식 로딩 방식 사용
    const initMapWithKakaoLoad = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error("카카오맵 API가 로드되지 않았습니다.");
        return;
      }

      console.log("카카오맵 API 로드됨, 공식 로딩 방식으로 초기화...");

      // 카카오맵 API 로드 완료 후 실행될 콜백
      window.kakao.maps.load(function () {
        console.log("카카오맵 API 초기화 완료!");

        // 지도를 표시할 div와 중심좌표 설정
        const mapContainer = document.getElementById("map");
        const mapOption = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        console.log("카카오맵 생성 완료");
      });
    };

    // 카카오맵 API 스크립트 로드
    const loadKakaoMap = () => {
      // 이미 로드되어 있는지 확인
      if (window.kakao && window.kakao.maps) {
        console.log("카카오맵 API 이미 로드됨");
        initMapWithKakaoLoad();
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
          initMapWithKakaoLoad();
        });
        return;
      }

      // 새 스크립트 생성 및 로드
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false`;
      script.async = true;

      script.onload = () => {
        console.log("카카오맵 API 스크립트 로드 완료");
        initMapWithKakaoLoad();
      };

      script.onerror = () => {
        console.error("카카오맵 API 로드 실패");
      };

      document.head.appendChild(script);
    };

    loadKakaoMap();

    // 컴포넌트 언마운트 시 정리
    return () => {
      // 정리 작업이 필요한 경우 여기에 추가
    };
  }, []);

  return (
    <div ref={mapRef} id="map" style={{ width: "100%", height: "400px" }} />
  );
};

export default TestMap;
