/**
 * 파일명: toast.tsx
 * 작성일: 2025-01-18
 * 작성자: 이서연
 * 설명: 기본 toast 컴포넌트 구현.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import Toast1 from '../../assets/toasts/toast1.png';
import Toast2 from '../../assets/toasts/toast2.png';
import Toast3 from '../../assets/toasts/toast3.png';
import Toast4 from '../../assets/toasts/toast4.png';
import Toast5 from '../../assets/toasts/toast5.png';

const Toasts = styled(Image)`
  display: block;
  cursor: pointer; /* 클릭 가능하게 설정 */
`;

const toastImages = [Toast1, Toast2, Toast3, Toast4, Toast5]; // 이미지 배열

const Toast: React.FC = () => {
  const [toastNumber, setToastNumber] = useState<string>(toastImages[0].src);

  useEffect(() => {
    // 랜덤으로 이미지 선택
    const randomToast = toastImages[Math.floor(Math.random() * toastImages.length)];
    setToastNumber(randomToast.src);
  }, []); // 컴포넌트가 처음 렌더링될 때 실행

  return <Toasts src={toastNumber} alt="RandomToast" width={296} height={320} />;
};

export default Toast;
