"use client";

import styled from "styled-components";
import Splash from './components/ui/splash';
import {useState} from 'react';
import {motion} from 'framer-motion'
import { useRouter } from 'next/navigation';

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
`

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
`

const KakaoButton = styled(Button)`
  background: #FAE100;
`

const Title = styled.span`
  color: var(--black, #171612);
  text-align: center;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  margin-left: 0.5rem;
`

const KakaoIcon = styled.img`
  display: flex;
  width: 1.5rem;
  height: 1.5rem;
  justify-content: center;
  align-items: center;
`

export default function Home() {
  // Toast 로고 애니메이션 종료 후 컴포넌트 생성
  const [show, setShow] = useState(false);

  const handleAnimationComplete = () => {
    setShow(true);
  }

  const router = useRouter();

  return (
    <Whole>
      <Splash onAnimationComplete={handleAnimationComplete}/>
      {show && (
        <Container
          initial={{ opacity: 0 }} // 초기 상태
          animate={{ opacity: 1 }} // 애니메이션 상태
          transition={{ duration: 0.5, delay:0.5, ease: 'easeOut' }} // 100ms Ease out
        >
          <Discription>가입과 함께 약관에 동의합니다.</Discription>
          <Button onClick={() => {router.push('/pages/emailInputPage')}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4.1999 6.5998L11.3169 11.5269C11.7278 11.8114 12.272 11.8114 12.683 11.5269L19.7999 6.5998M4.7999 19.1998H19.1999C20.5254 19.1998 21.5999 18.1253 21.5999 16.7998V7.1998C21.5999 5.87432 20.5254 4.7998 19.1999 4.7998H4.7999C3.47442 4.7998 2.3999 5.87432 2.3999 7.19981V16.7998C2.3999 18.1253 3.47442 19.1998 4.7999 19.1998Z" stroke="#171612" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <Title>이메일로 시작하기</Title>
          </Button>
          <KakaoButton>
            <KakaoIcon src="https://s3-alpha-sig.figma.com/img/b0e2/faa9/489207e3bac388c627cc68d80e262329?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=igAS8pgtU2y05YCT4cjNdSd32bneh8aCV2sf-e3muHDfg4vR6DbJMmHg7A5XVjcNvIYTyJgu4Rh9nU-ZfeHabKS8Dzlf~udAR7yj2Dor3CUL8sV1RHmQAgrIJTJvdBg2FjlIVHUhpTVqbojQmINthTRzxQDwcZWVWoSNLYOaUNnH~InwrF4Zc87Uu~mF2R~YpzrDXbTiyBtQMYagJAExL8Gr~NeFN~LUPJbyX2Ada4B~jm4TSOtHEht-UHJaFaR5wXE1v4m2wLOS9dxO8C~RSeMPmzltVJYmdMmWNrpzgl~3DAki6gy8jnvERp7fHS~VKtcUDwJsbaZ8YvnCfawdVQ__" />
            <Title>카카오 계정으로 시작하기</Title>
          </KakaoButton>
        </Container>
      )}
    </Whole>
  )
};
