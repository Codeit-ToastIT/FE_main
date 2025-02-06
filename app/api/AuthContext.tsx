import React, { createContext, useContext, useState, ReactNode } from 'react';

// Context 타입 정의
interface AuthContextType {
  token: string | null; // JWT 토큰
  login: (token: string) => void; // 로그인 함수
  logout: () => void; // 로그아웃 함수
}

const AuthContext = createContext<AuthContextType | null>(null); // 기본값을 null로 설정

// Provider 컴포넌트
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null); // 초기 토큰 상태

  const login = (token: string) => {
    setToken(token); // 토큰 저장
  };

  const logout = () => {
    setToken(null); // 토큰 초기화
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
