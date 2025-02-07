'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  userId: string | null; // ✅ userId 추가
  isLoggedIn: boolean;
  login: (token: string) => void;
  loginUser: (loginUserId: string) => void; // ✅ loginUser 추가
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    // ✅ 초기값을 localStorage에서 가져오기 (SSR 방지)
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });

  const [userId, setUserId] = useState<string | null>(() => {
    // ✅ 초기값을 localStorage에서 가져오기 (SSR 방지)
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId');
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  // ✅ localStorage에서 토큰을 가져와 상태 업데이트
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && storedToken !== token) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, [token]);

  // ✅ localStorage에서 userId를 가져와 상태 업데이트
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId && storedUserId !== userId) {
      setUserId(storedUserId);
      setIsLoggedIn(true);
    }
  }, [userId]);

  // ✅ 로그인 시 토큰 저장 및 상태 업데이트
  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsLoggedIn(true);
  };

  // ✅ 로그인 시 userId 저장 및 상태 업데이트
  const loginUser = (loginUserId: string) => {
    localStorage.setItem('userId', loginUserId);
    setUserId(loginUserId);
    setIsLoggedIn(true);
  };

  // ✅ 로그아웃 시 토큰 및 userId 삭제
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ token, userId, isLoggedIn, login, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ useAuth가 반드시 AuthProvider 내부에서 호출되도록 예외 처리 추가
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
