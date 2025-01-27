/**
 * 파일명: EditingToast.tsx
 * 작성일: 2025-01-27
 * 작성자: 이서연
 * 설명: editing 메모 화면 body 부분(메모 작성 area) UI 설계.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export default function EditingToast({ initialValue }) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(initialValue || '');
  }, [initialValue]);

  return (
    <>
      <StyledPadding />
      <StyledTextArea value={text} onChange={(e) => setText(e.target.value)}></StyledTextArea>
    </>
  );
}

const StyledPadding = styled.div`
  width: 375px;
  height: 34px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #e5dcca 0%, rgba(229, 220, 202, 0.2) 100%);
`;

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

  ::-webkit-scrollbar {
    display: none;
  }
`;
