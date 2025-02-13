/**
 * 파일명: MemoHeader.tsx
 * 작성일: 2025-02-07
 * 작성자: 이서연
 * 설명: 메모 작성 기능 구현
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

import iconBack from '../../assets/icons/icon_back.svg';
import iconTrash from '../../assets/icons/icon_trash.svg';

import DeleteModal from '../common/DeleteModal';

interface MemoHeaderProps {
  toastId: string;
  title: string;
  setTitle: (title: string) => void;
  content: string; // ✅ 본문도 함께 요청해야함
  isBurnt: boolean;
}

export default function MemoHeader({
  toastId,
  title,
  setTitle,
  content,
  isBurnt,
}: MemoHeaderProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [_loading, setLoading] = useState(false);
  const { token } = useAuth();
  const [debouncedTitle, setDebouncedTitle] = useState(title); // 0.3초 뒤 저장할 값
  const [isTitleCleared, setIsTitleCleared] = useState(false); // ✅ 사용자가 직접 ""을 입력했는지 여부 저장

  // 🔹 title이 ISO 8601 형식(날짜+시간)인지 확인하는 함수
  const hasTimestamp = (str: string) => {
    const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/;
    return isoDateTimeRegex.test(str);
  };

  // ✅ 사용자가 입력할 때 즉시 setTitle 업데이트 (UI 반영)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsTitleCleared(e.target.value.trim() === ''); // ✅ 사용자가 직접 ""을 입력하면 true 설정
  };

  // ✅ 입력이 멈춘 후 0.3초 뒤에 debouncedTitle 업데이트
  useEffect(() => {
    const handler = setTimeout(() => {
      if (hasTimestamp(title)) {
        setDebouncedTitle(''); // ISO 8601 형식이면 빈 문자열 저장
      } else {
        setDebouncedTitle(title); // 사용자가 입력한 값 유지
      }
    }, 300);

    return () => clearTimeout(handler); // 새로운 입력이 있으면 기존 타이머 취소
  }, [title]);

  // ✅ debouncedTitle이 변경될 때 PATCH 요청 보내기 (자동 저장)
  useEffect(() => {
    if (!debouncedTitle || !toastId) return; // 값이 없으면 실행 안 함
    if (!content) return;

    const saveTitle = async () => {
      try {
        console.log('📌 PATCH 요청 전 확인:', { toastId, debouncedTitle, content });

        const response = await fetch(`${API_BASE_URL}/api/memos/${toastId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: debouncedTitle, content }), // ✅ 0.3초 후 자동 저장
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('❌ 서버 응답 상태:', response.status);
          console.error('❌ 서버 응답 메시지:', data);
          throw new Error(`메모 제목 수정 실패: ${data.message || '알 수 없는 오류'}`);
        }

        console.log('✅ 메모 제목 수정 성공:', data);
      } catch (error) {
        console.error('❌ 메모 제목 수정 요청 오류:', error);
      }
    };

    saveTitle();
  }, [debouncedTitle, toastId, token, content]); // ✅ debouncedTitle이 변경될 때 PATCH 요청 실행

  const handleBackClick = () => {
    if (isTitleCleared) {
      setTitle(new Date().toISOString().split('T')[0]); // ✅ 사용자가 빈 제목을 입력한 경우 오늘 날짜 설정
    } else if (hasTimestamp(title)) {
      setTitle(new Date().toISOString().split('T')[0]); // ✅ 사용자가 빈 제목을 입력한 경우 오늘 날짜 설정
    }
    window.history.back();
  };

  const handleDeleteClick = () => {
    setShowModal(true); // ✅ 삭제 모달 띄우기
  };

  // ✅ 삭제 실패 상태를 localStorage에 저장하도록 변경
  const handleDeleteMemo = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/memos/${toastId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ 메모 삭제 성공:', data.message);

        // ✅ localStorage에 삭제된 메모 ID & 성공 여부 저장
        localStorage.setItem('deletedMemoId', toastId);
        localStorage.setItem('deleteSuccess', 'true');

        setTimeout(() => {
          router.push('/pages/createToastPage');
        }, 900); // 0.9초 후 이동
        return true;
      } else {
        console.error('❌ 메모 삭제 실패:', data.message);

        // ✅ localStorage에 삭제 실패 여부 저장
        localStorage.setItem('deleteSuccess', 'false');
        return false;
      }
    } catch (error) {
      console.error('❌ 메모 삭제 요청 오류:', error);
      localStorage.setItem('deleteSuccess', 'false');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeaderContainer isBurnt={isBurnt}>
      <IconBack src={iconBack} alt="Back" onClick={handleBackClick} />
      <TitleInput
        type="text"
        placeholder="토스트의 제목을 입력해주세요"
        value={hasTimestamp(title) ? '' : title} // ✅ 사용자가 직접 입력한 ""은 유지
        onChange={handleTitleChange}
      />
      <IconTrash src={iconTrash} alt="Trash" onClick={handleDeleteClick} />
      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onClick={handleDeleteMemo}
      />
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header<{ isBurnt: boolean }>`
  display: flex;
  height: 60px;
  padding: 12px 16px 8px 16px;
  justify-content: center;
  align-items: center;
  background: ${({ isBurnt }) => (isBurnt ? '#806952' : '#e5dcca')};
`;

const IconBack = styled(Image)`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  padding: 8px;
  border-radius: 40px;
  background: var(--black, #171612);
  cursor: pointer;
`;

const TitleInput = styled.input`
  width: 263px;
  height: 40px;
  flex-shrink: 0;
  padding: 8px 20px;
  border-radius: 40px;
  background: var(--black, #171612);
  border: none;
  outline: none;
  color: var(--ivory, #e5dcca);

  font-family: 'SUIT Variable';
  font-size: 16px;
  font-weight: 800;
  line-height: 20px; /* 125% */

  /* 말줄임표를 위한 설정 */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  ::placeholder {
    color: var(--ivory, #e5dcca);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const IconTrash = styled(Image)`
  display: flex;
  width: 40px;
  height: 40px;
  padding: 8px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 40px;
  background: var(--black, #171612);
  cursor: pointer;
`;
