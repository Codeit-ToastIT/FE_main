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

export default function Body() {
  const [showPlus, setShowPlus] = useState(false);

  const [slides, setSlides] = useState<number[]>([1, 2, 3]);

  const [selectedSlide, setSelectedSlide] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [swiperKey, setSwiperKey] = useState(0); // ✅ Swiper 리렌더링을 위한 Key 추가

  const [showToastMessage, setShowToastMessage] = useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [isSwiperActive, setIsSwiperActive] = useState(false);

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

  // ✅ "휴지통 아이콘" 클릭 시 모달 열기
  const handleModalToggle = (id: number) => {
    setSelectedSlide(id); // 현재 선택된 슬라이드 저장
    setShowModal(true);
  };

  // ✅ "먹어버리기" 버튼 클릭 시 슬라이드 삭제 및 정리
  const handleDeleteToast = () => {
    if (selectedSlide !== null) {
      setSlides((prevSlides) => {
        let newSlides = prevSlides.filter((slide) => slide !== selectedSlide);

        if (newSlides.length === 0) {
          // ✅ 양쪽에 토스트가 없으면 새로운 토스트 추가
          newSlides = [selectedSlide + 1];
        }

        return newSlides;
      });
      setShowDeleteMessage(true);

      setSwiperKey((prev) => prev + 1);
      setShowModal(false);
    }
  };

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

  const handleTouchEnd = () => {
    if (showPlus) {
      setShowToastMessage(true);
      setSlides((prevSlides) => [prevSlides.length + 1, ...prevSlides].slice(0, 3));
    }
    setShowPlus(false);
    setDragging(false);
    if (bodyRef.current) {
      bodyRef.current.style.transition = 'transform 0.3s ease-out';
      bodyRef.current.style.transform = 'translateX(0px)';
    }
    setTimeout(() => bodyRef.current && (bodyRef.current.style.transition = ''), 300);
  };

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
        onClick={() => handleModalToggle(slides[0])}
        priority
      />

      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={Math.min(3, slides.length)}
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
        onTouchStart={() => setIsSwiperActive(true)}
        onTouchEnd={() => setIsSwiperActive(false)}
      >
        {slides.map((id) => (
          <StyledSwiperSlide key={id}>
            <StyledBasicToast />
          </StyledSwiperSlide>
        ))}
      </Swiper>

      {showToastMessage && <ToastMessage>새 토스트를 추가했어요.</ToastMessage>}
      {showDeleteMessage && <ToastMessage>토스트 하나를 버렸어요.</ToastMessage>}
      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteToast}
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
