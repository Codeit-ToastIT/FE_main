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

const toastImages = [Toast1, Toast2, Toast3, Toast4, Toast5];

const Toast: React.FC = () => {
  const [toastNumber, setToastNumber] = useState<string>(toastImages[0].src);
  const [memo, setMemo] = useState<string>(() => {
    // 컴포넌트가 처음 로드될 때 저장된 메모 불러오기
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userMemo') || '';
    }
    return '';
  });

  useEffect(() => {
    const randomToast = toastImages[Math.floor(Math.random() * toastImages.length)];
    setToastNumber(randomToast.src);
  }, []);

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemo(e.target.value);
  };

  return (
    <ToastContainer>
      <StyledToastImage src={toastNumber} alt="RandomToast" width={296} height={320} priority />
      <MemoInput placeholder="메모를 입력하세요..." value={memo} onChange={handleMemoChange} />
    </ToastContainer>
  );
};

export default Toast;

const ToastContainer = styled.div`
  position: relative;
  width: 296px;
  height: 320px;
`;

const StyledToastImage = styled(Image)`
  display: block;
  border-radius: 10px;
`;

const MemoInput = styled.textarea`
  position: absolute;
  top: 20%; /* 이미지 내 적절한 위치로 조정 */
  left: 45%;
  transform: translateX(-50%);
  width: 208px;
  height: 240px;
  background: transparent;
  border: none;
  font-size: 12px;
  font-family: 'SUIT', sans-serif;
  font-weight: 600;
  line-height: 15px;
  color: #974b00;
  text-align: left;
  resize: none;
  outline: none;
  padding: 8px;
  box-sizing: border-box;

  &::placeholder {
    color: #974b00;
  }
`;
