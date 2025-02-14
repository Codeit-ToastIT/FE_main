/**
 * 파일명: body.tsx
 * 작성일: 2025-02-06
 * 작성자: 이서연
 * 설명: body 컴포넌트
 */

// 💖 표시된 부분 SaveToast로 활성화된 메모 id 전달을 위해 수정한 부분
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper'; // Swiper 타입 가져오기
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { EffectCoverflow } from 'swiper/modules';

import iconTrash from '../../assets/icons/icon_trash.svg';
import BasicToast from './BasicToast';
import DeleteModal from './DeleteModal';

import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

interface BodyProps {
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
  toastNumber: number;
}

// 💖 onActiveMemoChange 추가
export default function Body({ onActiveMemoChange }: BodyProps) {
  const { token, userId } = useAuth();

  const [memos, setMemos] = useState<Memo[]>([]); // ✅ MongoDB의 메모 리스트 저장

  const [showPlus, setShowPlus] = useState(false);

  const [_slides, setSlides] = useState<string[]>([]); // ✅ 초기값을 빈 배열로 설정

  useEffect(() => {
    if (memos.length > 0) {
      setSlides(memos.slice(0, 3).map((memo) => String(memo.id))); // ✅ 첫 3개의 메모 id를 slides에 저장
    }
  }, [memos]); // ✅ memos가 변경될 때만 실행

  const [selectedSlide, setSelectedSlide] = useState<string | null>('');
  const [showModal, setShowModal] = useState(false);
  const [_swiperKey, setSwiperKey] = useState(0); // ✅ Swiper 리렌더링을 위한 Key 추가

  const [showToastMessage, setShowToastMessage] = useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [showDeleteErrorMessage, setShowDeleteErrorMessage] = useState(false); // ❌ 삭제 실패 메시지 추가

  const [isSwiperActive, setIsSwiperActive] = useState(false);
  const [_loading, setLoading] = useState(false);

  const [dragging, setDragging] = useState(false);
  const offsetXRef = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showToastMessage) {
      const timer = setTimeout(() => setShowToastMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToastMessage]);

  useEffect(() => {
    if (showDeleteMessage) {
      const timer = setTimeout(() => setShowDeleteMessage(false), 3000); // ✅ 2초 후 메시지 숨김
      return () => clearTimeout(timer);
    }
  }, [showDeleteMessage]);

  useEffect(() => {
    if (showDeleteErrorMessage) {
      const timer = setTimeout(() => setShowDeleteErrorMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showDeleteErrorMessage]);

  // ✅ editing 화면에서 삭제버튼 클릭 시 삭제 확인하는 로직 localStorage에서 삭제된 메모 ID 확인 후 필터링
  useEffect(() => {
    const deletedMemoId = localStorage.getItem('deletedMemoId');
    const deleteSuccess = localStorage.getItem('deleteSuccess');

    if (deletedMemoId) {
      setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== deletedMemoId));

      // ✅ 삭제 성공 여부에 따라 메시지 표시
      if (deleteSuccess === 'true') {
        setShowDeleteMessage(true);
        setTimeout(() => setShowDeleteMessage(false), 2000);
      } else if (deleteSuccess === 'false') {
        setShowDeleteErrorMessage(true);
        setTimeout(() => setShowDeleteErrorMessage(false), 2000);
      }

      // ✅ localStorage 초기화
      localStorage.removeItem('deletedMemoId');
      localStorage.removeItem('deleteSuccess');
    }
  }, []);

  //-------------------------------🍞토스트 삭제 로직 구현 완료🍞-------------------------------

  // ✅ "휴지통 아이콘" 클릭 시 모달 열기
  const [selectedToastNumber, setSelectedToastNumber] = useState(1);

  const handleModalToggle = (id: string) => {
    setSelectedSlide(id); // 현재 선택된 슬라이드 저장
    const memoToDelete = memos.find((memo) => memo.id === id);
    if (!memoToDelete) return;
    setSelectedToastNumber(memoToDelete.toastNumber); // ✅ 선택된 토스트의 toastNumber 저장

    console.log('📝 선택된 슬라이드 ID:', id); // ✅ 선택된 ID 확인
    console.log('📜 현재 memos 상태:', memos);
    setShowModal(true);
  };

  // ✅ "먹어버리기" 버튼 클릭 시 API 호출하여 토스트 삭제
  const handleDeleteToast = async (): Promise<boolean> => {
    if (selectedSlide === null) return false;
    setLoading(true);

    // ✅ 현재 선택된 슬라이드에서 메모 ID 찾기
    const memoToDelete = memos.find((memo) => memo.id === String(selectedSlide));

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

        // ✅ 상태에서 삭제된 메모 제거
        setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== memoToDelete.id));

        // ✅ 슬라이드 상태 업데이트
        setSlides((prevSlides) => {
          const newSlides = prevSlides.filter((slide) => slide !== selectedSlide);
          setSwiperKey((prev) => prev + 1); // ✅ Swiper 강제 리렌더링

          // ✅ 삭제 후 슬라이드가 비어 있다면 새로운 슬라이드 추가
          return newSlides.length > 0 ? newSlides : [selectedSlide + 1];
        });

        setShowDeleteMessage(true);

        // ✅ 최신 메모 목록 다시 불러오기
        await fetchMemos(lastCategoryId); // ✅ 최신 메모 다시 불러오기

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
    }
  };

  //----------------------------🍞토스트 삭제 로직🍞------------------------------

  //-------------------🍞새로운 토스트 추가 로직🍞(터치->마우스 이벤트 순)--------------

  const [lastCategoryId, setLastCategoryId] = useState('');
  const fetchMemosRef = useRef<((categoryId: string) => Promise<void>) | null>(null);

  // 🐥 특정 카테고리(마지막 카테고리)에 기본 메모 생성
  const createDefaultMemo = useCallback(
    async (categoryId: string) => {
      try {
        const url = `${API_BASE_URL}/api/memos`;
        console.log(`🐥 특정 카테고리에 기본 메모 생성 URL: ${url}`);

        const response = await axios.post(
          url,
          {
            title: '',
            content: '',
            categoryId, // 🐥 특정 카테고리에 저장
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log(`🐥 메모 생성 응답 상태: ${response.status}`);
        if (response.status === 201 || response.status === 200) {
          console.log('🐥 메모 생성 성공:', response.data);
          setMemos((prevMemos) => [response.data.memo, ...prevMemos].slice(0, 3));

          // 🐥 fetchMemos를 ref에서 가져와 호출
          if (fetchMemosRef.current) {
            fetchMemosRef.current(categoryId);
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('🐥 메모 생성 실패:', error.response?.data?.message || error.message);
        } else {
          console.error('🐥 메모 생성 요청 오류:', error);
        }
      }
    },
    [token],
  );

  // 🐥 특정 카테고리(마지막 카테고리)의 메모 가져오기
  const fetchMemos = useCallback(
    async (categoryId: string) => {
      try {
        const url = `${API_BASE_URL}/api/categories/${categoryId}/memos`;
        console.log(`🐥 특정 카테고리의 메모 가져오기 요청 URL: ${url}`);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(`🐥 응답 상태 코드: ${response.status}`);

        const data = response.data;
        console.log('🐥 마지막 카테고리 메모 가져오기 성공:', data);

        if (data.notes.length === 0) {
          console.log('⚠️ 불러온 메모가 없으므로 기본 메모 자동 생성 실행');
          await createDefaultMemo(categoryId); // 🐥 기본 메모 생성 함수 호출
        } else {
          setMemos(data.notes.slice(0, 3));
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(`🐥 서버 응답 오류: ${error.response?.data || error.message}`);
        } else {
          console.error('🐥 메모 불러오기 오류:', error);
        }
      }
    },
    [token, createDefaultMemo],
  );

  // 🐥 useEffect에서 fetchMemosRef에 fetchMemos 할당
  useEffect(() => {
    fetchMemosRef.current = fetchMemos;
  }, [fetchMemos]);

  // 🐥 카테고리 목록 가져오기
  const fetchCategories = useCallback(async () => {
    try {
      const url = `${API_BASE_URL}/api/categories/${userId}`;
      console.log(`🐥 카테고리 목록 가져오기 요청 URL: ${url}`);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`🐥 응답 상태 코드: ${response.status}`);

      const data = response.data;
      console.log('🐥 메모 카테고리 목록 가져오기 성공:', data);

      const lastCategoryId = data.categories[4]?.id;
      if (lastCategoryId) {
        setLastCategoryId(lastCategoryId);
        fetchMemos(lastCategoryId); // ✅ 4번 인덱스 카테고리 ID로 메모 가져오기 실행
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`🐥 서버 응답 오류: ${error.response?.data || error.message}`);
      } else {
        console.error('🐥 메모 카테고리 목록 불러오기 오류:', error);
      }
    }
  }, [userId, token, fetchMemos]);

  // 🐥 useEffect에서 카테고리 가져오기 실행
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 🐥 새로운 토스트 추가 모션 로직
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    offsetXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    e.stopPropagation(); // 🐥 Swiper에서 발생한 터치 이벤트 방지

    const deltaX = e.touches[0].clientX - offsetXRef.current;

    // ✅ Swiper에서 발생한 터치 이벤트인지 확인하고 처리 방지
    if (isSwiperActive) return;

    // ✅ 드래그 거리가 50px 이상이어야 실제로 "드래그 중" 상태로 인식
    if (Math.abs(deltaX) > 150) {
      setDragging(true);
    }
    setShowPlus(deltaX > 200);

    if (bodyRef.current) {
      // ✅ 최대 드래그 거리 230px 제한
      bodyRef.current.style.transform = `translateX(${Math.min(230, Math.max(0, deltaX))}px)`;
    }
  };

  // ✅ 새로운 메모 추가 (터치 이벤트)
  const handleTouchEnd = async () => {
    if (!showPlus || isSwiperActive || !dragging) return;

    try {
      const url = `${API_BASE_URL}/api/memos`;
      console.log(`🐥 새로운 메모 추가 (터치 이벤트) 요청 URL: ${url}`);

      const response = await axios.post(
        url,
        {
          title: '',
          content: '',
          categoryId: lastCategoryId, // ✅ 가장 마지막 카테고리에 저장
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(`🐥 응답 상태 코드: ${response.status}`);

      if (response.status === 201 || response.status === 200) {
        console.log('🐥 새 메모 생성 성공:', response.data);
        setMemos((prevMemos) => [response.data.memo, ...prevMemos].slice(0, 3));
        fetchMemos(lastCategoryId); // 🐥 최신 메모(마지막 카테고리의) 다시 가져오기
        setShowToastMessage(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('🐥 메모 생성 실패:', error.response?.data?.message || error.message);
      } else {
        console.error('🐥 메모 생성 요청 오류:', error);
      }
    } finally {
      setDragging(false);
      setShowPlus(false);
      if (bodyRef.current) {
        bodyRef.current.style.transition = 'transform 0.5s ease-out';
        bodyRef.current.style.transform = 'translateX(0px)';
      }
      setTimeout(() => {
        if (bodyRef.current) {
          bodyRef.current.style.transition = '';
        }
      }, 250);
    }
  };

  // 🐥 새로운 토스트 추가 모션 로직 (마우스 이벤트)
  const isClickRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    // 🐥 휴지통 버튼을 클릭했을 때 드래그 방지
    if ((e.target as HTMLElement).closest('.no-drag')) {
      setDragging(false);
      return;
    }

    setDragging(true);
    isClickRef.current = true; // 클릭으로 간주
    offsetXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    e.preventDefault();
    e.stopPropagation();

    const deltaX = e.clientX - offsetXRef.current;

    if (isSwiperActive) return;

    // 🐥 드래그 거리가 100px 이상이면 클릭이 아닌 드래그로 간주
    if (Math.abs(deltaX) > 100) {
      isClickRef.current = false;
    }

    // 🐥 드래그 거리가 100px 이상이어야 실제로 "드래그 중" 상태로 인식
    if (Math.abs(deltaX) > 100) {
      setDragging(true);
    } else {
      if (!dragging) return; // 아직 드래그 인식 전이면 위치 이동 안 함
    }
    setShowPlus(deltaX > 200);

    if (bodyRef.current) {
      requestAnimationFrame(() => {
        // 🐥 최대 드래그 거리 230px 제한
        bodyRef.current!.style.transform = `translateX(${Math.min(230, Math.max(0, deltaX))}px)`;
      });
    }
  };

  // 🐥 "오른쪽으로 드래그" 시 새로운 메모 생성 (마우스 이벤트)
  const handleMouseUp = async () => {
    if (isClickRef.current) {
      // 🐥 클릭이라면 드래그 처리하지 않음
      setDragging(false);
      return;
    }

    if (!showPlus || isSwiperActive || !dragging) return;

    try {
      const url = `${API_BASE_URL}/api/memos`;
      console.log(`🐥 새로운 메모 추가 (마우스 이벤트) 요청 URL: ${url}`);

      const response = await axios.post(
        url,
        {
          title: '',
          content: '',
          categoryId: lastCategoryId, // 🐥 마지막 카테고리에 저장
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(`🐥 응답 상태 코드: ${response.status}`);

      if (response.status === 201 || response.status === 200) {
        console.log('🐥 새 메모 생성 성공:', response.data);

        if (response.data.memo) {
          // 🐥 상태 업데이트를 먼저 수행한 후 fetchMemos 실행
          setMemos((prevMemos) => [response.data.memo, ...prevMemos].slice(0, 3));
          setSlides((prevSlides) => [response.data.memo.id, ...prevSlides].slice(0, 3));

          fetchMemos(lastCategoryId); // 🐥 최신 메모(마지막 카테고리의) 다시 가져오기
          setShowToastMessage(true);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('🐥 메모 생성 실패:', error.response?.data?.message || error.message);
      } else {
        console.error('🐥 메모 생성 요청 오류:', error);
      }
    } finally {
      setDragging(false);
      setShowPlus(false);
      if (bodyRef.current) {
        bodyRef.current.style.transition = 'transform 0.5s ease-out';
        bodyRef.current.style.transform = 'translateX(0px)';
      }
      setTimeout(() => {
        if (bodyRef.current) {
          bodyRef.current.style.transition = '';
        }
      }, 250);
    }
  };

  // 💖 Swiper 슬라이드 변경 시 활성 메모 id 전달 (02/08 초기 렌더링 메모 id 전달을 위해 수정된 부분)
  const handleSlideChange = (swiper: SwiperClass) => {
    if (!memos.length) return; // memos가 비어있으면 실행하지 않음

    const activeMemo = memos[swiper.realIndex] || memos[0]; // 초기 렌더링 시 첫 번째 메모 사용
    console.log('📌 활성화된 메모:', activeMemo);

    if (activeMemo) {
      setSelectedSlide(activeMemo.id); // 활성화된 메모 ID 설정
      if (onActiveMemoChange) {
        onActiveMemoChange(activeMemo.id); // 활성화된 메모 ID 상위로 전달
      }
    }
  };

  // 초기 렌더링 시에도 활성 메모 ID 전달
  useEffect(() => {
    if (memos.length > 0) {
      console.log('📌 초기 렌더링 시 활성화된 메모:', memos[0]);
      setSelectedSlide(memos[0].id); // 첫 번째 메모를 활성화
      if (onActiveMemoChange) {
        onActiveMemoChange(memos[0].id);
      }
    }
  }, [memos]); // memos가 설정될 때 실행

  //-------------------------------🍞새로운 토스트 추가 로직 구현 완료🍞-------------------------------

  return (
    <Container
      ref={bodyRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <IconTrash
        className="no-drag"
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
          stretch: -30,
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
              <StyledBasicToast
                toastid={memo.id}
                title={memo.title}
                content={memo.content}
                toastnumber={memo.toastNumber}
              />
            </StyledSwiperSlide>
          ))
        ) : (
          <StyledSwiperSlide>
            <StyledBasicToast title="" content="새로운 토스트를 작성해볼까요?" toastnumber={1} />{' '}
            {/* 기본값 */}
          </StyledSwiperSlide>
        )}
      </Swiper>

      {showToastMessage && <ToastMessage>새 토스트를 추가했어요.</ToastMessage>}
      {showDeleteMessage && <ToastMessage>토스트 하나를 먹었어요.</ToastMessage>}
      {showDeleteErrorMessage && <ErrorMessageBox>삭제를 실패하였습니다.</ErrorMessageBox>}

      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onClick={handleDeleteToast}
        toastNumber={selectedToastNumber}
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
  height: 92.2dvh;
  position: relative;
  overflow: hidden;
  touch-action: none; /* ✅ 터치 이벤트를 스크롤이 아닌 드래그로 인식하도록 설정 */
  user-select: none; /* ✅ 텍스트 선택 방지 */
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
  user-select: none; /* ✅ 텍스트 선택 방지 */
`;

const StyledBasicToast = styled(BasicToast)`
  cursor: pointer;
  width: 296px;
  height: 320px;
  user-select: none; /* ✅ 텍스트 선택 방지 */
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
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  user-select: none; /* ✅ 텍스트 선택 방지 */

  animation: fadeinout 3s cubic-bezier(0, 0, 0.58, 1);
  -webkit-animation: fadeinout 3s cubic-bezier(0, 0, 0.58, 1); /* Safari, Chrome 등 */

  /* 나타나는 + 사라지는 애니메이션 */
  @keyframes fadeinout {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @-webkit-keyframes fadeinout {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const ErrorMessageBox = styled(ToastMessage)`
  background: rgba(80, 15, 15, 0.8);
  user-select: none; /* ✅ 텍스트 선택 방지 */
`;
