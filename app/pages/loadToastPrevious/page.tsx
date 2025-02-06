'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Hint, HintBold } from '../../components/SaveToast';
import plateImage from '../../assets/load/plate.svg';
import ToastImg from '../../assets/load/toasts/burnt1.png';

interface LoadToastProps {
  onClose: (category: string) => void; // 모달 닫기 함수, 인자 추가
  onSave: (category: string) => void; // 저장 콜백 함수
  memoId: string; // 메모 ID
  title: string | null; // 제목
  content: string | null; // 내용
}

const LoadToast: React.FC<LoadToastProps> = ({ onClose, onSave, memoId, title, content }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 식빵 위치
  const [activeSlice, setActiveSlice] = useState<number | null>(null); // 활성화된 조각 (0~3)
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 확인
  const [showHint, setShowHint] = useState(false); // 힌트 표시 여부
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 }); // 초기 위치
  const prevMousePosition = useRef({ x: 0, y: 0 }); // 이전 마우스 위치
  let inactivityTimeout: NodeJS.Timeout;

  useEffect(() => {
    console.log('Memo Info:', { memoId, title, content });
  }, [memoId, title, content]);

  // 카테고리 이름. 추후 api로 교체 필요
  const categoryNames = ['카테고리 1', '카테고리 2', '카테고리 3', '카테고리 4'];

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true); // 드래그 시작
    setShowHint(false); // 힌트 숨김
    e.preventDefault(); // 기본 동작 방지

    // 초기 위치 설정
    const { clientX, clientY } = e;
    const direction = clientY > prevMousePosition.current.y ? 'down' : 'up';
    const initialY = direction === 'down' ? -window.innerHeight / 2 : window.innerHeight / 2;
    setInitialPosition({ x: clientX - window.innerWidth / 2, y: initialY });
    setPosition({ x: clientX - window.innerWidth / 2, y: initialY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const { clientX, clientY } = e;

    setPosition({
      x: clientX - window.innerWidth / 2,
      y: clientY - window.innerHeight / 2,
    });

    checkCollision(clientX - window.innerWidth / 2, clientY - window.innerHeight / 2);
  };

  const handleMouseUp = () => {
    setIsDragging(false); // 드래그 종료
    if (activeSlice !== null) {
      const selectedCategory = categoryNames[activeSlice];

      // 제목이 null인 경우 현재 날짜로 설정
      const now = new Date();
      const currentTitle =
        title ||
        `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일`;

      console.log({
        memoId,
        category: selectedCategory,
        title: currentTitle,
        content,
      });

      onSave(selectedCategory); // 선택된 카테고리 전달
      onClose(selectedCategory); // 선택된 카테고리 전달
    }
    setPosition({ x: 0, y: 0 });
    setActiveSlice(null);
  };

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true); // 드래그 시작
    setShowHint(false); // 힌트 숨김
    e.preventDefault();

    // 초기 위치 설정
    const touch = e.touches[0];
    const direction = touch.clientY > prevMousePosition.current.y ? 'down' : 'up';
    const initialY = direction === 'down' ? -window.innerHeight / 2 : window.innerHeight / 2;
    setInitialPosition({ x: touch.clientX - window.innerWidth / 2, y: initialY });
    setPosition({ x: touch.clientX - window.innerWidth / 2, y: initialY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - window.innerWidth / 2,
      y: touch.clientY - window.innerHeight / 2,
    });

    checkCollision(touch.clientX - window.innerWidth / 2, touch.clientY - window.innerHeight / 2);
  };

  const handleTouchEnd = () => {
    setIsDragging(false); // 드래그 종료
    if (activeSlice !== null) {
      const selectedCategory = categoryNames[activeSlice];

      // 제목이 null인 경우 현재 날짜로 설정
      const now = new Date();
      const currentTitle =
        title ||
        `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일`;

      console.log({
        memoId,
        category: selectedCategory,
        title: currentTitle,
        content,
      });

      onSave(selectedCategory); // 선택된 카테고리 전달
      onClose(selectedCategory); // 선택된 카테고리 전달
    }
    setPosition({ x: 0, y: 0 });
    setActiveSlice(null);
  };

  const checkCollision = (x: number, y: number) => {
    const threshold = 20;
    let closestSlice: number | null = null;
    let minDistance = Infinity;

    const slices = [
      { id: 0, dx: 0, dy: -threshold }, // 상단 조각
      { id: 1, dx: threshold, dy: 0 }, // 오른쪽 조각
      { id: 2, dx: 0, dy: threshold }, // 하단 조각
      { id: 3, dx: -threshold, dy: 0 }, // 왼쪽 조각
    ];

    // 각 조각과의 거리 계산
    for (const slice of slices) {
      const distance = Math.sqrt((x - slice.dx) ** 2 + (y - slice.dy) ** 2);
      if (distance < minDistance && distance <= threshold) {
        minDistance = distance;
        closestSlice = slice.id;
      }
    }

    setActiveSlice(closestSlice); // 가장 가까운 조각만 활성화
  };

  const resetInactivityTimeout = () => {
    clearTimeout(inactivityTimeout);
    setShowHint(false); // 힌트 숨김
    inactivityTimeout = setTimeout(() => {
      setShowHint(true); // 2초 동안 아무 동작 없을 시 힌트 표시
    }, 2000);
  };

  useEffect(() => {
    // 마우스 움직임 및 클릭 이벤트 리스너 추가
    window.addEventListener('mousemove', resetInactivityTimeout);
    window.addEventListener('mousedown', resetInactivityTimeout);

    return () => {
      // 이벤트 리스너 정리
      clearTimeout(inactivityTimeout);
      window.removeEventListener('mousemove', resetInactivityTimeout);
      window.removeEventListener('mousedown', resetInactivityTimeout);
    };
  }, []);

  return (
    <Container
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <ModalOverlay>
        {/* 힌트 메시지 */}
        {showHint && (
          <Hint>
            <HintBold>꾹 누른 채로 이동</HintBold>
            해서 불러올 수 있어요.
          </Hint>
        )}
        <RadialMenu>
          <Plate src={plateImage.src} />
          <Toast
            isDragging={isDragging}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            src={ToastImg.src}
          />
          {activeSlice !== null && <CategoryText>{categoryNames[activeSlice]}</CategoryText>}
        </RadialMenu>
      </ModalOverlay>
    </Container>
  );
};

export default LoadToast;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RadialMenu = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Plate = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  user-select: none;
  z-index: 10;
`;

const Toast = styled.img<{ isDragging: boolean }>`
  position: absolute;
  transform: translate(-50%, -50%) rotate(45deg); // Adjust the rotation angle as needed
  width: 296px; // Adjust the width as needed
  height: 320px; // Adjust the height as needed
  user-select: none;
  z-index: 20;
  opacity: ${({ isDragging }) => (isDragging ? 1 : 0)};
`;

const CategoryText = styled.div`
  font-family: 'SUIT';
  font-style: normal;
  font-weight: 800;
  font-size: 12px;
  line-height: 14px;
  /* or 117% */
  display: flex;
  align-items: center;
  text-align: center;
  color: black;
  z-index: 50;
`;
