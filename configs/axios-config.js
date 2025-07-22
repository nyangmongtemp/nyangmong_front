import axios from "axios";
import { API_BASE_URL, USER } from "./host-config";

// ✅ Axios 인스턴스 생성
const axiosInstance = axios.create({
  // 개발 환경에서는 프록시를 사용하므로 baseURL을 빈 문자열로 설정
  baseURL: process.env.NODE_ENV === "development" ? "" : API_BASE_URL,
  headers: {
    // "Content-Type": "application/json",
  },
  timeout: 10000, // 10초 타임아웃 설정
});

// ✅ 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    // 관리자 토큰 우선, 없으면 유저 토큰
    const token =
      sessionStorage.getItem("adminToken") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 요청 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// ✅ 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    console.log("Response Interceptor Triggered!");
    console.log(error);

    const originalRequest = error.config;

    // 네트워크 에러 처리
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject({
        ...error,
        message: "네트워크 연결을 확인해주세요.",
      });
    }

    // 로그인 안 된 상태에서 요청
    if (error.response?.data?.message === "NO_LOGIN") {
      console.log("Not logged in — skipping token refresh.");
      return Promise.reject(error);
    }

    // 401 Unauthorized 에러일 경우 (토큰 만료)
    if (
      error.response?.status === 401 &&
      (error.response?.data?.msg === "EXPIRED_TOKEN" ||
        error.response?.msg === "EXPIRED_TOKEN") &&
      !originalRequest._retry
    ) {
      console.log("401 Unauthorized — trying token refresh...");
      originalRequest._retry = true;

      try {
        const email = localStorage.getItem("email");
        if (!email) {
          throw new Error("No email in localStorage");
        }
        console.log("리스페시발동");

        // Refresh token 요청
        const res = await axios.post(`${API_BASE_URL}${USER}/refresh`, {
          userEmail: email,
        });

        const newToken = res.data.result.token;
        localStorage.setItem("token", newToken);

        // 커스텀 이벤트 발생 (UserContext에서 토큰 상태 갱신)
        window.dispatchEvent(
          new CustomEvent("tokenRefreshed", { detail: { token: newToken } })
        );

        // 새 토큰으로 Authorization 헤더 갱신
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;

        console.log("Token refreshed successfully");

        // 재요청
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // 토큰 갱신 실패 시 로그아웃 처리
        localStorage.clear();

        // 사용자에게 알림
        if (typeof window !== "undefined") {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/";
        }

        return Promise.reject(refreshError);
      }
    }

    // 기타 에러 로깅
    console.error("API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url,
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;
