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

import deleteIcon from '../../assets/icons/delete_button_icon.png';
import ToastFrame from './toast';

const Body: React.FC = () => {
  const slides = [1, 2, 3];

  return (
    <HeaderContainer>
      <DeleteIcon src={deleteIcon} alt="Delete" width={40} height={40} priority />
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
            <Toast />
          </StyledSwiperSlide>
        ))}
      </Swiper>
    </HeaderContainer>
  );
};

export default React.memo(Body);

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

const DeleteIcon = styled(Image)`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
`;

const Toast = styled(ToastFrame)`
  cursor: pointer;
`;

const StyledSwiperSlide = styled(SwiperSlide)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
