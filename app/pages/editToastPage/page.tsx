'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import useSearchParams from '../../hooks/useCustomSearchParams';
import { useMemoContext } from '../../context/MemoContext';
import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import MemoHeader from './MemoHeader';
import MemoBody from '../../components/common/EditingToast';

const EditToastPage = () => {
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
      console.log(`데이터!!!!!!!!!!!!!!🍊🍊🍊🍊: ${memo.title}`);
      setTitle(memo.title);
      setContent(memo.content);
    }
  }, [memo]);

  useEffect(() => {
    fetchCategories();
    fetchMemoDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ fetchMemos에 원하는 카테고리를 전달하기 위해 작성한 코드
  const [_lastCategoryId, setLastCategoryId] = useState('');

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

      const categoryIdLast = data.categories[4]?.id;
      if (categoryIdLast) {
        setLastCategoryId(categoryIdLast);
        fetchMemos(categoryIdLast); // ✅ 4번 인덱스 카테고리 ID로 메모 가져오기 실행
      }
    } catch (error) {
      console.error('❌ 메모 카테고리 목록 불러오기 오류:', error);
    }
  };

  const fetchMemoDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/memos/${toastId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`❌ 서버 응답 오류: ${errorData}`);
        throw new Error('❌ 메모 불러오기 실패');
      }

      const data = await response.json();
      console.log('✅ 메모 불러오기 성공:', data);

      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      console.error('❌ 메모 불러오기 오류:', error);
    }
  };

  const updateMemo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/memos/${toastId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('✅ 메모 수정 성공:', data);
        alert(data.message);
        fetchMemos(_lastCategoryId); // ✅ 메모 목록 갱신
      } else {
        console.error('❌ 메모 수정 실패:', data);
        alert(data.message);
      }
    } catch (error) {
      console.error('❌ 메모 수정 오류:', error);
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
        onSave={updateMemo} // ✅ 저장 버튼 클릭 시 updateMemo 함수 호출
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
};

export default EditToastPage;

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
