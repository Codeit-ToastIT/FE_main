/**
 * 파일명: home.tsx
 * 작성일: 2025-01-24
 * 작성자: 이서연
 * 설명: header, body 스타일 수정.
 */

import React from 'react';
import styled from 'styled-components';
import Header from '../../components/layout/header';
import Body from '../../components/common/body';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { EffectCoverflow } from 'swiper/modules';

interface HomeProps {
  onHelpClick: () => void;
  onProfileClick: () => void;
}

export default function Home({ onHelpClick, onProfileClick }: HomeProps) {
  return (
    <div>
      <StyledHeader title="TOAST IT" onHelpClick={onHelpClick} onProfileClick={onProfileClick} />
      <Swiper
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView={1}
        coverflowEffect={{
          rotate: -20,
          stretch: 250,
          depth: 95,
          modifier: 1,
          slideShadows: false,
        }}
        pagination
        modules={[EffectCoverflow]}
      >
        <SwiperSlide>
          <StyledBody />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

const StyledHeader = styled(Header)`
  width: 375px;
  height: 56px;
  background: var(
    --black,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    #171612
  );
  box-sizing: border-box;
`;

const StyledBody = styled(Body)`
  width: 375px;
  height: 579px;
  border-radius: 40px 0px 0px 40px;
  background: #fff;
  box-sizing: border-box;
`;
