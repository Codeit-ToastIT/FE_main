/**
 * 파일명: memoInput/page.tsx
 * 작성일: 2025-02-06
 * 작성자: 이서연
 * 설명: 메모 작성 기능 구현
 */

'use client';

import React from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import MemoHeader from '../../components/layout/MemoHeader';
import MemoBody from '../../components/common/EditingToast';

export default function MemoInput() {
  const searchParams = useSearchParams();
  const toastId = searchParams.get('id') || '';

  return (
    <Container>
      <StyledMemoHeader toastId={toastId} /> {/*id 쿼리 파라미터 props로 전달 */}
      <HeaderBottomStyle />
      <StyledMemoBody toastId={toastId} /> {/*id 쿼리 파라미터 props로 전달 */}
    </Container>
  );
}

const Container = styled.div`
  background: var(--ivory);
  height: 635px;
`;

const StyledMemoHeader = styled(MemoHeader)`
  width: 343px;
  height: 60px;
`;

const HeaderBottomStyle = styled.div`
  width: 375px;
  height: 34px;
  background: linear-gradient(180deg, #e5dcca 0%, rgba(229, 220, 202, 0) 100%);
  z-index: 2; /* ✅ StyledMemoBody 위에 배치 */
`;

const StyledMemoBody = styled(MemoBody)`
  position: relative;
  display: flex;
  width: 100%;
  height: 374px;
  padding: 32px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  z-index: 1; /* ✅ HeaderBottomStyle보다 아래 */
`;
