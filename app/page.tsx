"use client";

import styled from "styled-components";
import Splash from './components/ui/splash';
import { useState, useEffect } from 'react';
import { motion  } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import iconKakao from './assets/icons/Group 8.svg';
import TermsModal from './components/common/TermsModal';
import { API_BASE_URL } from "./api/api";

const Whole = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #171612;
`;

const Discription = styled.div`
  color: var(--ivory, #E5DCCA);
  text-align: center;
  font-family: SUIT;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.875rem; /* 116.667% */
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-underline-position: from-font;
  margin-bottom: 1rem;
  cursor: pointer; /* 클릭 가능하도록 커서 변경 */
`;

const Container = styled(motion.div)`
  width: 100%;
  position: fixed;
  top: 29.81rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  display: flex;
  width: 20.5rem;
  height: 2.5rem;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 2.5rem;
  background: var(--ivory, #E5DCCA);
  margin-bottom: 0.5rem;
`;

const KakaoButton = styled(Button)`
  background: #FAE100;
`;

const Title = styled.span`
  color: var(--black, #171612);
  text-align: center;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  margin-left: 0.5rem;
`;

const KakaoIcon = styled(Image)`
  display: flex;
  width: 1.5rem;
  height: 1.5rem;
  justify-content: center;
  align-items: center;
`;

export default function Home() {
  const [show, setShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // 로그인 유지 API 
  useEffect(() => {
    console.log("useEffect 실행");
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      console.log('token: ', token)
      if (!token) {
        console.log('No token found');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/restore`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include', 
        });

        if (response.ok) {
          const data = await response.json();
          if (data.accessToken) {
            console.log('토큰 확인, 홈화면으로 이동');
            localStorage.setItem('token', data.accessToken); // 토큰 갱신
            router.push('/pages/createToastPage');
          }
        } else if (response.status === 401) {
          console.log('401 Unauthorized : 로그인 필요');
          localStorage.removeItem('token'); // 토큰 삭제
        }
      } catch (error) {
        console.error('Error checking token:', error);
        localStorage.removeItem('token'); // 토큰 삭제
      }
    };

    checkToken();
  }, [router]);

  const handleAnimationComplete = () => {
    setShow(true);
  };

  const handleDiscriptionClick = () => {
    setIsModalOpen(true);
  };

  return (
    <Whole>
      <Splash onAnimationComplete={handleAnimationComplete} />
      {show && (
        <Container
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
        >
          <Discription onClick={handleDiscriptionClick}>가입과 함께 약관에 동의합니다.</Discription>
          <Button onClick={() => { router.push('/pages/emailInputPage') }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4.1999 6.5998L11.3169 11.5269C11.7278 11.8114 12.272 11.8114 12.683 11.5269L19.7999 6.5998M4.7999 19.1998H19.1999C20.5254 19.1998 21.5999 18.1253 21.5999 16.7998V7.1998C21.5999 5.87432 20.5254 4.7998 19.1999 4.7998H4.7999C3.47442 4.7998 2.3999 5.87432 2.3999 7.19981V16.7998C2.3999 18.1253 3.47442 19.1998 4.7999 19.1998Z" stroke="#171612" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <Title>이메일로 시작하기</Title>
          </Button>
          <KakaoButton>
            <KakaoIcon src={iconKakao} alt="kakao"/>
            <Title>카카오 계정으로 시작하기</Title>
          </KakaoButton>
        </Container>
      )}

      <TermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>  
    </Whole>
  );
}