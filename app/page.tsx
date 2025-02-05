"use client";

import styled from "styled-components";
import Splash from './components/ui/splash';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import iconBack from './assets/icons/icon_back.svg';
import Image from 'next/image';
import iconKakao from './assets/icons/icon_kakao.svg';

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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 중앙 정렬 */
  align-items: center;
  z-index: 1000; /* 다른 요소 위에 표시 */
  background: rgba(0, 0, 0, 0.60);
  backdrop-filter: blur(4px);
`;

const IconBack = styled(Image)`
  width: 1.5rem;
  height: 1.5rem;
  margin: 1rem; /* 여백 추가 */
  cursor: pointer;
  align-self: flex-start; /* 좌측 상단에 배치 */
  margin-top: 1.5rem;
`;

const ModalContent = styled.div`
  width: 100%; /* 너비 조정 */
  max-width: 400px; /* 최대 너비 */
  max-height: 80vh; /* 최대 높이 설정 */
  overflow-y: auto; /* 세로 스크롤 가능 */
  padding: 1rem 1.5rem;
  border-radius: 1rem; /* 모서리 둥글게 */

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none; /* 스크롤바 숨기기 */
  }
`;

const ModalTitle = styled.div`
  align-self: stretch;
  color: var(--ivory, #E5DCCA);
  font-family: SUIT;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 800;
  line-height: 1.5rem; /* 120% */
`;

const ModalSubtitle = styled.div`
  color: var(--ivory, #E5DCCA);
  font-family: SUIT;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 800;
  line-height: 1rem; /* 133.333% */
  margin-top: 1rem; /* 위쪽 여백 */
`;

const P = styled.p`
  color: var(--ivory, #E5DCCA);
  font-family: SUIT;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  margin-top: 0.5rem; /* 위쪽 여백 */
`;

const Ul = styled.ul`
  list-style-type: disc; /* 기본 점 스타일 */
  padding-left: 20px; /* 왼쪽 패딩 추가 */
  color: var(--ivory, #E5DCCA);
  font-family: SUIT;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  margin-top: 0.5rem; /* 위쪽 여백 */
`
export default function Home() {
  const [show, setShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const router = useRouter();

  const handleAnimationComplete = () => {
    setShow(true);
  };

  const handleDiscriptionClick = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <Whole>
      <Splash onAnimationComplete={handleAnimationComplete} />
      {show && (
        <Container
          initial={{ opacity: 0 }} // 초기 상태
          animate={{ opacity: 1 }} // 애니메이션 상태
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }} // 100ms Ease out
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

      {/* 약관 모달 */}
      {isModalOpen && (
        <ModalOverlay>
          <IconBack src={iconBack} alt="뒤로가기" onClick={handleCloseModal} />
          <ModalContent>
            <ModalTitle>이용약관</ModalTitle>
            <ModalSubtitle>제 1조 (목적)</ModalSubtitle>
            <P>
              이 약관은 토스트잇의 이용 조건 및 절차, 회원과 서비스 제공자의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
            </P>
            <ModalSubtitle>제 2조 (정의)</ModalSubtitle>
            <P>{`1. "서비스"란 [토스트잇 팀]이 제공하는 메모 관련 모바일 웹 서비스를 의미합니다.`}</P>
            <P>{`2. "회원"이란 서비스에 가입하여 이 약관에 따라 서비스를 이용하는 자를 의미합니다.`}</P>
            <P>{`3. "유료 멤버십"이란 회원이 추가 요금을 지불하고 이용할 수 있는 프리미엄 서비스 기능을 의미합니다.`}</P>
            <P>{`4. "토스트"란 회원이 서비스에 저장한 메모 데이터를 의미합니다.`}</P>
            <P>{`5. "갤러리"란 회원이 서비스에 저장된 "토스트"가 카테고리 별로 분류되어있는, 열람이 가능한 창을 의미합니다.`}</P>
            <ModalSubtitle>제 3조 (회원가입 및 계정 관리)</ModalSubtitle>
            <P>{`1. 회원가입은 이메일 및 비밀번호를 이용하거나 카카오톡 계정을 통해 가능합니다.`}</P>
            <P>{`2. 만 14세 미만의 사용자는 회원가입이 제한됩니다.`}</P>
            <P>{`3. 회원은 정확하고 최신의 정보를 제공해야 하며, 이를 위반하여 발생한 불이익에 대한 책임은 회원에게 있습니다.`}</P>
            <P>{`4. 계정 정보 관리 책임은 회원에게 있으며, 회원은 계정을 제3자와 공유하거나 양도할 수 없습니다.`}</P>
            <ModalSubtitle>제 4조 (서비스 제공 및 변경)</ModalSubtitle>
            <P>1. 서비스는 회원의 메모 작성, 저장, 카테고리화, 불러오기, 갤러리 열람 기능을 제공합니다.</P>
            <P>2. 서비스는 회원의 데이터를 저장하지만, 공유 기능은 지원하지 않으며, 복사/붙여넣기를 통해서만 메모를 외부로 공유할 수 있습니다.</P>
            <P>3. 유료 멤버십 구독 시 아래와 같은 추가 기능이 제공됩니다:</P>
            <Ul>
              <li>메모 제목이 없는 경우 AI 기반 자동 요약 기능</li>
              <li>메모 RECAP 기능</li>
              <li>8개의 방위로 구성된 카테고리 제공</li>
            </Ul>
            <P>4. 서비스 내용은 운영상, 기술상의 필요에 따라 변경될 수 있으며, 변경 사항은 사전에 공지합니다. 서비스 종료 시, 남은 유료 멤버십 기간에 대한 비례 환불이 제공됩니다.</P>
          </ModalContent>
        </ModalOverlay>
      )}
    </Whole>
  );
}