import React, { createContext, useContext, useState, useEffect } from "react";
import { encrypt, decrypt } from "../hooks/use-encode";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(
    sessionStorage.getItem("adminToken") ||
      localStorage.getItem("admin_token") ||
      ""
  );
  const [adminId, setAdminId] = useState("");
  const [role, setRole] = useState("");
  const [isFirst, setIsFirst] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!(
      sessionStorage.getItem("adminToken") ||
      localStorage.getItem("admin_token")
    )
  );

  useEffect(() => {
    const loadDecryptedAdmin = async () => {
      let encryptedAdminId =
        sessionStorage.getItem("adminId") || localStorage.getItem("admin_id");
      let encryptedRole =
        sessionStorage.getItem("adminRole") ||
        localStorage.getItem("admin_role");
      let encryptedIsFirst =
        sessionStorage.getItem("adminIsFirst") ||
        localStorage.getItem("admin_isFirst");

      // 세션스토리지에 평문으로 저장된 경우도 지원
      let plainAdminId = sessionStorage.getItem("adminId");
      let plainRole = sessionStorage.getItem("adminRole");
      let plainIsFirst = sessionStorage.getItem("adminIsFirst");

      if (encryptedAdminId) {
        try {
          const decryptedAdminId = await decrypt(encryptedAdminId);
          setAdminId(decryptedAdminId);
        } catch (e) {
          // 복호화 실패 시 평문 사용
          if (plainAdminId) setAdminId(plainAdminId);
        }
      } else if (plainAdminId) {
        setAdminId(plainAdminId);
      }

      if (encryptedRole) {
        try {
          const decryptedRole = await decrypt(encryptedRole);
          setRole(decryptedRole);
        } catch (e) {
          // 복호화 실패 시 평문 사용
          if (plainRole) setRole(plainRole);
        }
      } else if (plainRole) {
        setRole(plainRole);
      }

      if (encryptedIsFirst) {
        try {
          const decryptedIsFirst = await decrypt(encryptedIsFirst);
          setIsFirst(decryptedIsFirst === "true");
        } catch (e) {
          // 복호화 실패 시 평문 사용
          if (plainIsFirst) setIsFirst(plainIsFirst === "true");
        }
      } else if (plainIsFirst) {
        setIsFirst(plainIsFirst === "true");
      }
    };
    loadDecryptedAdmin();
  }, []);

  // 토큰 만료 이벤트 감지
  useEffect(() => {
    const handleTokenExpired = () => {
      console.log("AdminContext: 토큰 만료 이벤트 감지");
      forceLogout();
    };

    window.addEventListener("adminTokenExpired", handleTokenExpired);

    return () => {
      window.removeEventListener("adminTokenExpired", handleTokenExpired);
    };
  }, []);

  const updateToken = (newToken) => {
    sessionStorage.setItem("adminToken", newToken);
    localStorage.setItem("admin_token", newToken);
    setToken(newToken);
  };

  const login = async (token, adminId, role, isFirst) => {
    try {
      sessionStorage.setItem("adminToken", token);
      sessionStorage.setItem("admin_token", token);
      sessionStorage.setItem("admin_id", await encrypt(adminId));
      sessionStorage.setItem("admin_role", await encrypt(role));
      sessionStorage.setItem(
        "admin_isFirst",
        await encrypt(isFirst ? "true" : "false")
      );
      setToken(token);
      setAdminId(adminId);
      setRole(role);
      setIsFirst(isFirst);
      setIsLoggedIn(true);
    } catch (e) {
      console.error("Encryption error during admin login:", e);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_id");
    sessionStorage.removeItem("admin_role");
    sessionStorage.removeItem("admin_isFirst");
    setToken("");
    setAdminId("");
    setRole("");
    setIsFirst(false);
    setIsLoggedIn(false);

    // 관리자 로그아웃 시 /admin으로 이동하는 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent("adminLogout"));
  };

  // 토큰 만료 시 강제 로그아웃
  const forceLogout = () => {
    console.log("관리자 토큰 만료 - 강제 로그아웃 실행");

    // 세션스토리지 완전 정리
    sessionStorage.clear();

    // 상태 초기화
    setToken("");
    setAdminId("");
    setRole("");
    setIsFirst(false);
    setIsLoggedIn(false);

    // 사용자에게 알림
    alert("토큰이 만료되었습니다. 다시 로그인해주세요.");

    // 관리자 메인으로 이동
    window.location.href = "/admin";
  };

  return (
    <AdminContext.Provider
      value={{
        token,
        adminId,
        role,
        isFirst,
        isLoggedIn,
        login,
        logout,
        updateToken,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
