import React, { createContext, useContext, useState, useEffect } from "react";
import { encrypt, decrypt } from "../hooks/use-encode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState(""); // 초기값만 설정
  const [nickname, setNickname] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const loadDecryptedUser = async () => {
      const encryptedEmail = localStorage.getItem("email");
      const encryptedNick = localStorage.getItem("nickname");
      const encryptedImage = localStorage.getItem("profileImage");

      if (encryptedEmail) {
        try {
          const decryptedEmail = await decrypt(encryptedEmail);
          setEmail(decryptedEmail);
        } catch (e) {
          console.error("email decrypt error:", e);
        }
      }

      if (encryptedNick) {
        try {
          const decryptedNick = await decrypt(encryptedNick);
          setNickname(decryptedNick);
        } catch (e) {
          console.error("nickname decrypt error:", e);
        }
      }

      if (encryptedImage) {
        try {
          const decryptedImage = await decrypt(encryptedImage);
          setProfileImage(decryptedImage);
        } catch (e) {
          console.error("profileImage decrypt error:", e);
        }
      }
    };

    loadDecryptedUser();
  }, []);

  const login = async (token, email, nickname, profileImage) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("email", await encrypt(email));
      localStorage.setItem("nickname", await encrypt(nickname));
      localStorage.setItem("profileImage", await encrypt(profileImage));

      setToken(token);
      setEmail(email);
      setNickname(nickname);
      setProfileImage(profileImage);
      setIsLoggedIn(true);
    } catch (e) {
      console.error("Encryption error during login:", e);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("nickname");
    localStorage.removeItem("profileImage");

    setToken("");
    setEmail("");
    setNickname(null);
    setProfileImage(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        email,
        isLoggedIn,
        login,
        logout,
        nickname,
        profileImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
