/**
 * 파일명: SaveToast.tsx
 * 작성일: 2025-01-20
 * 작성자: 임사랑
 * 설명: 메모 저장 컴포넌트 구현
 */

// 화면 사이즈 조절 필요, 코드 분리 필요(코드 너무 길어짐)

'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import toastImage from '../assets/save/saveToast.png'; // 식빵 이미지
import categorySliceImage from '../assets/save/category.png'; // 카테고리 조각 이미지(css로 구현 or svg로 변경 필요)
import selectedCategoryImage from '../assets/save/selectedCategory.png'; // 선택된 카테고리 조각 이미지(css로 구현 or svg로 변경 필요)

import { API_BASE_URL } from '../api/api';
import { useAuth } from '../context/AuthContext';

interface SaveToastProps {
  onClose: (category: string) => void; // 모달 닫기 함수, 인자 추가
  onSave: (category: string) => void; // 저장 콜백 함수
  memoId: string; // 메모 ID
  title: string | null; // 제목
  content: string | null; // 내용
}

const SaveToast: React.FC<SaveToastProps> = ({ onClose, onSave, memoId, title, content }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 식빵 위치
  const [activeSlice, setActiveSlice] = useState<number | null>(null); // 활성화된 조각 (0~3)
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 확인
  const [showHint, setShowHint] = useState(false); // 힌트 표시 여부
  const [showSaveMessage, setShowSaveMessage] = useState<string | null>(null); // 저장 메시지 상태
  const [categoryNames, setCategoryNames] = useState<string[]>([]); // 카테고리 이름
  let inactivityTimeout: NodeJS.Timeout;

  const [memoTitle, setMemoTitle] = useState<string | null>(title || null);
  const [memoContent, setMemoContent] = useState<string | null>(content || null);

  // 카테고리 이름. 추후 api로 교체 필요
  // const categoryNames = ['카테고리 1', '카테고리 2', '카테고리 3', '카테고리 4'];

  const { token } = useAuth();

  // 💖 특정 메모 정보를 가져오는 함수 추가
  const fetchMemoDataFromCategories = async () => {
    try {
      const categoryIds = [1, 2, 3, 4]; // 실제 카테고리 ID 사용

      const results = await Promise.all(
        categoryIds.map((id) =>
          fetch(`${API_BASE_URL}/api/categories/${id}/memos`, {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ${token}',
            },
          }).then((res) => {
            if (!res.ok) throw new Error(`카테고리 ${id} 데이터 불러오기 실패`);
            return res.json();
          }),
        ),
      );

      // 모든 카테고리의 메모 데이터를 합침
      const allMemos = results.flatMap((result) =>
        result.notes.map((note: any) => ({
          id: note.id,
          categoryId: result.category.id,
          categoryName: result.category.name,
          title: note.title,
          content: note.content,
        })),
      );

      // 특정 memoId를 찾음
      const memoData = allMemos.find((memo) => memo.id === Number(memoId));

      if (memoData) {
        console.log('✅ 찾은 메모 정보:', memoData);
      } else {
        console.log('❌ 해당 memoId에 대한 메모를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('메모 데이터 가져오기 실패:', error);
    }
  };

  // ✅ 컴포넌트 마운트 시 실행
  useEffect(() => {
    fetchMemoDataFromCategories();
  }, [memoId]);

  useEffect(() => {
    console.log('Memo Info:', { memoId, title, content });
  }, [memoId, title, content]);

  useEffect(() => {
    // SaveToast가 처음 렌더링될 때 힌트 타이머 시작
    resetInactivityTimeout();

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

  // 카테고리 불러오기
  useEffect(() => {
    // 카테고리 ID 배열
    const categoryIds = [1, 2, 3, 4];

    // 💖여러 API 호출을 동시에 진행 (Promise.all 사용)
    const fetchCategoryNames = async () => {
      try {
        const results = await Promise.all(
          categoryIds.map((id) =>
            fetch(`${API_BASE_URL}/api/categories/${id}/memos`, {
              method: 'GET',
              headers: {
                Authorization: 'Bearer ${token}',
              },
            }).then((res) => {
              if (!res.ok) {
                throw new Error(`카테고리 ${id}를 가져오는데 실패했습니다.`);
              }
              return res.json();
            }),
          ),
        );

        // 각 응답에서 category.name 추출
        const names = results.map((result) => result.category.name);
        setCategoryNames(names);
      } catch (error) {
        console.error('카테고리 이름 가져오기 실패:', error);
      }
    };

    fetchCategoryNames();
  }, []);

  // 💖 선택된 카테고리에 메모 저장하는 함수
  const saveMemoToCategory = async (selectedCategoryId: string, selectedCategoryName: string) => {
    try {
      // 제목이 없으면 현재 날짜로 자동 설정
      const now = new Date();
      const defaultTitle = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일`;

      const memoData = {
        title: memoTitle || defaultTitle, // 제목이 없으면 날짜로 설정
        content: memoContent, // 내용
        categoryId: selectedCategoryId, // 선택된 카테고리 ID
      };

      // 내용이 없으면 저장하지 않음
      if (!memoData.content) {
        console.log('❌ 본문 내용이 없어 저장되지 않았습니다.');
        setShowSaveMessage('❌ 메모 내용이 없어 저장되지 않았습니다.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/memos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ${token}',
        },
        body: JSON.stringify(memoData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ 메모 저장 성공:', result);
        setShowSaveMessage('✅ 메모가 성공적으로 저장되었습니다!');

        // 저장 성공 후 콜백 실행하여 UI 갱신
        onSave(selectedCategoryName);
        onClose(selectedCategoryName);
      } else {
        console.error('❌ 메모 저장 실패:', result);
        setShowSaveMessage(`❌ 저장 실패: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ 메모 저장 중 오류 발생:', error);
      setShowSaveMessage('❌ 메모 저장 중 오류가 발생했습니다.');
    }
  };

  // 마우스 이벤트
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

  // ✅ 효과음 재생 함수 추가
  const playSaveSound = () => {
    const audio = new Audio('/sounds/toaster_save.wav'); // 효과음 경로
    audio
      .play()
      .then(() => console.log('✅ 효과음 재생 성공'))
      .catch((error) => console.error('❌ 효과음 재생 실패:', error));
  };

  const handleMouseUp = () => {
    setIsDragging(false); // 드래그 종료
    if (activeSlice !== null) {
      const selectedCategory = categoryNames[activeSlice];

      console.log('📌 선택한 카테고리:', selectedCategory);

      // 카테고리 ID를 가져와 메모 저장
      saveMemoToCategory(String(activeSlice + 1), selectedCategory); // ID는 1부터 시작한다고 가정

      if (typeof onSave === 'function') {
        onSave(selectedCategory);
        playSaveSound(); // 효과음 재생 추가
      } else {
        console.error('onSave is not a function');
      }

      const now = new Date();
      const currentTitle =
        title ||
        `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(
          now.getDate(),
        ).padStart(2, '0')}일`;

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
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    setPosition((prev) => {
      const newX = Math.min(16, Math.max(-16, touch.clientX - window.innerWidth / 2));
      const newY = Math.min(16, Math.max(-16, touch.clientY - window.innerHeight / 2));

      // 최대치 16px까지 도달해야만 카테고리 선택 가능
      if (Math.abs(newX) === 16 || Math.abs(newY) === 16) {
        checkCollision(newX, newY);
      } else {
        setActiveSlice(null); // 최대치 미만 이동 시 카테고리 선택 해제
      }

      return { x: newX, y: newY };
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false); // 드래그 종료

    // 중앙 근방(오차 범위 16px)으로 돌아왔을 경우 저장 취소
    const isNearCenter = Math.abs(position.x) < 16 && Math.abs(position.y) < 16;

    if (isNearCenter || activeSlice === null) {
      console.log('저장을 취소했어요.');
      setShowSaveMessage('저장을 취소했어요.'); // 취소 메시지 표시
      setTimeout(() => {
        setShowSaveMessage(null); // 2초 후 메시지 사라지게 설정
      }, 2000);
      setPosition({ x: 0, y: 0 }); // 위치 초기화
      setActiveSlice(null); // 활성화된 카테고리 초기화
      onClose(''); // 모달 닫기 (카테고리 없이)
      return; // 저장 로직 실행되지 않도록 여기서 종료!
    }

    if (activeSlice !== null) {
      const selectedCategory = categoryNames[activeSlice];

      console.log({
        memoId,
        category: selectedCategory,
        title,
        content,
      });

      onSave(selectedCategory); // 선택된 카테고리 전달
      onClose(selectedCategory); // 선택된 카테고리 전달
    }

    setPosition({ x: 0, y: 0 });
    setActiveSlice(null);
  };

  const checkCollision = (x: number, y: number) => {
    const threshold = 16; // 16px 이상 이동해야 선택 가능
    let closestSlice: number | null = null;
    let minDistance = Infinity;

    const slices = [
      { id: 0, dx: 0, dy: -threshold }, // 상단 조각
      { id: 1, dx: threshold, dy: 0 }, // 오른쪽 조각
      { id: 2, dx: 0, dy: threshold }, // 하단 조각
      { id: 3, dx: -threshold, dy: 0 }, // 왼쪽 조각
    ];

    // 최대 이동 거리(16px) 도달했을 때만 계산
    if (Math.abs(x) < threshold && Math.abs(y) < threshold) {
      setActiveSlice(null);
      return;
    }

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

    // 일정 시간(2초) 동안 움직임이 없으면 힌트 표시
    inactivityTimeout = setTimeout(() => {
      setShowHint(true);
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
    <ModalOverlay>
      <Container
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 힌트 메시지 */}
        {showHint && (
          <Hint>
            <HintBold>꾹 누른 채로 이동</HintBold>
            해서 저장할 수 있어요.
          </Hint>
        )}

        {/* 카테고리(여기 더 간결하게 정리 가능할 것 같은데 나중에) */}
        <RadialMenu>
          {/* 상단 조각 */}
          <CategoryWrapper>
            <Category
              src={activeSlice === 0 ? selectedCategoryImage.src : categorySliceImage.src}
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
              src={activeSlice === 1 ? selectedCategoryImage.src : categorySliceImage.src}
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
              src={activeSlice === 2 ? selectedCategoryImage.src : categorySliceImage.src}
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
              src={activeSlice === 3 ? selectedCategoryImage.src : categorySliceImage.src}
              style={{
                transform: 'translateX(-81.3px) translateY(-0.4px) rotate(-90deg)',
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
    </ModalOverlay>
  );
};

export default SaveToast;

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
  user-select: none; /* 텍스트 선택 방지 */
  touch-action: none; /* 기본 터치 동작(스크롤, 확대 등) 방지 */
`;

export const Hint = styled.div`
  position: absolute;
  top: 148px;
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
  white-space: nowrap;
`;

export const HintBold = styled.span`
  font-weight: 800;
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
  font-weight: 600;
  color: white;
`;

const Toast = styled.img<{ x: number; y: number }>`
  position: absolute;
  top: calc(50% + ${({ y }) => y}px);
  left: calc(50% + ${({ x }) => x}px);
  transform: translate(-50%, -50%);
  cursor: grab;
  user-select: none;
  touch-action: none; /* 터치 기본 동작 방지 */
  transition: transform 0.2s ease;
  z-index: 10;
`;
