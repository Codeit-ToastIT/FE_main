'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { Hint, HintBold } from './SaveToast';
import plateImage from '../assets/load/plate.svg';
import ToastImg from '../assets/load/toasts/burnt1.png';
import { API_BASE_URL } from '../api/api';
import { useAuth } from '../context/AuthContext';

interface LoadToastProps {
  onClose: (category: string) => void; // 모달 닫기 함수, 인자 추가
  onCategorySelect: (categoryId: string) => void; // 카테고리 선택 함수 추가
}

const LoadToast: React.FC<LoadToastProps> = ({ onClose, onCategorySelect }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 식빵 위치
  const [activeSlice, setActiveSlice] = useState<number | null>(null); // 활성화된 조각 (0~3)
  const [isdragging, setIsdragging] = useState(false); // 드래그 상태 확인
  const [ispressing, setIspressing] = useState(true);
  const [showHint, setShowHint] = useState(false); // 힌트 표시 여부
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  let inactivityTimeout: NodeJS.Timeout;
  const { token, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCategoryIds = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.categories && Array.isArray(data.categories)) {
          const ids = data.categories.map((category: { id: string }) => category.id);
          setCategoryIds(ids);
          const categories = data.categories.map((category: { name: string }) => category.name);
          setCategoryName(categories);
          if (ids.length > 0) {
            setSelectedCategory(ids[0]); // 첫 번째 카테고리 선택
          }
        } else {
          console.error('Categories data is undefined or not an array');
        }
      } catch (error) {
        console.error('Error fetching category IDs:', error);
      }
    };

    fetchCategoryIds();
  }, [token]);

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsdragging(true); // 드래그 시작
    setShowHint(false); // 힌트 숨김
    setIspressing(true);
    e.preventDefault(); // 기본 동작 방지

    const { clientX, clientY } = e;
    checkCollision(clientX, clientY);
  };

  const handleMouseUp = () => {
    setIsdragging(false); // 드래그 종료
    setIspressing(false);
    if (activeSlice !== null) {
      const selectedCategoryId = categoryIds[activeSlice];
      onClose(selectedCategoryId); // 선택된 카테고리 전달
      onCategorySelect(selectedCategoryId); // 선택된 카테고리 ID 전달
      router.push(`loadToastPage?category=${selectedCategoryId}`); // LoadToastPage로 이동
    }
    setPosition({ x: 0, y: 0 });
    setActiveSlice(null);
    playSaveSound();
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

  // 효과음 재생 함수 추가
  const playSaveSound = () => {
    const audio = new Audio('/sounds/toaster_open.wav'); // 효과음 경로
    audio
      .play()
      .then(() => console.log('✅ 효과음 재생 성공'))
      .catch((error) => console.error('❌ 효과음 재생 실패:', error));
  };

  return (
    <Container onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <ModalOverlay>
        {showHint && (
          <Hint>
            <HintBold>꾹 누른 채로 이동</HintBold>
            해서 불러올 수 있어요.
          </Hint>
        )}
        <RadialMenu>
          <Plate src={plateImage.src} ispressing={ispressing.toString()} />
          <Toast isdragging={isdragging} selectedCategory={activeSlice} src={ToastImg.src} />
          {activeSlice !== null && (
            <CategoryText ispressing={ispressing.toString()}>
              {categoryName[activeSlice]}
            </CategoryText>
          )}
          <MiddleToast ispressing={ispressing.toString()} src={ToastImg.src} />
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

const Plate = styled.img<{ ispressing: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  user-select: none;
  z-index: 10;
  width: ${({ ispressing }) =>
    ispressing === 'true' ? '120px' : '320px'}; // 예시: ispressing에 따라 너비 변경
  height: ${({ ispressing }) =>
    ispressing === 'true' ? '120px' : '320px'}; // 예시: ispressing에 따라 너비 변경
`;

const Toast = styled.img<{ isdragging: boolean; selectedCategory: number | null }>`
  position: absolute;
  top: ${({ selectedCategory }) => {
    switch (selectedCategory) {
      case 0:
        return '-350px'; // 북쪽
      case 1:
        return '50%'; // 동쪽
      case 2:
        return '500px'; // 남쪽
      case 3:
        return '50%'; // 서쪽
    }
  }};
  left: ${({ selectedCategory }) => {
    switch (selectedCategory) {
      case 0:
        return '50%'; // 북쪽
      case 1:
        return '400px'; // 동쪽
      case 2:
        return '50%'; // 남쪽
      case 3:
        return '-120px'; // 서쪽
    }
  }};
  transform: translate(-50%, -50%) rotate(270deg); // 90도 회전
  width: 296px; // 너비 조정
  height: 320px; // 높이 조정
  user-select: none;
  z-index: 20;
  opacity: ${({ isdragging }) => (isdragging ? 1 : 0)};
`;

const CategoryText = styled.div<{ ispressing: string }>`
  font-style: normal;
  font-weight: 800;
  font-size: 12px;
  line-height: 14px;
  display: flex;
  align-items: center;
  text-align: center;
  color: black;
  z-index: 50;
  opacity: ${({ ispressing }) => (ispressing === 'true' ? 1 : 0)};
`;

const MiddleToast = styled.img<{ ispressing: string }>`
  position: absolute;
  width: 148px; // 너비 조정
  height: 160px; // 높이 조정
  z-index: 20;
  top: 20%;
  left: 25%;
  opacity: ${({ ispressing }) => (ispressing === 'true' ? 0 : 1)};
`;
