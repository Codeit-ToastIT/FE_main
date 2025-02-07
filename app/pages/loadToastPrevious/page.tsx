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

const LoadToast: React.FC<LoadToastProps> = ({ onClose, onSave }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 식빵 위치
  const [activeSlice, setActiveSlice] = useState<number | null>(null); // 활성화된 조각 (0~3)
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 확인
  const [showHint, setShowHint] = useState(false); // 힌트 표시 여부
  let inactivityTimeout: NodeJS.Timeout;

  // 카테고리 이름. 추후 api로 교체 필요
  const categoryNames = ['카테고리 1', '카테고리 2', '카테고리 3', '카테고리 4'];

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true); // 드래그 시작
    setShowHint(false); // 힌트 숨김
    e.preventDefault(); // 기본 동작 방지

    // 초기 위치 설정
    const { clientX, clientY } = e;
    setPosition({
      x: clientX - window.innerWidth / 2,
      y: clientY - window.innerHeight / 2,
    });

    checkCollision(clientX, clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const { clientX, clientY } = e;

    setPosition({
      x: clientX - window.innerWidth / 2,
      y: clientY - window.innerHeight / 2,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false); // 드래그 종료
    if (activeSlice !== null) {
      const selectedCategory = categoryNames[activeSlice];
      onSave(selectedCategory); // 선택된 카테고리 전달
      onClose(selectedCategory); // 선택된 카테고리 전달
    }
    setPosition({ x: 0, y: 0 });
    setActiveSlice(null);
  };

  const checkCollision = (x: number, y: number) => {
    let selectedCategory: number | null = null;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    if (y < centerY && Math.abs(y - centerY) > Math.abs(x - centerX)) {
      selectedCategory = 0; // 북쪽 - 카테고리 1
    } else if (x > centerX && Math.abs(x - centerX) > Math.abs(y - centerY)) {
      selectedCategory = 1; // 동쪽 - 카테고리 2
    } else if (y > centerY && Math.abs(y - centerY) > Math.abs(x - centerX)) {
      selectedCategory = 2; // 남쪽 - 카테고리 3
    } else if (x < centerX && Math.abs(x - centerX) > Math.abs(y - centerY)) {
      selectedCategory = 3; // 서쪽 - 카테고리 4
    }
    setActiveSlice(selectedCategory); // 가장 가까운 조각만 활성화
  };


  //힌트 표시 
  const resetInactivityTimeout = () => {
    clearTimeout(inactivityTimeout);
    setShowHint(false); // 힌트 숨김
    inactivityTimeout = setTimeout(() => {
      setShowHint(true); // 2초 동안 아무 동작 없을 시 힌트 표시
    }, 2000);
  };

  useEffect(() => {
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
    >
      <ModalOverlay>
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
  display: flex;
  align-items: center;
  text-align: center;
  color: black;
  z-index: 50;
`;
