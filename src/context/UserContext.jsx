// // src/contexts/AuthContext.js

// // Custom Hook
// export const useAuth = () => useContext(AuthContext);

// // Provider (고정된 값만 제공)
// export const AuthProvider = ({ children }) => {
//   return <AuthContext.Provider value={token}>{children}</AuthContext.Provider>;
// };

// src/context/TokenContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!localStorage.getItem("token"));

  const login = (token, email) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    setToken(token);
    setEmail(email);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken("");
    setEmail("");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ token, email, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook으로 쉽게 사용할 수 있도록
// token 및 로그인, 로그아웃, 등의 모든 로직은 이 Context에 있는 훅을 사용해야함.
export const useAuth = () => useContext(AuthContext);
