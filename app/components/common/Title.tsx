/**
 * 파일명: title.tsx
 * 작성일: 2025-01-24
 * 작성자: 이서연
 * 설명: title 컴포넌트 UI 설계.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export default function Title() {
  const [memoTitle, setMemoTitle] = useState<string>('');

  useEffect(() => {
    // 백엔드에서 메모 제목데이터 불러오기
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

  return <MemoTitleDisplay>{memoTitle || null}</MemoTitleDisplay>;
}

const MemoTitleDisplay = styled.div`
  position: absolute;
  top: 0.1%;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  outline: none;
  display: flex;
  width: 280px;
  height: 24px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;
