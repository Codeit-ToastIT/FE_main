/**
 * 파일명: home.tsx
 * 작성일: 2025-01-24
 * 작성자: 이서연
 * 설명: header, body 스타일 수정.
 */

// 💖 표시된 부분 SaveToast로 활성화된 메모 id 전달을 위해 수정한 부분
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import Image from 'next/image';

import Header from '../../components/layout/header';
import Body from '../../components/common/HomeBody';
import MyPage from '../myPage/myPage'; // ✅ MyPage 컴포넌트 추가

import iconAdd from '../../assets/icons/icon_add.svg';

interface HomeProps {
  onHelpClick: () => void;
  // 💖 SaveToast로 활성화된 메모 id 전달을 위한 콜백 prop 추가
  onActiveMemoChange?: (id: string) => void;
}

// 💖 onActiveMemoChange 추가
export default function Home({ onHelpClick, onActiveMemoChange }: HomeProps) {
  const searchParams = useSearchParams();

  // ✅ myPage를 열고 닫는 상태 추가
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);

  // ✅ 프로필 버튼 클릭 시 myPage 표시
  const onProfileClick = () => {
    setIsMyPageOpen(true); // ✅ myPage 열기
  };

  // ✅ myPage 닫기 함수
  const onCloseMyPage = () => {
    setIsMyPageOpen(false);
  };

  const [showDeletedMessage, setShowDeletedMessage] = useState(false);
  const [showDeleteErrorMessage, setShowDeleteErrorMessage] = useState(false);
  const [deletedMemoId, setDeletedMemoId] = useState<string | null>(null); // ✅ 삭제된 메모 ID 상태 추가

  useEffect(() => {
    if (searchParams.get('deleted') === 'true') {
      setShowDeletedMessage(true);
      setTimeout(() => setShowDeletedMessage(false), 2000);
    }
    if (searchParams.get('deletedError') === 'true') {
      setShowDeleteErrorMessage(true);
      setTimeout(() => setShowDeleteErrorMessage(false), 2000);
    }

    // ✅ 삭제된 메모 ID 가져오기
    const memoId = searchParams.get('deletedMemoId');
    if (memoId) {
      setDeletedMemoId(memoId);
    }
  }, [searchParams]);

  const handleParentTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // ✅ 부모 요소가 `touchmove`를 막지 않도록 방지
    e.stopPropagation();
  };

  return (
    <Container onTouchMove={handleParentTouchMove}>
      <StyledHeader title="TOAST IT" onHelpClick={onHelpClick} onProfileClick={onProfileClick} />
      <IconAdd src={iconAdd} alt="Add" />

      {/* // 💖 onActiveMemoChange 콜백 전달 추가*/}
      <StyledBody deletedMemoId={deletedMemoId} onActiveMemoChange={onActiveMemoChange} />

      {/* ✅ MyPage 컴포넌트가 오른쪽에서 왼쪽으로 슬라이드되며 나타남 */}
      <MyPageOverlay isOpen={isMyPageOpen} onClick={onCloseMyPage}>
        <StyledMyPage onClick={(e) => e.stopPropagation()} isOpen={isMyPageOpen} />
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
  height: 56px;
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

const ErrorMessageBox = styled.div`
  background: rgba(255, 0, 0, 0.8);
`;

const StyledBody = styled(Body)`
  width: 375px;
  height: 579px;
  border-radius: 40px 0px 0px 40px;
  background: #fff;
  box-sizing: border-box;
`;

/* ✅ MyPage 배경 오버레이 */
const MyPageOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 89vh;
  background-color: ${({ isOpen }) => (isOpen ? 'rgba(0, 0, 0, 0.5)' : 'transparent')};
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  justify-content: flex-end;
  align-items: center;
  z-index: 999;
`;

/* ✅ 오른쪽에서 왼쪽으로 슬라이드되는 MyPage */
const StyledMyPage = styled(MyPage)<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 89vh;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1100;
  border-top-right-radius: 40px;
  border-bottom-right-radius: 40px;

  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
`;
