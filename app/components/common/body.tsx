/**
 * 파일명: body.tsx
 * 작성일: 2025-01-
 * 작성자: 이서연
 * 설명: body 컴포넌트
 */

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

interface BodyProps {
  deletedMemoId?: string; // ✅ 삭제된 메모 ID를 props로 받음
}

interface Memo {
  id: string;
  title: string;
  content: string;
}

export default function Body({ deletedMemoId }: BodyProps) {
  const [showPlus, setShowPlus] = useState(false);

  const [slides, setSlides] = useState<number[]>([1, 2, 3]);
  // const uniqueSlides = Array.from(new Set(slides));

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

  // ✅ "휴지통 아이콘" 클릭 시 모달 열기
  const handleModalToggle = (id: number) => {
    setSelectedSlide(id); // 현재 선택된 슬라이드 저장
    setShowModal(true);
  };

  // ✅ 삭제를 위해 가장 마지막 카테고리에 저장된 메모 데이터 불러오기
  const [memos, setMemos] = useState<Memo[]>([]); // ✅ MongoDB의 메모 리스트 저장
  const [lastCategoryId, setLastCategoryId] = useState<string | null>(null); // ✅ 가장 마지막 카테고리 ID 저장

  // const fetchMemos = async () => {
  //   try {
  //     // ----------------------✅ 사용자의 카테고리 목록 가져오기
  //     const userResponse = await fetch(`${API_BASE_URL}/api/user`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTA2ZWJjZmQ2ZTE4MjYwYTAzOTg3NyIsImVtYWlsIjoiZWhkYWxzNTM4N0BnbWFpbC5jb20iLCJpYXQiOjE3Mzg1NjczNjYsImV4cCI6MTc0MTE1OTM2Nn0.VTAEkhRa5iLkhNwu0ylqg_xoN4CzdBUS8SNNhr9hHVM`,
  //       },
  //     });

  //     if (!userResponse.ok) {
  //       throw new Error('❌ 사용자 데이터 불러오기 실패');
  //     }

  //     const userData = await userResponse.json();
  //     const categories = userData.categories;

  //     if (!categories || categories.length === 0) {
  //       console.error('❌ 사용자의 카테고리가 없습니다.');
  //       return;
  //     }

  //     // ✅ 가장 마지막 카테고리의 ID 찾기
  //     const lastCategoryId = categories[categories.length - 1];
  //     setLastCategoryId(lastCategoryId); // ✅ 상태 업데이트

  //     console.log(`📡 API 요청(GET): ${API_BASE_URL}/api/categories/${lastCategoryId}/memos`);

  //     // ✅ 마지막 카테고리에 속한 메모들 가져오기
  //     const response = await fetch(`${API_BASE_URL}/api/categories/${lastCategoryId}/memos`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTA2ZWJjZmQ2ZTE4MjYwYTAzOTg3NyIsImVtYWlsIjoiZWhkYWxzNTM4N0BnbWFpbC5jb20iLCJpYXQiOjE3Mzg1NjczNjYsImV4cCI6MTc0MTE1OTM2Nn0.VTAEkhRa5iLkhNwu0ylqg_xoN4CzdBUS8SNNhr9hHVM`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error('❌ 메모 불러오기 실패');
  //     }

  //     const data = await response.json();
  //     setMemos(data.notes.reverse()); // ✅ 최신 메모부터 정렬하여 저장
  //   } catch (error) {
  //     console.error('❌ 메모 불러오기 오류:', error);
  //   }
  // };

  // ✅ 컴포넌트가 처음 렌더링될 때 메모 불러오기
  // useEffect(() => {
  //   fetchMemos();
  // }, []);
  //----------------------

  // ✅ "먹어버리기" 버튼 클릭 시 API 호출하여 토스트 삭제
  const handleDeleteToast = async () => {
    if (selectedSlide === null || !lastCategoryId) return;
    setLoading(true);

    // ✅ selectedSlide 값으로 memos 리스트에서 해당 `memoId` 찾기
    const memoToDelete = memos.find((memo, index) => index === selectedSlide);

    if (!memoToDelete) {
      console.error('❌ 삭제할 메모를 찾을 수 없습니다.');
      setLoading(false);
      return;
    }

    try {
      console.log(`📡 API 요청(DELETE): ${API_BASE_URL}/api/memos/${selectedSlide}`);

      const response = await fetch(`${API_BASE_URL}/api/memos/${memoToDelete._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTA2ZWJjZmQ2ZTE4MjYwYTAzOTg3NyIsImVtYWlsIjoiZWhkYWxzNTM4N0BnbWFpbC5jb20iLCJpYXQiOjE3Mzg1NjczNjYsImV4cCI6MTc0MTE1OTM2Nn0.VTAEkhRa5iLkhNwu0ylqg_xoN4CzdBUS8SNNhr9hHVM`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ 토스트 삭제 성공:', data.message);

        // ✅ 삭제된 메모를 상태에서 제거
        setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== memoToDelete.id));

        setSlides((prevSlides) => {
          let newSlides = prevSlides.filter((slide) => slide !== selectedSlide);

          if (newSlides.length === 0) {
            newSlides = [selectedSlide + 1]; // ✅ 새 토스트 추가
          }

          return newSlides;
        });

        setShowDeleteMessage(true);
      } else {
        console.error('❌ 토스트 삭제 실패:', data.message);
        setShowDeleteErrorMessage(true);
      }
    } catch (error) {
      console.error('❌ 삭제 요청 오류:', error);
      setShowDeleteErrorMessage(true);
    } finally {
      setLoading(false);
      setShowModal(false);
      setSwiperKey((prev) => prev + 1);
    }
  };

  //-------------------------------🍞새로운 토스트 추가 로직 구현 완료🍞

  // ✅ 새로운 토스트 추가 모션 로직
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSwiperActive) return;
    setDragging(true);
    offsetXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || isSwiperActive) return;
    const deltaX = e.touches[0].clientX - offsetXRef.current;
    setShowPlus(deltaX > 240);
    if (bodyRef.current) {
      bodyRef.current.style.transform = `translateX(${Math.max(0, deltaX)}px)`;
    }
  };

  // ✅ "오른쪽으로 드래그" 시 새로운 메모 생성
  const handleTouchEnd = async () => {
    if (!showPlus) return;
    setShowPlus(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/memos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTA2ZWJjZmQ2ZTE4MjYwYTAzOTg3NyIsImVtYWlsIjoiZWhkYWxzNTM4N0BnbWFpbC5jb20iLCJpYXQiOjE3Mzg1NjczNjYsImV4cCI6MTc0MTE1OTM2Nn0.VTAEkhRa5iLkhNwu0ylqg_xoN4CzdBUS8SNNhr9hHVM`,
        },
        body: JSON.stringify({
          title: new Date().toISOString().split('T')[0], // ✅ 오늘 날짜로 제목 설정
          content: '새로운 영감을 적어볼까요?', // ✅ 기본 내용 설정
        }),
      });

      console.log(`📩 응답 상태 코드: ${response.status}`);

      const data = await response.json();

      if (response.ok) {
        console.log('✅ 새 메모 생성 성공:', data);

        // ✅ `memos` 상태 업데이트 (새 메모 추가)
        setMemos((prevMemos) => [data.memo, ...prevMemos]);

        // ✅ `slides` 상태 업데이트 (새 메모의 ID 추가)
        setSlides((prevSlides) => {
          const newSlides = [data.memo.id, ...prevSlides];
          return newSlides.length > 3 ? newSlides.slice(0, 3) : newSlides;
        });
        // ✅ 최신 메모 리스트 갱신 (약간의 지연 후 실행)
        setTimeout(() => fetchMemos(), 500);
        setShowToastMessage(true);
      } else {
        console.error('❌ 메모 생성 실패:', data.message);
      }
    } catch (error) {
      console.error('❌ 메모 생성 요청 오류:', error);
    } finally {
      setShowPlus(false);
      setDragging(false);
      if (bodyRef.current) {
        bodyRef.current.style.transition = 'transform 0.3s ease-out';
        bodyRef.current.style.transform = 'translateX(0px)';
      }
      setTimeout(() => bodyRef.current && (bodyRef.current.style.transition = ''), 300);
    }
  };

  // ✅ 백엔드에서 최신 메모 가져오기
  const fetchMemos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/4/memos`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTA2ZWJjZmQ2ZTE4MjYwYTAzOTg3NyIsImVtYWlsIjoiZWhkYWxzNTM4N0BnbWFpbC5jb20iLCJpYXQiOjE3Mzg1NjczNjYsImV4cCI6MTc0MTE1OTM2Nn0.VTAEkhRa5iLkhNwu0ylqg_xoN4CzdBUS8SNNhr9hHVM`,
        },
      });

      if (!response.ok) {
        throw new Error('❌ 메모 불러오기 실패');
      }

      const data = await response.json();
      setMemos(data.notes); // ✅ 최신 메모 상태 업데이트
    } catch (error) {
      console.error('❌ 메모 불러오기 오류:', error);
    }
  };
  //-------------------------------🍞새로운 토스트 추가 로직 구현 완료🍞

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
        key={swiperKey}
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
        onSlideChange={(swiper) => {
          setSelectedSlide(memos[swiper.realIndex]?.id || null); // ✅ 현재 선택된 슬라이드 ID 업데이트
        }}
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
            <StyledBasicToast title="기본 제목(날짜)" content="새로운 영감을 적어볼까요?" />{' '}
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
        // onConfirm={handleDeleteToast}
        onClick={handleDeleteToast}
        memoID={memos.find((memo, index) => index === selectedSlide)?._id || null}
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
