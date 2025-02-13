/**
 * 파일명: home.tsx
 * 작성일: 2025-01-24
 * 작성자: 이서연
 * 설명: header, body 스타일 수정.
 */

// 💖 표시된 부분 SaveToast로 활성화된 메모 id 전달을 위해 수정한 부분
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import Header from '../../components/layout/header';
import Body from '../../components/common/body';
import MyPage from '../myPage/myPage'; // ✅ MyPage 컴포넌트 추가

import iconAdd from '../../assets/icons/icon_add.svg';

interface HomeProps {
  onHelpClick: () => void;
  // 💖 SaveToast로 활성화된 메모 id 전달을 위한 콜백 prop 추가
  onActiveMemoChange?: (id: string) => void;
}

// 💖 onActiveMemoChange 추가
export default function Home({ onHelpClick, onActiveMemoChange }: HomeProps) {
  // ✅ myPage를 열고 닫는 상태 추가
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);

  // ✅ 프로필 버튼 클릭 시 myPage 표시
  const onProfileClick = () => {
    setIsMyPageOpen((prev) => !prev);
  };

  // ✅ myPage 닫기 함수
  const onCloseMyPage = () => {
    setIsMyPageOpen(false);
  };

  const [showDeletedMessage, _setShowDeletedMessage] = useState(false);

  const handleParentTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // ✅ 부모 요소가 `touchmove`를 막지 않도록 방지
    e.stopPropagation();
  };

  return (
    <Container onTouchMove={handleParentTouchMove}>
      <StyledHeader title="TOAST IT" onHelpClick={onHelpClick} onProfileClick={onProfileClick} />
      <IconAdd src={iconAdd} alt="Add" />

      {/* // 💖 onActiveMemoChange 콜백 전달 추가*/}
      <StyledBody onActiveMemoChange={onActiveMemoChange} />

      {showDeletedMessage && <DeletedMessage>토스트 하나를 버렸어요.</DeletedMessage>}

      {/* ✅ MyPage 컴포넌트가 오른쪽에서 왼쪽으로 슬라이드되며 나타남 */}
      <MyPageOverlay $isOpen={isMyPageOpen} onClick={onCloseMyPage}>
        <StyledMyPage onClick={(e) => e.stopPropagation()} $isOpen={isMyPageOpen} />
      </MyPageOverlay>
    </Container>
  );
}

const Container = styled.div`
  touch-action: none; // ✅ 부모 요소에서도 터치 동작을 막지 않도록 설정
  user-select: none;
`;

const StyledHeader = styled(Header)`
  width: 375px;
  height: 56dvh; /* 💡 주소창이 있을 때도 높이 유지 */
  background: var(--black, #171612);
  box-sizing: border-box;
`;

const IconAdd = styled(Image)`
  position: absolute;
  top: 40%;
  left: 20%;
  transform: 'translate(-40%, -20%)'
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  opacity: 0.9;
`;

const DeletedMessage = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  z-index: 1000;
  animation: fadeInOut 2s ease-in-out;
`;

const StyledBody = styled(Body)`
  width: 375px;
  height: 100dvh;
  border-radius: 40px 0px 0px 40px;
  background: #fff;
  box-sizing: border-box;
`;

/* ✅ MyPage 배경 오버레이 */
const MyPageOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')}; // ✅ 토글 기능 반영
  justify-content: center;
  align-items: center;
  z-index: 999;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

/* ✅ 오른쪽에서 왼쪽으로 슬라이드되는 MyPage */
const StyledMyPage = styled(MyPage)<{ $isOpen: boolean }>`
  height: 100dvh;
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px; /* 원하는 너비 설정 */

  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(400px)')};
  transition:
    transform 0.3s cubic-bezier(0, 0, 0.58, 1),
    opacity 0.3s ease;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
`;
