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
  toastNumber: number; // ✅ toastNumber 추가
}

export default function DeleteMotionModal({
  isOpen,
  onClose,
  toastNumber,
}: DeleteMotionModalProps) {
  const [currentStep, setCurrentStep] = useState(0); // ✅ 현재 보여줄 이미지 단계
  // const [selectedSet, setSelectedSet] = useState(0); // ✅ 선택된 세트 인덱스

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
      // // ✅ 모달이 열릴 때 랜덤한 세트 선택
      // const randomSet = Math.floor(Math.random() * toastSets.length);
      // setSelectedSet(randomSet);
      setCurrentStep(0); // 애니메이션 초기화

      // ✅ 0.2초마다 다음 이미지로 변경 (0 → 1 → 2)
      const timer1 = setTimeout(() => setCurrentStep(1), 300);
      const timer2 = setTimeout(() => setCurrentStep(2), 600);
      const timer3 = setTimeout(() => onClose(), 900); // ✅ 마지막 이미지 후 모달 닫기

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [toastSets.length, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay>
      <StyledImage src={toastSets[toastNumber - 1][currentStep]} alt="toast_animation" />
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledImage = styled(Image)`
  width: 296px;
  height: 320px;
  transition: opacity 0.5s ease-in-out;
`;
