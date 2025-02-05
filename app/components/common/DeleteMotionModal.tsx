import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import toast1Noyum from '../../../public/toasts/toast_large_1_noyum.png';
import toast2Noyum from '../../../public/toasts/toast_large_2_noyum.png';
import toast3Noyum from '../../../public/toasts/toast_large_3_noyum.png';
import toast4Noyum from '../../../public/toasts/toast_large_4_noyum.png';
import toast5Noyum from '../../../public/toasts/toast_large_5_noyum.png';
import toast1yum from '../../../public/toasts/toast_large_1_yum.png';
import toast2yum from '../../../public/toasts/toast_large_2_yum.png';
import toast3yum from '../../../public/toasts/toast_large_3_yum.png';
import toast4yum from '../../../public/toasts/toast_large_4_yum.png';
import toast5yum from '../../../public/toasts/toast_large_5_yum.png';
import toast1yumyum from '../../../public/toasts/toast_large_1_yumyum.png';
import toast2yumyum from '../../../public/toasts/toast_large_2_yumyum.png';
import toast3yumyum from '../../../public/toasts/toast_large_3_yumyum.png';
import toast4yumyum from '../../../public/toasts/toast_large_4_yumyum.png';
import toast5yumyum from '../../../public/toasts/toast_large_5_yumyum.png';

interface DeleteMotionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteMotionModal({ isOpen, onClose }: DeleteMotionModalProps) {
  const [currentStep, setCurrentStep] = useState(0); // ✅ 현재 보여줄 이미지 단계
  const [selectedSet, setSelectedSet] = useState(0); // ✅ 선택된 세트 인덱스

  // ✅ 5개의 세트 정의
  const toastSets = [
    [toast1Noyum, toast1yum, toast1yumyum],
    [toast2Noyum, toast2yum, toast2yumyum],
    [toast3Noyum, toast3yum, toast3yumyum],
    [toast4Noyum, toast4yum, toast4yumyum],
    [toast5Noyum, toast5yum, toast5yumyum],
  ];

  useEffect(() => {
    if (isOpen) {
      // ✅ 모달이 열릴 때 랜덤한 세트 선택
      const randomSet = Math.floor(Math.random() * toastSets.length);
      setSelectedSet(randomSet);

      // ✅ 0.5초마다 다음 이미지로 변경 (0 → 1 → 2)
      const timer1 = setTimeout(() => setCurrentStep(1), 500);
      const timer2 = setTimeout(() => setCurrentStep(2), 1000);
      const timer3 = setTimeout(() => onClose(), 1500); // ✅ 마지막 이미지 후 모달 닫기

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay>
      <StyledImage src={toastSets[selectedSet][currentStep]} alt="toast_animation" />
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledImage = styled(Image)`
  width: 236.8px; /* 기존 296px의 80% */
  height: 256px; /* 기존 320px의 80% */
  transition: opacity 0.5s ease-in-out;
`;
