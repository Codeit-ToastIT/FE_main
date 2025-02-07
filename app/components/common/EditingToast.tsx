/**
 * 파일명: EditingToast.tsx
 * 작성일: 2025-02-06
 * 작성자: 이서연
 * 설명: editing 메모 화면 body 부분(메모 작성 area) UI 수정.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
// import { useMemoContext } from '../../context/MemoContext';

interface EditingToastProps {
  toastId: string;
  title: string;
  content: string;
  setContent: (content: string) => void;
}

export default function EditingToast({ toastId, title, content, setContent }: EditingToastProps) {
  const { token } = useAuth();

  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);

    try {
      console.log('📌 PATCH 요청 전 확인:', { toastId, title, content });

      const response = await fetch(`${API_BASE_URL}/api/memos/${toastId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, newText }), // ✅ 현재 제목도 함께 업데이트
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ 서버 응답 상태:', response.status);
        console.error('❌ 서버 응답 메시지:', data);
        throw new Error(`메모 본문 수정 실패: ${data.message || '알 수 없는 오류'}`);
      }

      // setContent(data.note.content);
      console.log('✅ 메모 본문 수정 성공:', data);
    } catch (error) {
      console.error('❌ 메모 본문 수정 요청 오류:', error);
    }
  };

  return (
    <div>
      <StyledTextArea
        value={content} // ✅ memo에서 가져온 값 사용
        onChange={handleTextChange}
      ></StyledTextArea>
    </div>
  );
}

const StyledTextArea = styled.textarea`
  width: 100%;
  height: 100vh;
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
