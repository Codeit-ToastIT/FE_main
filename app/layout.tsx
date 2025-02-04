import type { Metadata } from 'next';
import './globals.css';
import StyledComponentsRegistry from '@/registry';
import { AuthProvider } from './context/AuthContext'; 
import { EmailProvider } from './context/EmailContext'; 

export const metadata: Metadata = {
  title: 'Toast-it',
  description: 'Generated by Toast-it',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{
          width: '100vw', // 💡 화면 전체를 차지하도록 설정
          height: '100vh', // 💡 화면 전체를 차지하도록 설정
          margin: '0',
          padding: '0',
          display: 'flex',
          justifyContent: 'center', // 💡 중앙 정렬
          alignItems: 'center', // 💡 중앙 정렬
          backgroundColor: '#E5DCCA',
        }}
      >
        <StyledComponentsRegistry>
          <AuthProvider> {/* AuthProvider로 감싸기 */}
            <EmailProvider> {/* EmailProvider로 감싸기 */}
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
                }}
              >
                {children}
              </div>
            </EmailProvider>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}