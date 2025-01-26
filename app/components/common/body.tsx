/**
 * 파일명: body.tsx
 * 작성일: 2025-01-24
 * 작성자: 이서연
 * 설명: body 컴포넌트 리팩토링.
 */

import React from 'react';
import styled from 'styled-components';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { EffectCoverflow } from 'swiper/modules';
import Image from 'next/image';

import iconTrash from '../../assets/icons/icon_trash.svg';
import BasicToast from './BasicToast';
import Title from './Title';

export default function Body() {
  const slides = [1, 2, 3];

  return (
    <HeaderContainer>
      <IconTrash src={iconTrash} alt="Trash" priority />
      <Swiper
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView={3}
        coverflowEffect={{
          rotate: -20,
          stretch: 250,
          depth: 95,
          modifier: 1,
          slideShadows: false,
        }}
        pagination
        modules={[EffectCoverflow]}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {slides.map((_, index) => (
          <StyledSwiperSlide key={index}>
            <StyledTitle />
            <StyledBasicToast />
          </StyledSwiperSlide>
        ))}
      </Swiper>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  height: 80vh;
  position: relative;
  overflow: hidden;
`;

const IconTrash = styled(Image)`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  display: flex;
  width: 40px;
  height: 40px;
  padding: 8px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 40px;
  background: var(
    --black,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    #171612
  );
`;

const StyledSwiperSlide = styled(SwiperSlide)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 360px;
`;

const StyledTitle = styled(Title)`
  display: flex;
  width: 280px;
  height: 24px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin: 16px;
`;

const StyledBasicToast = styled(BasicToast)`
  cursor: pointer;
  box-sizing: border-box
  width: 296px;
  height: 320px;
  flex-shrink: 0;
`;
