/**
 * 파일명: BasicToast.tsx
 * 작성일: 2025-02-06
 * 작성자: 이서연
 * 설명: 메모 작성 기능 관련 수정.
 */
'use client';

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

interface ToastProps {
  className?: string; // ✅ className 추가
  toastid?: string;
  title: string; // ✅ title 추가
  content: string; // ✅ content 추가
  toastnumber: number;
}

export default function BasicToast({
  className,
  toastid,
  title,
  content,
  toastnumber,
}: ToastProps) {
  const router = useRouter();

  // ✅ 안전한 toastnumber 인덱스 설정 (1~5 범위 유지)
  // const validToastNumber =
  //   Number.isInteger(toastnumber) && toastnumber >= 1 && toastnumber <= 5 ? toastnumber : 1;
  const toastNumber = toastImages[toastnumber - 1]?.src ?? toastImages[0].src; // ✅ 안전한 접근

  const handleToastClick = () => {
    router.push(`/pages/memoInput?id=${toastid}`); // ✅ ID 포함하여 이동
  };

  // 🔹 title이 ISO 8601 형식(날짜+시간)인지 확인하는 함수
  const hasTimestamp = (str: string) => {
    const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/;
    return isoDateTimeRegex.test(str);
  };

  // ✅ title이 ISO 8601 날짜+시간 형식이면 빈 문자열로 변경
  const formattedTitle = hasTimestamp(title) ? '' : title;

  return (
    <ToastContainer className={className} onClick={handleToastClick}>
      {formattedTitle && <MemoTitleDisplay>{formattedTitle}</MemoTitleDisplay>}
      <StyledToastImage src={toastNumber} alt="RandomToast" width={296} height={320} priority />
      <MemoDisplay>{content.trim() === '' ? '새로운 토스트를 작성해볼까요?' : content}</MemoDisplay>
    </ToastContainer>
  );
}

const ToastContainer = styled.div`
  position: relative;
  width: 296px;
  height: 360px;
  cursor: pointer;
`;

const StyledToastImage = styled(Image)`
  position: absolute;
  top: 40px;
  left: 0px;
  display: block;
  border-radius: 10px;
  width: 296px;
  height: 320px;
  flex-shrink: 0;
  z-index: -10;
`;

const MemoTitleDisplay = styled.div`
  position: relative;
  margin-bottom: 16px;
  background: transparent;
  border: none;
  outline: none;

  display: flex;
  width: 280px;
  height: 24px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  color: var(--black, #171612);
  text-align: center;

  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: 20px; /* 125% */
`;

const MemoDisplay = styled.div`
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  outline: none;

  width: 296px;
  height: 295px;
  padding: 40px 44px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;

  flex: 1 0 0;
  align-self: stretch;

  display: -webkit-box;
  -webkit-line-clamp: 14;
  -webkit-box-orient: vertical;

  overflow: hidden;
  color: var(--caramel, #974b00);
  text-overflow: ellipsis;
  white-space: pre-wrap;

  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 15px; /* 125% */

  word-break: break-word; /* ✅ 단어가 길 경우 강제 줄바꿈 */
  overflow-wrap: break-word; /* ✅ 긴 단어가 있을 때 줄바꿈 보장 */
  align-items: center;
`;
