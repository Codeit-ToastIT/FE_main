'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';

import MemoBody from '../../components/common/EditingToast';

export default function MemoInput() {
  const searchParams = useSearchParams();
  const toastId = searchParams.get('id') || '';

  // ✅ 제목과 본문을 부모에서 상태로 관리
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return <Container>{/* ✅ 상태를 props로 전달 */}</Container>;
}

const Container = styled.div`
  background: var(--ivory);
  height: 635px;
`;

const HeaderBottomStyle = styled.div`
  width: 375px;
  height: 34px;
  background: #806952;
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
