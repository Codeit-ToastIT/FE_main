/**
 * 파일명: MemoHeader.tsx
 * 작성일: 2025-02-06
 * 작성자: 이서연
 * 설명: 메모 삭제 로직 수정
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../api/AuthContext';

import iconBack from '../../assets/icons/icon_back.svg';
import iconTrash from '../../assets/icons/icon_trash.svg';

import DeleteModal from '../common/DeleteModal';

interface MemoHeaderProps {
  toastId: string;
  title: string;
  setTitle: (title: string) => void;
  content: string; // ✅ 본문도 함께 업데이트
}

export default function MemoHeader({ toastId, title, setTitle, content }: MemoHeaderProps) {
  const router = useRouter();
  // const [title, setTitle] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [_loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (toastId) {
      const savedTitle = localStorage.getItem(`memoTitle_${toastId}`);
      if (savedTitle) setTitle(savedTitle);
    }
  }, [toastId]);

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    try {
      const response = await fetch(`${API_BASE_URL}/api/memos/${toastId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle, content }), // ✅ 현재 내용도 함께 업데이트
      });

      if (!response.ok) {
        throw new Error('메모 수정 실패');
      }

      const data = await response.json();
      console.log('✅ 메모 제목 수정 성공:', data);

      // ✅ 서버에서 수정된 최신 데이터 반영
      setTitle(data.note.title);
    } catch (error) {
      console.error('❌ 메모 제목 수정 요청 오류:', error);
    }
  };

  const handleBackClick = () => {
    router.push('/pages/createToastPage');
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ 메모 삭제 성공:', data.message);

        // ✅ localStorage에서도 해당 메모 삭제
        localStorage.removeItem(`memoTitle_${toastId}`);
        localStorage.removeItem(`memo_${toastId}`);

        // ✅ 삭제 성공 상태 저장
        localStorage.setItem('deletedMemoId', toastId);
        localStorage.setItem('deleteSuccess', 'true');

        return true; // ✅ 삭제 성공 시 true 반환
      } else {
        console.error('❌ 메모 삭제 실패:', data.message);

        // ✅ 삭제 실패 상태 저장
        localStorage.setItem('deleteError', 'true');

        return false; // ✅ 삭제 실패 시 false 반환
      }
    } catch (error) {
      console.error('❌ 메모 삭제 요청 오류:', error);

      // ✅ 삭제 실패 상태 저장
      localStorage.setItem('deleteError', 'true');

      return false; // ✅ 오류 발생 시 false 반환
    } finally {
      setLoading(false);
      router.push('/pages/createToastPage'); // ✅ 홈 화면으로 이동
    }
  };

  return (
    <HeaderContainer>
      <IconBack src={iconBack} alt="Back" onClick={handleBackClick} />
      <TitleInput
        type="text"
        placeholder="토스트의 제목을 입력해주세요."
        value={title}
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

const HeaderContainer = styled.header`
  display: flex;
  height: 60px;
  padding: 12px 16px 8px 16px;
  justify-content: center;
  align-items: center;
  background: #e5dcca;
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
  font-family: SUIT;
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
