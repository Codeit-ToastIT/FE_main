/**
 * 파일명: body.tsx
 * 작성일: 2025-01-18
 * 작성자: 이서연
 * 설명: home 화면 속 body 컴포넌트 구현.
 */

import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';

// import required modules
import { EffectCoverflow } from 'swiper/modules';

import Image from 'next/image';

import deleteIcon from '../../assets/icons/delete_button_icon.png';
import ToastFrame from './toast';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  height: 579px; /* 테스트용 높이 설정 */
  position: relative;
  overflow: hidden; /* 밖으로 이미지가 나오지 않게 설정 */
`;

const DeleteIcon = styled(Image)`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer; /* 클릭 가능하게 설정 */
`;

const Toast = styled(ToastFrame)`
  cursor: pointer;
`;

const Body: React.FC = ({}) => {
  return (
    <HeaderContainer>
      <DeleteIcon src={deleteIcon} alt="Delete" width={40} height={40} />
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        coverflowEffect={{
          rotate: -20,
          stretch: 250,
          depth: 230,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={true}
        modules={[EffectCoverflow]}
        style={{
          position: 'absolute',
          top: '50%', // 부모 컨테이너의 50% 아래로
          left: '50%', // 부모 컨테이너의 50% 오른쪽으로
          transform: 'translate(-50%, -50%)', // 중앙 정렬
        }}
      >
        <SwiperSlide
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Toast />
        </SwiperSlide>
        <SwiperSlide
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Toast />
        </SwiperSlide>
        <SwiperSlide
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Toast />
        </SwiperSlide>
      </Swiper>
    </HeaderContainer>
  );
};

export default Body;
