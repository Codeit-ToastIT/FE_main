/**
 * 파일명: body.tsx
 * 작성일: 2025-01-
 * 작성자: 이서연
 * 설명: body 컴포넌트
 */

// 💖 표시된 부분 SaveToast로 활성화된 메모 id 전달을 위해 수정한 부분
'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { EffectCoverflow } from 'swiper/modules';

import iconTrash from '../../assets/icons/icon_trash.svg';
import BasicToast from './BasicToast';
import DeleteModal from './DeleteModal';

import { API_BASE_URL } from '../../api/api';
// import { AUTH_TOKEN } from '../../api/api';
import { useAuth } from '../../api/AuthContext';

interface BodyProps {
  deletedMemoId?: string; // ✅ 삭제된 메모 ID를 props로 받음
  // 💖 활성 메모 id를 상위로 전달할 콜백 prop 추가
  onActiveMemoChange?: (id: string) => void;
}
interface Memo {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 💖 onActiveMemoChange 추가
export default function Body({ deletedMemoId, onActiveMemoChange }: BodyProps) {
  const [memos, setMemos] = useState<Memo[]>([]); // ✅ MongoDB의 메모 리스트 저장

  const [showPlus, setShowPlus] = useState(false);

  const [slides, setSlides] = useState<number[]>([1, 2, 3]);
  const [selectedSlide, setSelectedSlide] = useState<number | null>(slides[0]);
  const [showModal, setShowModal] = useState(false);
  const [swiperKey, setSwiperKey] = useState(0); // ✅ Swiper 리렌더링을 위한 Key 추가

  const [showToastMessage, setShowToastMessage] = useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [showDeleteErrorMessage, setShowDeleteErrorMessage] = useState(false); // ❌ 삭제 실패 메시지 추가

  const [isSwiperActive, setIsSwiperActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dragging, setDragging] = useState(false);
  const offsetXRef = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMemos();
  }, []);

  useEffect(() => {
    if (showToastMessage) {
      const timer = setTimeout(() => setShowToastMessage(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToastMessage]);

  useEffect(() => {
    if (showDeleteMessage) {
      const timer = setTimeout(() => setShowDeleteMessage(false), 2000); // ✅ 2초 후 메시지 숨김
      return () => clearTimeout(timer);
    }
  }, [showDeleteMessage]);

  useEffect(() => {
    if (showDeleteErrorMessage) {
      const timer = setTimeout(() => setShowDeleteErrorMessage(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showDeleteErrorMessage]);

  // ✅ editing 화면에서 삭제버튼 클릭 시 삭제 확인하는 로직(임시)
  useEffect(() => {
    // ✅ localStorage에서 삭제된 메모 ID 가져오기
    const memoId = localStorage.getItem('deletedMemoId');
    if (memoId) {
      setSlides((prevSlides) => prevSlides.filter((slide) => slide.toString() !== memoId));
      localStorage.removeItem('deletedMemoId'); // ✅ 삭제 후 상태 초기화
    }

    // ✅ 삭제 실패 상태 확인
    if (localStorage.getItem('deleteError') === 'true') {
      setShowDeleteErrorMessage(true);
      localStorage.removeItem('deleteError'); // ✅ 삭제 후 상태 초기화
    }
  }, []);

  useEffect(() => {
    const storedMemos = JSON.parse(localStorage.getItem('memos') || '[]');

    setSlides((prevSlides) => {
      const updatedSlides = [...storedMemos, ...prevSlides]; // ✅ 기존 값 유지
      return updatedSlides.length > 3 ? updatedSlides.slice(0, 3) : updatedSlides; // ✅ 최대 3개 유지
    });
  }, []);

  //Authorization token 불러오는 로직 구현
  const { token } = useAuth();

  //----------------

  const memoToEditing = memos.find((_, index) => index + 1 === selectedSlide);

  //-------------------------------🍞토스트 삭제 로직 구현 완료🍞-------------------------------

  // ✅ "휴지통 아이콘" 클릭 시 모달 열기
  const handleModalToggle = (id: number) => {
    setSelectedSlide(id); // 현재 선택된 슬라이드 저장
    setShowModal(true);
  };

  // ✅ "먹어버리기" 버튼 클릭 시 API 호출하여 토스트 삭제
  const handleDeleteToast = async (): Promise<boolean> => {
    if (selectedSlide === null) return false;
    setLoading(true);

    // ✅ selectedSlide 값으로 memos 리스트에서 해당 `memoId` 찾기 (index - 1 적용)
    const memoToDelete = memos.find((_, index) => index + 1 === selectedSlide);

    if (!memoToDelete || !memoToDelete.id) {
      console.error('❌ 삭제할 메모를 찾을 수 없습니다.');
      setLoading(false);
      setShowModal(false);
      return false;
    }

    try {
      console.log(`📡 API 요청(DELETE): ${API_BASE_URL}/api/memos/${memoToDelete.id}`);

      const response = await fetch(`${API_BASE_URL}/api/memos/${memoToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ 토스트 삭제 성공:', data.message);

        // ✅ 삭제된 메모를 상태에서 제거
        setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== memoToDelete.id));

        // ✅ 삭제 후 최신 메모 목록 가져오기
        await fetchMemos();

        setSlides((prevSlides) => {
          let newSlides = prevSlides.filter((slide) => slide !== selectedSlide);

          if (newSlides.length === 0) {
            newSlides = [selectedSlide + 1]; // ✅ 새 토스트 추가
          }

          setShowDeleteMessage(true);
          return newSlides;
        });

        return true;
      } else {
        console.error('❌ 토스트 삭제 실패:', data.message);
        setShowDeleteErrorMessage(true);
        return false;
      }
    } catch (error) {
      console.error('❌ 삭제 요청 오류:', error);
      setShowDeleteErrorMessage(true);
      return false;
    } finally {
      setLoading(false);
      setShowModal(false);
      setSwiperKey((prev) => prev + 1);
    }
  };

  //-------------------------------🍞토스트 삭제 로직 구현 완료🍞-------------------------------

  //-------------------------------🍞새로운 토스트 추가 로직 구현 완료🍞-------------------------------

  // ✅ 백엔드에서 카테고리 지정 안된 최신 메모(가장 마지막 카테고리) 가져오기
  const fetchMemos = async () => {
    try {
      const lastCategoryId = '67a06ebcfd6e18260a03987d'; // ✅ 마지막 카테고리 ID 가져오기

      console.log(`🔗 요청 URL: ${API_BASE_URL}/api/categories/${lastCategoryId}/memos`);

      const response = await fetch(`${API_BASE_URL}/api/categories/${lastCategoryId}/memos`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`📩 응답 상태 코드: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`❌ 서버 응답 오류: ${errorData}`);
        throw new Error('❌ 메모 불러오기 실패');
      }

      const data = await response.json();
      console.log('✅ 메모 가져오기 성공:', data);

      if (data.notes.length === 0) {
        console.log('⚠️ 불러온 메모가 없음 → 기본 메모 자동 생성');

        // ✅ 기본 메모 자동 생성 (POST 요청)
        await createDefaultMemo();
      } else {
        // ✅ 최신 메모 3개만 저장
        setMemos(data.notes.slice(0, 3));
      }
    } catch (error) {
      console.error('❌ 메모 불러오기 오류:', error);
    }
  };

  const createDefaultMemo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/memos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: new Date().toISOString().split('T')[0], // ✅ 오늘 날짜로 제목 설정
          content: '새로운 영감을 적어볼까요?', // ✅ 기본 내용 설정
        }),
      });

      console.log(`📩 기본 메모 생성 응답 상태 코드: ${response.status}`);

      const data = await response.json();

      if (response.ok) {
        console.log('✅ 기본 메모 생성 성공:', data);

        // ✅ 생성된 기본 메모를 상태에 저장
        setMemos([data.memo]);
        fetchMemos();
      } else {
        console.error('❌ 기본 메모 생성 실패:', data.message);
      }
    } catch (error) {
      console.error('❌ 기본 메모 생성 요청 오류:', error);
    }
  };

  // ✅ 새로운 토스트 추가 모션 로직
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    offsetXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;

    const deltaX = e.touches[0].clientX - offsetXRef.current;

    // ✅ Swiper에서 발생한 터치 이벤트인지 확인하고 처리 방지
    if (isSwiperActive) return;

    // ✅ 드래그 거리가 50px 이상이어야 실제로 "드래그 중" 상태로 인식
    if (Math.abs(deltaX) > 50) {
      setDragging(true);
    }
    setShowPlus(deltaX > 240);

    if (bodyRef.current) {
      bodyRef.current.style.transform = `translateX(${Math.max(0, deltaX)}px)`;
    }
  };

  // ✅ "오른쪽으로 드래그" 시 새로운 메모 생성
  const handleTouchEnd = async () => {
    // ✅ Swiper에서 발생한 터치 이벤트거나 충분히 드래그되지 않았다면 실행 안 함.
    if (!showPlus || isSwiperActive || !dragging) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/memos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: new Date().toISOString().split('T')[0], // ✅ 오늘 날짜로 제목 설정
          content: '새로운 영감을 적어볼까요?', // ✅ 기본 내용 설정
        }),
      });

      //✅ 확인용 콘솔 코드
      console.log(`📩 응답 상태 코드: ${response.status}`);

      const data = await response.json();

      if (response.ok) {
        console.log('✅ 새 메모 생성 성공:', data);

        // ✅ data.memo가 정상적으로 존재하는지 확인 후 상태 업데이트
        if (data.memo) {
          setMemos((prevMemos) => {
            const newMemos = [data.memo, ...prevMemos].slice(0, 3);
            return newMemos;
          });

          setSlides((prevSlides) => {
            const newSlides = [data.memo.id, ...prevSlides];
            return newSlides.length > 3 ? newSlides.slice(0, 3) : newSlides;
          });

          setTimeout(() => fetchMemos(), 500);
          setShowToastMessage(true);
        }
      } else {
        console.error('❌ 메모 생성 실패:', data.message);
      }
    } catch (error) {
      console.error('❌ 메모 생성 요청 오류:', error);
    } finally {
      setDragging(false);
      setShowPlus(false); // ✅ 터치 종료 후 초기화
      if (bodyRef.current) {
        bodyRef.current.style.transition = 'transform 0.3s ease-out';
        bodyRef.current.style.transform = 'translateX(0px)';
      }
      setTimeout(() => bodyRef.current && (bodyRef.current.style.transition = ''), 300);
    }
  };

  useEffect(() => {
    const bodyElement = bodyRef.current;
    if (!bodyElement) return;

    const handleNativeTouchMove = (e: TouchEvent) => {
      if (dragging) {
        e.preventDefault(); // ✅ 이제 필요 없을 수도 있음 → 제거 가능
      }
    };

    bodyElement.addEventListener('touchmove', handleNativeTouchMove);

    return () => {
      bodyElement.removeEventListener('touchmove', handleNativeTouchMove);
    };
  }, [dragging]);

  // 💖 Swiper 슬라이드 변경 시 활성 메모 id 전달
  const handleSlideChange = (swiper: any) => {
    const activeId = uniqueSlides[swiper.realIndex];
    setSelectedSlide(activeId);
    if (onActiveMemoChange) {
      onActiveMemoChange(activeId.toString());
    }
  };

  //-------------------------------🍞새로운 토스트 추가 로직 구현 완료🍞-------------------------------

  return (
    <Container
      ref={bodyRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <IconTrash
        src={iconTrash}
        alt="Trash"
        onClick={() => selectedSlide !== null && handleModalToggle(selectedSlide)} // ✅ 현재 선택된 슬라이드 삭제
        priority
      />

      <Swiper
        key="fixed-swiper"
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={Math.min(3, memos.length || 1)} // ✅ 데이터가 없을 때에도 최소 1개를 보여줌
        coverflowEffect={{
          rotate: 0,
          stretch: 240,
          depth: 20,
          modifier: 0.5,
          slideShadows: false,
        }}
        modules={[EffectCoverflow]}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        onSlideChange={handleSlideChange} // 💖 활성 슬라이드 변경 시 콜백 호출
        onTouchStart={() => setIsSwiperActive(true)}
        onTouchEnd={() => setIsSwiperActive(false)}
      >
        {memos.length > 0 ? (
          memos.map((memo) => (
            <StyledSwiperSlide key={memo.id}>
              <StyledBasicToast toastid={memo.id} title={memo.title} content={memo.content} />
            </StyledSwiperSlide>
          ))
        ) : (
          <StyledSwiperSlide>
            <StyledBasicToast
              title={new Date().toISOString().split('T')[0]}
              content="새로운 영감을 적어볼까요?"
            />{' '}
            {/* 기본값 */}
          </StyledSwiperSlide>
        )}
      </Swiper>

      {showToastMessage && <ToastMessage>새 토스트를 추가했어요.</ToastMessage>}
      {showDeleteMessage && <ToastMessage>토스트 하나를 버렸어요.</ToastMessage>}
      {showDeleteErrorMessage && <ErrorMessageBox>삭제를 실패하였습니다.</ErrorMessageBox>}

      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onClick={handleDeleteToast}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 40px 0 0 40px;
  height: 80vh;
  position: relative;
  overflow: hidden;
  touch-action: none;
`;

const IconTrash = styled(Image)`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 40px;
  background: #171612;
`;

const StyledSwiperSlide = styled(SwiperSlide)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 360px;
`;

const StyledBasicToast = styled(BasicToast)`
  cursor: pointer;
  width: 296px;
  height: 320px;
`;

const ToastMessage = styled.div`
  position: absolute;
  bottom: 48px;
  left: 105px;
  display: inline-flex;
  padding: 12px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 40px;
  background: rgba(23, 22, 18, 0.8);
  color: var(--ivory, #e5dcca);
  text-align: center;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`;

const ErrorMessageBox = styled(ToastMessage)`
  background: rgba(80, 15, 15, 0.8);
`;
