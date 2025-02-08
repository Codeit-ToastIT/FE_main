'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import useSearchParams from '../../hooks/useCustomSearchParams';

import { useMemoContext } from '../../context/MemoContext';
import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

import MemoHeader from '../../components/layout/MemoHeader';
import MemoBody from '../../components/common/EditingToast';

export default function MemoInput() {
  const searchParams = useSearchParams();
  const toastId = searchParams.get('id') || '';
  const { memos, fetchMemos } = useMemoContext();
  const { token, userId } = useAuth();

  // ✅ toastId에 해당하는 메모 찾기
  const memo = memos.find((memo) => memo.id === toastId);

  // ✅ 제목과 본문을 부모에서 상태로 관리
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // ✅ memos가 업데이트될 때, title과 content도 갱신
  useEffect(() => {
    if (memo) {
      setTitle(memo.title);
      setContent(memo.content);
    }
  }, [memo]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ fetchMemos에 원하는 카테고리를 전달하기 위해 작성한 코드
  const [lastCategoryId, setLastCategoryId] = useState('');

  const fetchCategories = async () => {
    try {
      console.log(`🔗 요청 URL: ${API_BASE_URL}/api/categories/${userId}`);

      const response = await fetch(`${API_BASE_URL}/api/categories/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`📩 응답 상태 코드: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`❌ 서버 응답 오류: ${errorData}`);
        throw new Error('❌ 메모 카테고리 목록 불러오기 실패');
      }

      const data = await response.json();
      console.log('✅ 메모 카테고리 목록 가져오기 성공:', data);

      const categoryId = data.categories[4]?.id;
      if (categoryId) {
        setLastCategoryId(categoryId);
        fetchMemos(categoryId); // ✅ 4번 인덱스 카테고리 ID로 메모 가져오기 실행
      }
    } catch (error) {
      console.error('❌ 메모 카테고리 목록 불러오기 오류:', error);
    }
  };

  return (
    <Container>
      {/* ✅ 상태를 props로 전달 */}
      <StyledMemoHeader
        toastId={toastId}
        title={title}
        setTitle={setTitle}
        content={content}
        isBurnt={true}
      />
      <HeaderBottomStyle />
      <StyledMemoBody
        toastId={toastId}
        title={title}
        content={content}
        setContent={setContent}
        isBurnt={true}
      />
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
  background: #806952;
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
