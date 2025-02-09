'use client';

import './globals.css';
import StyledComponentsRegistry from '../registry';
import Providers from './providers'; // ✅ 클라이언트 Provider 불러오기
import { metadata, viewport } from './metadata'; // ✅ metadata를 따로 가져오기

import React, { useEffect } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ✅ 화면 크기 조절을 위한 useEffect 추가
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh(); // 초기 실행
    window.addEventListener('resize', setVh); // 화면 크기 변경 감지

    return () => window.removeEventListener('resize', setVh);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{
          width: '100vw', // 💡 화면 전체를 차지하도록 설정
          height: 'calc(var(--vh, 1vh) * 100)', // 💡 브라우저 주소창 고려하여 높이 설정
          margin: '0',
          padding: '0',
          display: 'flex',
          justifyContent: 'center', // 💡 중앙 정렬
          alignItems: 'center', // 💡 중앙 정렬
          backgroundColor: '#E5DCCA',
          overflow: 'hidden',
        }}
      >
        <StyledComponentsRegistry>
          <Providers>
            <div
              style={{
                width: '375px', // 아이폰 13 미니 너비
                height: '812px', // 아이폰 13 미니 높이
                position: 'absolute', // 💡 중앙 정렬을 위해 absolute 사용
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)', // 💡 중앙 정렬 유지
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // 💡 입체감 추가
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#171612', // 💡 앱 배경색 추가
                overflow: 'hidden',
              }}
            >
              {children}
            </div>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
