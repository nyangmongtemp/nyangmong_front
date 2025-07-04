import axios from "axios";
import { API_BASE_URL, USER } from "./host-config";

// ✅ Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  (response) => response,
  async (error) => {
    console.log("Response Interceptor Triggered!");

    const originalRequest = error.config;

    // 로그인 안 된 상태에서 요청
    if (error.response?.data?.message === "NO_LOGIN") {
      console.log("Not logged in — skipping token refresh.");
      return Promise.reject(error);
    }

    // 401 Unauthorized 에러일 경우 (토큰 만료)
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("401 Unauthorized — trying token refresh...");
      originalRequest._retry = true;

      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          throw new Error("No user_id in localStorage");
        }

        // Refresh token 요청
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          userId,
        });

        const newToken = res.data.result.token;
        localStorage.setItem("access_token", newToken);

        // 새 토큰으로 Authorization 헤더 갱신
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;

        // 재요청
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.clear(); // 로그아웃 처리
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
