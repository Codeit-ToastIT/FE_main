/**
 * 파일명: EditingToast.tsx
 * 작성일: 2025-02-08
 * 작성자: 이서연
 * 설명: 메모 작성 기능 구현(3초 뒤 자동저장으로 구현)
 */

import React, { useState, useEffect } from 'react';
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
  const [debouncedContent, setDebouncedContent] = useState(content); // 1초 뒤 저장할 값

  // ✅ 사용자가 입력할 때 즉시 setContent 업데이트 (UI 반영)
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // ✅ 입력이 멈춘 후 1초 뒤에 debouncedContent 업데이트
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedContent(content);
    }, 3000);

    return () => clearTimeout(handler); // 새로운 입력이 있으면 기존 타이머 취소
  }, [content]);

  // ✅ debouncedContent가 변경될 때 PATCH 요청 보내기 (자동 저장)
  useEffect(() => {
    if (!debouncedContent || !toastId) return; // 값이 없으면 실행 안 함

    const saveContent = async () => {
      try {
        console.log('📌 PATCH 요청 전 확인:', { toastId, title, debouncedContent });

        const response = await fetch(`${API_BASE_URL}/api/memos/${toastId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content: debouncedContent }), // ✅ 1초 후 자동 저장
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('❌ 서버 응답 상태:', response.status);
          console.error('❌ 서버 응답 메시지:', data);
          throw new Error(`메모 본문 수정 실패: ${data.message || '알 수 없는 오류'}`);
        }

        console.log('✅ 메모 본문 수정 성공:', data);
      } catch (error) {
        console.error('❌ 메모 본문 수정 요청 오류:', error);
      }
    };

    saveContent();
  }, [debouncedContent]); // ✅ debouncedContent가 변경될 때만 PATCH 요청 실행

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
