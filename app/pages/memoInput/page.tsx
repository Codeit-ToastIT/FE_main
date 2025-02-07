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
import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

import MemoHeader from '../../components/layout/MemoHeader';
import MemoBody from '../../components/common/EditingToast';

export default function MemoInput() {
  const searchParams = useSearchParams();
  const toastId = searchParams.get('id') || '';
  const { token } = useAuth();

  // ✅ 제목과 본문을 부모에서 상태로 관리
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // ✅ 처음 로드될 때 서버에서 기존 데이터를 가져오기
  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/memos/${toastId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('메모 불러오기 실패');
        const data = await response.json();

        setTitle(data.note.title);
        setContent(data.note.content);
      } catch (error) {
        console.error('❌ 메모 불러오기 오류:', error);
      }
    };

    if (toastId) {
      fetchMemo();
    }
  }, [toastId, token]);

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
  height: 374px;
  padding: 32px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  z-index: 1; /* ✅ HeaderBottomStyle보다 아래 */
`;
