/**
 * 파일명: EditingToast.tsx
 * 작성일: 2025-01-27
 * 작성자: 이서연
 * 설명: editing 메모 화면 body 부분(메모 작성 area) UI 설계.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface EditingToastProps {
  toastId: string; // 고유한 toastId를 props로 받음
}

export default function EditingToast({ toastId }: EditingToastProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (toastId) {
      const savedMemo = localStorage.getItem(`memo_${toastId}`);
      if (savedMemo) setText(savedMemo);
    }
  }, [toastId]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    localStorage.setItem(`memo_${toastId}`, newText); // ID별로 저장
  };

  return (
    <div>
      <StyledTextArea value={text} onChange={handleTextChange}></StyledTextArea>
    </div>
  );
}

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 310px;
  flex: 1 0 0;
  align-self: stretch;
  color: var(--brown, #473728);
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 125% */
  border: none;
  outline: none;
  background: none;
  resize: none;
  padding: 0px 32px 32px 32px;
  background: var(--ivory);

  ::-webkit-scrollbar {
    display: none;
  }
`;
