/**
 * 파일명: home.tsx
 * 작성일: 2025-01-24
 * 작성자: 이서연
 * 설명: 메모 추가 UI 설계.
 */

import React from 'react';
import Header from '../../components/layout/header';
import Body from '../../components/common/body';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { EffectCoverflow } from 'swiper/modules';

interface HomeProps {
  onHelpClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onHelpClick }) => {
  return (
    <div>
      <Header title="TOAST IT" onHelpClick={onHelpClick} />
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
          <Body />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Home;
