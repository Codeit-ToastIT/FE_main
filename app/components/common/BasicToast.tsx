/**
 * 파일명: BasicToast.tsx
 * 작성일: 2025-01-26
 * 작성자: 이서연
 * 설명: 기본 toast 컴포넌트 구현.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Toast1 from '../../../public/toasts/toast1.png';
import Toast2 from '../../../public/toasts/toast2.png';
import Toast3 from '../../../public/toasts/toast3.png';
import Toast4 from '../../../public/toasts/toast4.png';
import Toast5 from '../../../public/toasts/toast5.png';

const toastImages = [Toast1, Toast2, Toast3, Toast4, Toast5];

export default function Toast() {
  const [toastNumber, setToastNumber] = useState<string>(toastImages[0].src);
  const [memo, setMemo] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // 랜덤으로 토스트 이미지를 선택
    const randomToast = toastImages[Math.floor(Math.random() * toastImages.length)];
    setToastNumber(randomToast.src);

    // 백엔드에서 메모 데이터 불러오기
    //   const fetchMemo = async () => {
    //     try {
    //       const response = await fetch('/api/memo'); // 백엔드 API 엔드포인트
    //       if (response.ok) {
    //         const data = await response.json();
    //         setMemo(data.memo); // 받아온 데이터를 상태로 설정
    //       } else {
    //         console.error('Failed to fetch memo');
    //       }
    //     } catch (error) {
    //       console.error('Error fetching memo:', error);
    //     }
    //   };

    //   fetchMemo();
  }, []);

  // 클릭 시 메모 입력 페이지로 이동(임시 라우터 주소)
  const handleToastClick = () => {
    router.push('/memo-input');
  };

  return (
    <ToastContainer onClick={handleToastClick}>
      <StyledToastImage src={toastNumber} alt="RandomToast" width={296} height={320} priority />
      <MemoDisplay>{memo || '새로운 영감을 적어볼까요?'}</MemoDisplay>
    </ToastContainer>
  );
}

const ToastContainer = styled.div`
  position: relative;
  width: 296px;
  height: 320px;
  cursor: pointer;
`;

const StyledToastImage = styled(Image)`
  display: block;
  border-radius: 10px;
  width: 296px;
  height: 320px;
  flex-shrink: 0;
`;

const MemoDisplay = styled.div`
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  outline: none;
  display: flex;
  width: 296px;
  height: 320px;
  padding: 40px 44px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;
  flex: 1 0 0;
  align-self: stretch;
  overflow: hidden;
  color: var(--caramel, #974b00);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 15px; /* 125% */
`;
