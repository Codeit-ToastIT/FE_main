/**
 * 파일명: memoInput/page.tsx
 * 작성일: 2025-01-27
 * 작성자: 이서연
 * 설명: 메모 작성 화면 UI 설계.
 */

'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import MemoHeader from '../../components/layout/MemoHeader';
import MemoBody from '../../components/common/EditingToast';

export default function MemoInput() {
  return (
    <Container>
      <MemoHeader />
      <StyledMemoBody />
    </Container>
  );
}

const Container = styled.div`
  background: var(--ivory);
  height: 635px;
`;

const StyledMemoBody = styled(MemoBody)`
  display: flex;
  width: 375px;
  height: 374px;
  padding: 32px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;
