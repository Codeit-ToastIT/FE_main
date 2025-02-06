"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// 이메일 상태의 타입 정의
interface EmailContextType {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

// 초기값 설정
const initialContext: EmailContextType = {
  email: '',
  setEmail: () => {},
};

// EmailContext 생성
const EmailContext = createContext<EmailContextType>(initialContext);

export const EmailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState<string>('');

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children}
    </EmailContext.Provider>
  );
};

// custom Hook
export const useEmail = () => useContext(EmailContext);
