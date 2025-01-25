'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import toastImage from '../../assets/save/saveToast.png';
import categorySliceImage from '../../assets/save/category.png';
import selectedCategoryImage from '../../assets/save/selectedCategory.png'; // 선택된 조각 이미지

const SaveToast = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 식빵 위치
  const [activeSlice, setActiveSlice] = useState<number | null>(null); // 활성화된 조각 (0~3)
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 확인
  const [showHint, setShowHint] = useState(false); // 힌트 표시 여부
  let inactivityTimeout: NodeJS.Timeout;

  // 카테고리 이름
  const categoryNames = [
    '카테고리 1',
    '카테고리 2',
    '카테고리 3',
    '카테고리 4',
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true); // 드래그 시작
    setShowHint(false); // 힌트 숨김
    e.preventDefault(); // 기본 동작 방지
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const { movementX, movementY } = e;

    setPosition((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      // 대각선 이동 방지: movementX와 movementY 중 절대값이 큰 방향만 이동
      if (Math.abs(movementX) > Math.abs(movementY)) {
        newX = Math.min(16, Math.max(-16, prev.x + movementX)); // 좌우 이동
      } else {
        newY = Math.min(16, Math.max(-16, prev.y + movementY)); // 상하 이동
      }

      // 충돌 체크
      checkCollision(newX, newY);

      return { x: newX, y: newY };
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false); // 드래그 종료
    if (activeSlice !== null) {
      console.log(`Selected Category: ${categoryNames[activeSlice]}`); // 선택된 카테고리 이름 출력
    }
    setPosition({ x: 0, y: 0 }); // 원래 위치로 복귀
    setActiveSlice(null); // 모든 조각 비활성화
  };

  const checkCollision = (x: number, y: number) => {
    const threshold = 20; // 영역 기준
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
      onMouseMove={handleMouseMove} // 마우스 이동 처리
      onMouseUp={handleMouseUp} // 드래그 종료 처리
      onMouseLeave={handleMouseUp} // 컨테이너를 벗어나면 종료
    >
      {/* 힌트 메시지 */}
      {showHint && (
        <Hint>
          <HintBold>꾹 누른 채로 이동</HintBold>
          해서 저장할 수 있어요.
        </Hint>
      )}

      {/* 중앙 UI */}
      <RadialMenu>
        {/* 상단 조각 */}
        <CategoryWrapper>
          <Category
            src={
              activeSlice === 0
                ? selectedCategoryImage.src
                : categorySliceImage.src
            }
            style={{
              transform: 'translateY(-81.9px) rotate(0deg)',
            }}
            alt="카테고리 상단"
          />
          <CategoryLabel style={{ transform: 'translateY(-100px)' }}>
            {categoryNames[0]}
          </CategoryLabel>
        </CategoryWrapper>
        {/* 오른쪽 조각 */}
        <CategoryWrapper>
          <Category
            src={
              activeSlice === 1
                ? selectedCategoryImage.src
                : categorySliceImage.src
            }
            style={{
              transform: 'translateX(81px) translateY(-0.5px) rotate(90deg)',
            }}
            alt="카테고리 오른쪽"
          />
          <CategoryLabel style={{ transform: 'translateX(100px)' }}>
            {categoryNames[1]}
          </CategoryLabel>
        </CategoryWrapper>
        {/* 하단 조각 */}
        <CategoryWrapper>
          <Category
            src={
              activeSlice === 2
                ? selectedCategoryImage.src
                : categorySliceImage.src
            }
            style={{
              transform: 'translateY(81px) rotate(180deg)',
            }}
            alt="카테고리 하단"
          />
          <CategoryLabel style={{ transform: 'translateY(100px)' }}>
            {categoryNames[2]}
          </CategoryLabel>
        </CategoryWrapper>
        {/* 왼쪽 조각 */}
        <CategoryWrapper>
          <Category
            src={
              activeSlice === 3
                ? selectedCategoryImage.src
                : categorySliceImage.src
            }
            style={{
              transform:
                'translateX(-81.3px) translateY(-0.4px) rotate(-90deg)',
            }}
            alt="카테고리 왼쪽"
          />
          <CategoryLabel style={{ transform: 'translateX(-100px)' }}>
            {categoryNames[3]}
          </CategoryLabel>
        </CategoryWrapper>

        {/* 식빵 */}
        <Toast
          src={toastImage.src}
          alt="식빵"
          x={position.x}
          y={position.y}
          onMouseDown={handleMouseDown} // 클릭 시작
        />
      </RadialMenu>
    </Container>
  );
};

export default SaveToast;

// --- Styled Components ---
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
`;

const Hint = styled.div`
  position: absolute;
  top: 170px;
  left: calc(50% - 125.5px);
  width: 251px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  background: rgba(23, 22, 18, 0.8);
  border-radius: 40px;
  font-family: 'SUIT';
  font-style: normal;
  font-size: 14px;
  line-height: 16px;
  color: #e5dcca;
  text-align: center;
  white-space: nowrap; /* 텍스트가 한 줄로 유지되도록 설정 */
`;

const HintBold = styled.span`
  font-weight: 800; /* 강조 부분 */
`;

const RadialMenu = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CategoryWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Category = styled.img`
  width: auto;
  height: auto;
  transform-origin: center;
  pointer-events: none;
`;

const CategoryLabel = styled.div`
  position: absolute;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  font-family: 'SUIT-Variable';
  // font-weight: 600;
  color: white;
`;

const Toast = styled.img<{ x: number; y: number }>`
  position: absolute;
  top: calc(50% + ${({ y }) => y}px);
  left: calc(50% + ${({ x }) => x}px);
  transform: translate(-50%, -50%);
  cursor: grab;
  user-select: none;
  transition: transform 0.2s ease;
  z-index: 10;
`;
