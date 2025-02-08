/**
 * 파일명: EditingToast.tsx
 * 작성일: 2025-02-07
 * 작성자: 이서연
 * 설명: 메모 작성 기능 구현
 */

import React from 'react';
import styled from 'styled-components';
import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

interface EditingToastProps {
  toastId: string;
  title: string;
  content: string;
  setContent: (content: string) => void;
  isBurnt: boolean;
}

export default function EditingToast({
  toastId,
  title,
  content,
  setContent,
  isBurnt,
}: EditingToastProps) {
  const { token } = useAuth();

  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    try {
      console.log('📌 PATCH 요청 전 확인:', { toastId, title, content });

      const response = await fetch(`${API_BASE_URL}/api/memos/${toastId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title, content: newContent }), // ✅ 현재 제목도 함께 업데이트
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
        isBurnt={isBurnt}
      ></StyledTextArea>
    </div>
  );
}

const StyledTextArea = styled.textarea<{ isBurnt: boolean }>`
  width: 100%;
  min-height: 610px;

  flex: 1 0 0;
  align-self: stretch;
  color: ${({ isBurnt }) => (!isBurnt ? 'var(--brown, #473728)' : '#E5DCCA')};
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
  background: ${({ isBurnt }) => (!isBurnt ? '#e5dcca' : '#806952')};

  ::-webkit-scrollbar {
    display: none;
  }
`;
