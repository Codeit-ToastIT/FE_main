/**
 * 파일명: memoInput/page.tsx
 * 작성일: 2025-02-06
 * 작성자: 이서연
 * 설명: 메모 작성 기능 구현
 */

'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import { useMemoContext } from '../../context/MemoContext';

import MemoHeader from '../../components/layout/MemoHeader';
import MemoBody from '../../components/common/EditingToast';

export default function MemoInput() {
  const searchParams = useSearchParams();
  const toastId = searchParams.get('id') || '';
  const { memos } = useMemoContext();

  // ✅ 현재 toastId에 해당하는 메모 찾기
  const memo = memos.find((memo) => memo.id === toastId);

  // ✅ 제목과 본문을 부모에서 상태로 관리
  const [title, setTitle] = useState(memo ? memo.title : '');
  const [content, setContent] = useState(memo ? memo.content : '');

  return (
    <Container>
      {/* ✅ 상태를 props로 전달 */}
      <StyledMemoHeader toastId={toastId} title={title} setTitle={setTitle} content={content} />
      <HeaderBottomStyle />
      <StyledMemoBody toastId={toastId} title={title} content={content} setContent={setContent} />
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
  height: 575px;
  padding: 32px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  z-index: 1; /* ✅ HeaderBottomStyle보다 아래 */
`;
